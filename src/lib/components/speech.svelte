<script>
  export let results;
</script>
{#await results}
{:then values}
  <h1>{values.get(0)['year']}</h1>
  <h3>{values.get(0)['president']}, {values.get(0).party}</h3>
  {#each [...values] as value}
    <p id="para-{value.paragraph}">({value['paragraph']}) {value['nc:text']}</p>
  {/each}
{/await}
<!--These are approximations of tailwind styles.-->
<style>
  .bg-blue-100 {
    background-color: #e6f7ff;
  }
  .text-xs {
    font-size: 0.75rem;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  .text-sm {
    font-size: 0.875rem;
  }
  .mt-3 {
    margin-top: 1rem;
  }
</style>