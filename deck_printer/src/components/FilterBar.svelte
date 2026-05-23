<script>
    import { cardList, deckList, selectedCard } from "../lib/stores";
    import { searchCards } from "../lib/api";
    import { selectableCardTypes, selectableElements, selectableCreatureTypes, magicTypes, curseTypes, landTypes } from "../lib/filters";
    import { onMount } from "svelte";
    import PrintView from "./PrintView.svelte";

    let filter = {
        title: '',
        familyName: '',
        element: '--',
        cardType: '--',
        creature: null,
        magic: null,
        curse: null,
        land: null
      };

      let filterCreatures = {
        level: "",
        creatureType: "--",
        type: "--",
      }

      let filterMagicCards = {
        simpleType: "--",
        continuousType: "--",
        otherType: "--"
      }

      let filterCurseCards = {
        simpleType: "--",
        continuousType: "--",
        otherType: "--"
      }

      let filterLandCards = {
        clearFilter: true,
        normal: false,
        merging: false,
        replacable: false,
        shared: false
      }
      onMount(() => {
        searchCards(filter);
      });

      async function printDeck() {
        // 1: DeckList lekérése

        const ids = $deckList.map(card => card.card_id)

        try{
          // 2: Lekérés
          const response = await fetch(`http://0.0.0.0:8000/printDeck/${ids.join(",")}`)

          if (!response.ok) throw new Error("Hiba a szerver-oldalon")

          // 3: Letöltés kezelése
          // Válasz átalakítása Blob-bá

          const blob = await response.blob()

          const url = window.URL.createObjectURL(blob)

          const a = document.createElement('a')
          a.href = url
          a.download = "deck.pdf"
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)

          a.remove()

        }
        catch(e){
          console.log("Hiba a lekéréskor: ", e)
          alert("Nem sikerült a nyomtatás. A konzolban található részletek segíthetnek a hiba megoldásában.")
        }
      }

      
</script>

<header class="FilterAndSave">
    <!-- Szűrők, frissítés -->
     <div class="basic-filters">
        <input type="text" bind:value={filter.title} placeholder="Title">
        <input type="text" bind:value={filter.familyName} placeholder="Family Name">
        <select bind:value={filter.element}>
            <option value="--">--</option>
            {#each selectableElements as element}
                <option value={element}>{element}</option>
            {/each}
        </select>
        <select bind:value={filter.cardType}>
            <option value="--">--</option>
            {#each selectableCardTypes as cardType}
                <option value={cardType}>{cardType}</option>
            {/each}
        </select>
     </div>

     { #if filter.creature }
        <div class="creature-filters">
            <input type="text" bind:value={filterCreatures.level} placeholder="Level">
            <select bind:value={filterCreatures.type}>
                <option value="--">--</option>
                {#each selectableCreatureTypes as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </div>
     { /if }

     { #if filter.magic }
        <div class="magic-filters">
            <select bind:value={filterMagicCards.simpleType}>
                <option value="--">--</option>
                {#each magicTypes.Simple as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
            <select bind:value={filterMagicCards.continuousType}>
                <option value="--">--</option>
                {#each magicTypes.Continuous as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
            <select bind:value={filterMagicCards.otherType}>
                <option value="--">--</option>
                {#each magicTypes.Other as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </div>
     { /if }

     { #if filter.curse }
        <div class="curse-filters">
            <select bind:value={filterCurseCards.simpleType}>
                <option value="--">--</option>
                {#each curseTypes.Simple as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
            <select bind:value={filterCurseCards.continuousType}>
                <option value="--">--</option>
                {#each curseTypes.Continuous as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
            <select bind:value={filterCurseCards.otherType}>
                <option value="--">--</option>
                {#each curseTypes.Other as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </div>
     { /if }

     { #if filter.land }
        <div class="land-filters">
            <select bind:value={filterLandCards.clearFilter}>
                <option value="true">Clear Filter</option>
                <option value="false">Clear Filter</option>
            </select>
            <select bind:value={filterLandCards.normal}>
                <option value="true">Normal</option>
                <option value="false">Normal</option>
            </select>
            <select bind:value={filterLandCards.merging}>
                <option value="true">Merging</option>
                <option value="false">Merging</option>
            </select>
            <select bind:value={filterLandCards.replacable}>
                <option value="true">Replacable</option>
                <option value="false">Replacable</option>
            </select>
            <select bind:value={filterLandCards.shared}>
                <option value="true">Shared</option>
                <option value="false">Shared</option>
            </select>
        </div>
     { /if }

     <button on:click={printDeck}>Print</button>
  </header>

<style lang="scss">
    .FilterAndSave {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
</style>