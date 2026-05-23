<!-- src/PrintView.svelte -->
<script>
  import { deckList } from "../lib/stores";

  const CARDS_PER_PAGE = 9;

  $: pages = [];
  for (let i = 0; i < $deckList.length; i += CARDS_PER_PAGE) {
    pages.push($deckList.slice(i, i + CARDS_PER_PAGE));
  }
</script>

{#each pages as page}
  <div class="page">
    {#each page as card}
      <div class="card">
        <img src={`http://0.0.0.0:8000/card-image/${card.card_id}`} alt={card.title} />
      </div>
    {/each}
  </div>
{/each}

<style>
@media print {
  .page {
    width: 210mm;
    height: 297mm;
    display: grid;
    grid-template-columns: repeat(3, 63mm);
    grid-auto-rows: 88mm;
    gap: 4mm;
    padding: 10mm;
    page-break-after: always;
  }

  .card {
    width: 63mm;
    height: 88mm;
    overflow: hidden;
  }

  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
