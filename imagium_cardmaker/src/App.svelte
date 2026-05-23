<script>
  import NormalCreature from "./lib/NormalCreature.svelte";
  import MagicCard from "./lib/MagicCard.svelte";
  import LandCard from "./lib/LandCard.svelte";
  import CurseCard from "./lib/CurseCard.svelte";
  import {
    title,
        enchantment,
        familyName,
        activeImage,
        effects,
        cardelement,
        selectingElement,
        elements,
        cardEnchantment,
        cardTypes,
        magicTypes,
        chooseIf,
        changeCardType,
        snapshot
  } from "./lib/datas";

  import datas from "./datas/datas.json";
  import html2canvas from "html2canvas";
  import { tick } from "svelte";

  let selectableCardTypes = [
    { name: "Normal Creature", component: NormalCreature, enchantment: "Normal", path: "./lib/NormalCreature.svelte" },
    { name: "Character Creature", component: NormalCreature, enchantment: "Character", path: "./lib/NormalCreature.svelte" },
    { name: "Magic Card", component: MagicCard, enchantment: "Magic", path: "./lib/MagicCard.svelte" },
    { name: "Land Card", component: LandCard, enchantment: "Land", path: "./lib/LandCard.svelte" },
    { name: "Curse Card", component: CurseCard, enchantment: "Curse", path: "./lib/CurseCard.svelte" }
  ];

  let selectedCardType = selectableCardTypes[0].component;
  let activeComponent;

  async function saveCard() {
    snapshot.set(true);
    await tick();
    const data = activeComponent.getDatas();

    const cardImg = document.getElementById("card-image");
    const printed_img = await html2canvas(cardImg);
    const img_blob = await new Promise((resolve) => printed_img.toBlob(resolve, "image/png"));

    const element = document.getElementById("card");
    const canvas = await html2canvas(element);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

    const formData = new FormData();
    formData.append("image", blob, "card.png");
    formData.append("printed_image", img_blob, "printed_card.png");
    formData.append("data", JSON.stringify(data));

    const response = await fetch("http://127.0.0.1:8000/saveCard", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    console.log(result);
    snapshot.set(false);
  }

</script>

<main>
  <div class="card_preview_on_the_left">
    <svelte:component this={selectedCardType} bind:this={activeComponent}/>
    <div>
      <label for="cardType">Select Card Type:</label>
      <select id="cardType" bind:value={selectedCardType}>
        {#each selectableCardTypes as cardType}
          <option
                  value={cardType.component}
                  on:click={() => {
            selectedCardType = cardType.component;
            $enchantment = cardType.enchantment;
            changeCardType(cardType.enchantment);
          }}
          >
            {cardType.name}
          </option>
        {/each}
      </select>
    </div>
  </div>
  <div class="options_on_the_right">
    <button class="bg-slider"
      on:click={ saveCard }
    >
      <div class="slider"></div>
      <p class="slide-text">Kártya mentése</p>
    </button>
  </div>
</main>

<style lang="scss">
  main{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
  }

  .card_preview_on_the_left{
    width: 100%;
    height: 100%;
    margin: 5px;
  }

  .options_on_the_right{
    width: 100%;
    height: 100%;
    margin-left: 5px;
  }

  .bg-slider {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    color: white;
    cursor: pointer;
    overflow: hidden;
    border: #008CBA33 2px solid;
    background: transparent; // így a slider látszik majd háttérként

    .slider {
      position: absolute;
      top: 0;
      left: 0;
      width: 0; // innen indul
      height: 100%;
      background-color: #008CBA;
      z-index: 0;
      transition: width 0.3s ease-in-out; // << ez hiányzott
    }

    &:hover {
      .slider {
        width: 100%; // ide csúszik ki
      }
    }

    .slide-text {
      position: relative; // z-index 1 miatt a slider fölött lesz
      z-index: 1;
    }
  }

</style>
