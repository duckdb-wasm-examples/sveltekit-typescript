<script lang="ts">
  import { initDB } from '$lib/duckdb'
  import Speech from '$lib/components/speech.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { browser } from '$app/env'
  import { base } from '$app/paths'
  // Allows the site to live on github.

  // Set up the db connection as an empty promise.
  $: conn_prom = new Promise(() => {})

  async function prep_db() {
    console.log("REPREPPING")
    const conn = await conn_prom;
    await conn.query(`CREATE TABLE p1 AS SELECT * FROM parquet_scan('SOTU.parquet')`)
    await conn.query(`CREATE VIEW wordcounts_raw AS SELECT * FROM (SELECT "@id" id, 
        UNNEST("nc:unigrams").word0 as word, 
        UNNEST("nc:unigrams").count as count FROM
         p1) t1
    `)
    await conn.query(`CREATE TABLE wordcounts AS SELECT * FROM 
      wordcounts_raw
      NATURAL JOIN (SELECT word, SUM(count) as tot, COUNT(*) AS df FROM wordcounts_raw GROUP BY word) t2
    `)
  }

  async function load_db() {
    // A simple case of a db of a single parquet file.
    const db = await initDB(`${base}/SOTU.parquet`, 'SOTU.parquet')
    // This resets the global conn_prom to a promise to the database.
    conn_prom = db.connect()
    prep_db()
    return conn_prom;    
  }

  // Only run in browser. I wonder if anyone can improve on this.
//  if (browser) {    
    load_db()
//  }

  const years = []
  // We could get this from the database, but no need to show off.
  for (let y = 1934; y < 2021; y++) {
    years.push(y)
  }

  $: results = new Promise(() => {}); // unresolved
  async function get_year(year) {
    const conn = await conn_prom;
    results = conn.query(`
      SELECT * FROM parquet_scan('SOTU.parquet') WHERE year == ${year}
    `)
  }

  // Start with FDR, because he's good.
  $: year = 1936;

  $: configuration = conn_prom.then(dcon => get_year(year))

</script>


<h1>Duck DB Svelte-kit demo</h1>

<div class="description">
  This is a demo of a static, database-driven page using duckdb WASM.
  All the primary text is stored in a parquet file structured to the <a href="https://nonconsumptive.org">
  nonconsumptive</a> text sharing spec. On load, it gets a copy of duckdb WASM and uses it to mount 
  the parquet file into the database. Clicking on any year will load the state of the Union address for that year.
</div>

<div class="years">
{#each years as y}
<div class="year" on:click={() => year = y}>{y}</div>
{/each}
</div>
{#await conn_prom}
   Preparing database...
  <Spinner></Spinner>
{:then conn}
  <Speech {results} />
{/await}

<style>
.years {
  display: flex;
  font-size: .75em;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  width: 90vw;
}
.year {
  cursor: pointer;
  padding: 0.1rem;
  border: 1px solid black;
  margin: 0.1rem;
}
.year:hover {
  background: lightgray;
}
</style>