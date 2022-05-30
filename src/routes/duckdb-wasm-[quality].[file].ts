import { promises as fs } from 'fs';
//import mvp from "/node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?raw"

export async function get({ params: { quality, file } }) {
  let path : string;
  let ctype = 'application/javascript'
  let response = null;
  if (file === 'wasm') {
    ctype = 'application/wasm'
    path  = `./node_modules/@duckdb/duckdb-wasm/dist/duckdb-${quality}.wasm`
  } else if (file === 'worker') {
    path = `./node_modules/@duckdb/duckdb-wasm/dist/duckdb-browser-${quality}.worker.js`
  } else {
    throw new Error(`Unknown file ${file}`)
  }
  response = await fs.readFile(path);
  if (file === 'worker') {
    response = response.toString();
  }
  return {
    status: 200,
    headers: {
      'Content-Type': ctype
    },
    body: response
  }
}