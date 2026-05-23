<script lang="js">
  import { get } from 'svelte/store';
    import {
        title,
        level,
        creatureType,
        enchantment,
        familyName,
        activeImage,
        atk,
        dmg,
        def,
        effects,
        cardelement,
        selectingElement,
        elements,
        cardEnchantment,
        cardTypes,
        creatureTypes,
        chooseIf,
        snapshot
    } from './datas.js'


    function numberFocusLost(e) {
        let min = parseInt(e.target.min)
        let max = e.target.hasAttribute('max') ? parseInt(e.target.max) : Infinity
        let value = parseInt(e.target.value)

        if(value < min) {
            e.target.value = min
        }
        else if(value > max) {
            e.target.value = max
        }

        
    }

	function selectImage() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = (e) => {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					$activeImage = reader.result;
				};
				reader.readAsDataURL(file);
			}
		};
		input.click();
	}

    window.onclick = (e) => {
        if(!selectingElement) {
            return
        }
        else if(!e.target.classList.contains("element-icon")) {
            $selectingElement = false
        }
    }

    export function getDatas() {
        return {
            title: $title,
            level: $level,
            creatureType: $creatureType,
            familyName: $familyName,
            element: $cardelement,
            enchantment: $enchantment,
            effects: $effects,
            atk: $atk,
            dmg: $dmg,
            def: $def
        }
    }
</script>

<div class="card NormalCreature" id="card">
	<!-- Fejléc -->
	<div class="card-header">
		<input class="title" bind:value={$title} placeholder="Cím" />
		<input class="level" type="number" bind:value={$level} min="1" max="10" on:blur={numberFocusLost} />
	</div>

    <!-- Lénytípus -->

    <div class="card-type">
        { #if $snapshot }
            <span>{$creatureType}</span>
        {:else}
            <select bind:value={$creatureType}>
                {#each creatureTypes as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        {/if}
        
        / {$enchantment}
    </div>

	<!-- Kép -->
    <button
        type="button"
        class="card-image"
        aria-label="Kép kiválasztása"
        id="card-image"
        on:click={selectImage}
    >
        {#if $activeImage}
            <img src={$activeImage} alt="Creature" />
        {:else}
            <span>Kattints ide képkiválasztáshoz</span>
        {/if}
    </button>

	<!-- Családnév -->
	<div class="card-family">
		<input class="family-name" bind:value={$familyName} placeholder="Családnév" />
        <div class="element">
            <img class="element-icon" src="{$cardelement}" alt="{$cardelement}" on:click={() => $selectingElement = !$selectingElement}/>
            {#if $selectingElement}

            <div class="element-select">
                {#each elements as el}
                    <img
                        class="element-icon"
                        src={el}
                        alt={el}
                        title={el}
                        on:click={() => {
                            $cardelement = el;
                            $selectingElement = false;
                        }} />
                {/each}
            </div>
            {/if}
        </div>
	</div>

	<!-- Szöveg -->
	<div class="card-effects">
        <!-- make background image based on $cardEnchantment -->
         <img class="card-enchantment background" src="{$cardEnchantment}" alt="{$cardEnchantment}" />
		{ #if $snapshot }
            <span class="effect-text">{$effects}</span>
            {:else}
            <textarea bind:value={$effects}/>
        {/if}
	</div>

	<!-- Statok -->
	<div class="card-stats">
		<div>ATK: 
            { #if $snapshot }
            <span>{$atk}</span>
            {:else}
            <input type="number" bind:value={$atk} min="0" on:blur={numberFocusLost} />
            {/if}
        </div>
		<div>DMG: 
            { #if $snapshot }
            <span>{$dmg}</span>
            {:else}
            <input type="number" bind:value={$dmg} min="-1" on:blur={numberFocusLost} />
            {/if}
        </div>
		<div>DEF: 
            { #if $snapshot }
            <span>{$def}</span>
            {:else}
            <input type="number" bind:value={$def} min="0" on:blur={numberFocusLost} />
            {/if}
        </div>
	</div>
</div>

<style lang="scss">
.card {
    background-color: #ddd;
    color: #333;
	width: 450px;
    height: 700px;
	border: 2px solid #a95;
	border-radius: 12px;
	box-shadow: 0 0 10px #0003;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	font-family: 'Georgia', serif;
	position: relative;

	input,
	textarea {
		background: transparent;
		border: none;
        color: #444;
		width: 100%;
		resize: none;
		outline: none;
		font-family: inherit;
	}

	input[type="number"] {
		width: 70px;
        appearance: textfield;
	}

    select {
        background: transparent;
        border: none;
        color: #444;
        width: auto;
        resize: none;
        outline: none;
        font-family: inherit;
        appearance: none;
        
    }

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.title {
			font-size: 1.4rem;
			font-weight: bold;
		}
		.level {
			font-size: 1.4rem;
			width: 50px;
			text-align: right;
		}
	}

	.card-image {
		background: #ddd;
		border: 1px solid #999;
		height: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
        padding: 0;
		cursor: pointer;
		overflow: hidden;
		img {
			height: 100%;
            width: 100%;
		}
		span {
			color: #555;
			font-size: 0.9rem;
		}
	}

	.card-family {
		text-align: center;
        display: flex;
		.family-name {
			font-size: 1rem;
			font-style: italic;
		}

        .element{
            margin-left: auto;
            width: 40px;
        }
	}

	.card-effects {
        position: relative;
        height: 340px;
        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }
        textarea {
            position: relative;
            z-index: 3;
            font-size: 0.9rem;
            line-height: 1.2;
            border: 1px solid #ccc4;
            height: 250px;
            width: 425px;
            border-radius: 6px;
            padding: 0.5rem;
            background: transparent;
        }
        .effect-text {
            position: relative;
            z-index: 3;
            font-size: 0.9rem;
            line-height: 1.2;
            border: 1px solid #ccc4;
            height: 250px;
            width: 425px;
            border-radius: 6px;
            padding: 0.5rem;
            background: transparent;
            word-wrap: break-word;
        }
	}

	.card-stats {
		display: flex;
        margin-top: auto;
		justify-content: space-around;
		font-size: 1rem;
		font-weight: bold;
		> div {
			display: flex;
			gap: 0.25rem;
			align-items: center;

            input {
                font-weight: bold;
                font-size: 1rem;
                height: auto;
            }
            span {
                min-width: 2ch;
                text-align: right;
            }
		}
	}
    .element-select {
        position: absolute;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #aaa;
        border-radius: 8px;
        padding: 0.5rem;
        display: flex;
        gap: 0.5rem;
        z-index: 100;
        right: 10px;

        img {
            width: 32px;
            height: 32px;
            cursor: pointer;
            border-radius: 4px;
            transition: transform 0.2s;
            &:hover {
                transform: scale(1.2);
                box-shadow: 0 0 5px #333;
            }
        }
    }
    .element-icon {
        width: 32px;
        height: 32px;
        cursor: pointer;
        border-radius: 4px;
        transition: transform 0.2s;
    }
}
</style>
