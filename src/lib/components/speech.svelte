<script>
  export let paragraphs = [];
  export let id = null;
  export let selected_word = "";
  export let haplaxes = [];
  function select_paragraph(para_id) {
    id = para_id;
  }
</script>

{#each paragraphs as [para_id, paragraph]}
  <p class:bg-blue-100={id==para_id} class="rounded mt-3 text-sm">
    <button class="rounded" on:click={() => select_paragraph(para_id)}>
      <span class="text-xs">{para_id}</span>
    </button>
    { paragraph }
  </p>
{/each}

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