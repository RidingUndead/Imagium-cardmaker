import { writable, derived } from "svelte/store";

export const cardList = writable([]);
export const deckList = writable([]);
export const selectedCard = writable(null);


// opcionális: pakli statisztika
export const deckStats = derived(deckList, ($deckList) => {
  const count = {};
  $deckList.forEach(c => {
    count[c.id] = (count[c.id] || 0) + 1;
  });
  return count;
});

export const updateDeck = (action, card) => {
  deckList.update(d => {
    switch (action) {
      case "add":
        // meglevő azonos card_id + serial számlálása
        const similars = d.filter(c => c.title === card.title);

        if (similars.length < 3) {
          let serial = 0;

          // keresünk szabad serial-t 0–2 között
          for (let i = 0; i < 3; i++) {
            if (!similars.find(c => c.serial === i)) {
              serial = i;
              break;
            }
          }

          // új példány létrehozása (nem módosítjuk az eredetit)
          const newItem = { ...card, serial };

          return [...d, newItem];
        }

        // ha már 3 van, nem adunk hozzá
        return d;

      case "remove":
        return d.filter(c =>c !== card)
        

      default:
        return d;
    }
  });
};