A simple svelte-kit app to show loading duckdb-wasm using svelte-kit.

Andre Kohn has a base svelte example, but it requires a lot of rollup configuration
and I want to see how far you can get using vite's built-in `?worker` and `?url` loaders
for the tags.

Example using adapter static [on github pages](https://duckdb-wasm-examples.github.io/sveltekit-typescript/).

To run locally:

```sh
git clone https://github.com/duckdb-wasm-examples/sveltekit-typescript sveltekit-typescript
cd sveltekit-typescript
npm i
npm run dev
```

and visit `http://localhost:1922`.
