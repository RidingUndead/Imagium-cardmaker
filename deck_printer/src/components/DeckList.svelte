<script>
  import { deckList, selectedCard, deckStats, updateDeck } from "../lib/stores"
  import { showCardDetails } from "../lib/api"

</script>

<section class="DeckList">
    <!-- Pakli -->
     {#each $deckList as card}
       <div class="CardItem"
       >
         <img
        src={`http://0.0.0.0:8000/card-image/${card.card_id}`}
        alt={card.title}
        loading="lazy"
        class="card-image"
        on:click={() => updateDeck("remove", card)}
        on:mouseover={() => showCardDetails(card)}
      />
       </div>
     {/each}
  </section>

  <style lang="scss">
    .DeckList {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .CardItem {
      width: 20%;
      height: auto;
      cursor: pointer;

      img {
        width: 100%;
        height: auto;
      }

    }


  </style>