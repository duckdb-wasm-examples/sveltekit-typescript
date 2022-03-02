A simple svelte-kit app to show loading duckdb-wasm using svelte-kit.

Andre Kohn has a base svelte example, but it requires a lot of rollup configuration
and I want to see how far you can get using vite's built-in `?worker` and `?url` loaders
for the tags.

It doesn't properly negotiate the different bundles, but everything else seems to work.

Example using adapter static [on github pages](https://bmschmidt.github.io/sveltekit-typescript-duckdb/)