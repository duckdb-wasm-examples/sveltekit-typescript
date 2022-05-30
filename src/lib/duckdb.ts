import * as duckdb from '@duckdb/duckdb-wasm';
import Worker from 'web-worker';
import { base } from '$app/paths'
globalThis.Worker = Worker; // polyfill Worker for node.

const DUCKDB_BUNDLES: duckdb.DuckDBBundles = {
	mvp: {
		mainModule:`${base}/duckdb-wasm-mvp.wasm`,
		mainWorker: `${base}/duckdb-wasm-mvp.worker`,
	},
	eh: {
		mainModule:`${base}/duckdb-wasm-eh.wasm`,
		mainWorker: `${base}/duckdb-wasm-eh.worker`,
	},
};

let db = null
export const initDB = async (path : string, fname : string) => {
  if (db) {
    return db
  }
  if (fname == undefined) {
    fname = path.split("/").pop()
  }
	const bundle = await duckdb.selectBundle(DUCKDB_BUNDLES);
	console.log({bundle})
	const logger = new duckdb.ConsoleLogger();
	const worker = new Worker(bundle.mainWorker);
	db = new duckdb.AsyncDuckDB(logger, worker);
	// launder the url to a string to ensure building.
	await db.instantiate(bundle.mainModule);
  const parquet = await fetch(path).then(d => d.arrayBuffer());
	console.log("foo")

  await db.registerFileBuffer(fname, new Uint8Array(parquet));
	return db;
};