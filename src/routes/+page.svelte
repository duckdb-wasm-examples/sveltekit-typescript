<script lang="ts">
	export let data;
	import { instantiateDuckDb } from '$lib/duckdb';
	import Speech from '$lib/components/speech.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { base } from '$app/paths';

	async function load_db() {
		console.log('LOADING DB');
		// A simple case of a db of a single parquet file.
		const db = await instantiateDuckDb();
		await db.registerFileURL('SOTU.parquet', `${base}/SOTU.parquet`, 4, false);
		const conn = await db.connect();
		await conn.query(`CREATE TABLE p1 AS SELECT * FROM parquet_scan('SOTU.parquet')`);
		return conn;
	}

	// Set up the db connection as an empty promise.
	const conn_prom = load_db();

	const years = [];
	// We could get this from the database, but no need to show off.
	for (let y = 1934; y < 2021; y++) {
		years.push(y);
	}

	$: results = new Promise(() => {});

	async function get_year(y) {
		//    year = y;
		const conn = await conn_prom;
		results = conn.query(`
      SELECT * FROM parquet_scan('SOTU.parquet') WHERE year == ${y}
    `);
		const result = await results;
	}

	// Start with FDR, because he's good.
	conn_prom.then(() => get_year(1936));
</script>

<h1>Duck DB Svelte-kit demo</h1>

<div class="description">
	This is a demo of a static, database-driven page using duckdb WASM. All the primary text is stored
	in a parquet file structured to the <a href="https://nonconsumptive.org"> nonconsumptive</a> text sharing
	spec. On load, it gets a copy of duckdb WASM and uses it to mount the parquet file into the database.
	Clicking on any year will load the state of the Union address for that year.
</div>

<div class="years">
	{#each years as y}
		<div class="year" on:click={() => get_year(y)}>{y}</div>
	{/each}
</div>
{#await results}
	<Spinner></Spinner>
{:then result}
	<Speech {results} />
{/await}

<style>
	.years {
		display: flex;
		font-size: 0.75em;
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
