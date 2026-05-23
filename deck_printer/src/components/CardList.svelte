<script>
  import { cardList, deckList, selectedCard, updateDeck } from "../lib/stores";
  import { showCardDetails } from "../lib/api";
  
</script>

<section class="card-list">
  {#each $cardList as card}
    <div
      class="card"
      on:click={() => updateDeck("add", card)}
      on:mouseover={() => selectedCard.set(card)}
    >
      <img
        src={`http://0.0.0.0:8000/card-image/${card.card_id}`}
        alt={card.title}
        loading="lazy"
        class="card-image"
      />

      <div class="card-info">
        <h3>{card.title}</h3>
        <p>{card.familyName}</p>
        <p>Level: {card.level}</p>
      </div>
    </div>
  {/each}
</section>

<style lang="scss">
  .card-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 50%;
  }

  .card {
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card-image {
    width: 100%;
    height: auto;
  }

  .card-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px;
    text-align: center;
    
    h3 {
      font-size: 12px;
    }
    
    p {
      font-size: 10px;
    }
  }
</style>