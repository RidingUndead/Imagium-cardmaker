# Making a FastAPI backend with Svelte frontend integration
from fastapi import FastAPI, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json
import uuid
from pathlib import Path

# Import the necessary tools to print the deck cards with the printer
import os
from fpdf import FPDF
import io

app = FastAPI()

class CardFilter(BaseModel):
    title: str | None = None
    familyName: str | None = None
    element: str | None = None
    cardType: str | None = None
    level: int | None = None
    creatureType: str | None = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
IMAGE_DIR = BASE_DIR / "datas" / "imgs"
CARD_DIR = BASE_DIR / "datas" / "cards"
DATA_FILE = BASE_DIR / "datas" / "data.json"

IMAGE_DIR.mkdir(parents=True, exist_ok=True)
DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

def card_matches(card: dict, filters: dict) -> bool:
    for key, filter_value in filters.items():

        # nincs szűrés
        if filter_value in (None, "", "--"):
            continue

        # cardType-et nem itt vizsgáljuk
        if key == "cardType":
            continue

        # ha a kártyán nincs ilyen mező
        if key not in card:
            return False

        card_value = card[key]

        # STRING → részszöveg keresés
        if isinstance(filter_value, str):
            if filter_value.lower() not in str(card_value).lower():
                return False

        # NUMBER → pontos egyezés (később lehet range)
        else:
            if card_value != filter_value:
                return False

    return True

def UnDuplicateCheck(datas):
    with DATA_FILE.open("r") as f:
        existing_data = json.load(f)
    for enchantment, cards in existing_data.items():
        for card in cards:
            if datas["title"] == card["title"]:
                return Exception("Duplicate card name found.")
    return None

@app.post("/saveCard")
async def save_card(image: UploadFile = File(...), printed_image: UploadFile = File(...), data: str = Form(...)):
    try:
        if UnDuplicateCheck(json.loads(data)):
            raise Exception("Duplicate card name found.")
        
        # Generate unique card ID
        card_id = str(uuid.uuid4())
    
        # Save image
        image_path = CARD_DIR / f"card_{card_id[0:8]}.png"
        with image_path.open("wb") as img_file:
            img_file.write(await image.read())
            img_file.close()

        # Save printed image
        printed_image_path = IMAGE_DIR / f"id_{card_id[0:8]}.png"
        with open(printed_image_path, "wb") as pif:
            pif.write(await printed_image.read())
            pif.close()

        # Save data
        card_data = json.loads(data)
        card_data['image_path'] = str(image_path)
        card_data['card_id'] = card_id[0:8]
        with DATA_FILE.open("r") as f:
            all_data = json.load(f) if f.readable() else []
        all_data[f"{card_data['enchantment']}"].append(card_data)
        with DATA_FILE.open("w") as f:
            json.dump(all_data, f, indent=4)
            f.close()
        
            
    except Exception as e:
        print(f"Error saving card: {e}")
        return {"status": "error", "message": str(e)}

    return {"status": "success", "card_id": card_id}

@app.post("/getCards")
async def get_cards(filters: dict):
    with DATA_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)

    result = []

    card_type = filters.get("cardType")

    # 1. Mely kártyacsoportokat nézzük
    if card_type and card_type != "--":
        card_groups = {card_type: data.get(card_type, [])}
    else:
        card_groups = data

    # 2. Szűrés
    for enchantment, cards in card_groups.items():
        for card in cards:
            if card_matches(card, filters):
                result.append(card)

    return {
        "success": True,
        "count": len(result),
        "cards": result
    }

@app.get("/card-image/{card_id}")
async def get_card_image(card_id: str):
    image_path = CARD_DIR / f"card_{card_id[:8]}.png"

    if not image_path.exists():
        return {"error": "Image not found"}

    return FileResponse(image_path, media_type="image/png")

@app.get("/printDeck/{deck}")
async def print_deck(deck: str):
    card_width = 59 # mm
    card_height = 86 # mm

    new_deck = deck.split(",")

    images = []
    for card in new_deck:
        card_image = os.path.join(CARD_DIR, f"card_{card}.png")
        images.append(card_image)
    
    pdf = FPDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()
    
    # Rács beállítások
    margin_top = 10
    margin_left = 15
    cols = 3
    rows_per_page = 3
    cards_per_page = cols * rows_per_page
    
    # Képek elhelyezése
    for i, image in enumerate(images):
        # Új oldal kezdése, ha betelik a jelenlegi
        if i > 0 and i % cards_per_page == 0:
            pdf.add_page()

            # Pozíciók kiszámítása
        idx_on_page = i % cards_per_page
        row = idx_on_page // cols
        col = idx_on_page % cols
        
        x = margin_left + col * card_width
        y = margin_top + row * card_height

        # Kép elhelyezése
        pdf.image(str(image), x=x, y=y, w=card_width, h=card_height)

        # Vágójelek rajzolása
        pdf.set_line_width(0.3)
        pdf.rect(x, y, card_width, card_height)

    # PDF küldése memóriából
    # Byte buffer fájl helyett
    pdf_buffer = io.BytesIO()
    pdf.output(pdf_buffer)
    pdf_bytes = pdf_buffer.getvalue()

    headers = {
        'Content-Disposition': 'attachment; filename="deck.pdf"'
    }

    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
