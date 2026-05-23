import { cardList, deckList, selectedCard } from "./stores";


export async function searchCards(filters) {
  const appliedFilters = Object.entries(filters)
    .filter(([_, v]) => v && v !== "--")
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

  const res = await fetch("http://127.0.0.1:8000/getCards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(appliedFilters)
  });

  const result = await res.json();
  cardList.set(result.cards);
}



export const showCardDetails = (card) => {
  selectedCard.set(card);
};


