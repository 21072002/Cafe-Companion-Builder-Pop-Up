"""
AI Barista Engine for The Café Companion.
Interprets customer natural language prompts, dietary constraints, flavor preferences,
and generates knowledgeable, warm artisan barista responses with structured recommendations.
"""

import json
import re
from typing import Dict, Any, List

class AIBarista:
    def __init__(self, menu_path: str):
        with open(menu_path, "r", encoding="utf-8") as f:
            self.menu = json.load(f)
        self.items = self.menu.get("items", [])

    def process_message(self, message: str, conversation_history: List[Dict[str, str]] = None, current_cart: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        msg = message.lower().strip()
        cart = current_cart or []
        
        # 1. Check for specific item queries or direct order triggers
        matched_items = []
        for item in self.items:
            name_words = [w.lower() for w in item["name"].split() if len(w) > 3]
            if item["name"].lower() in msg or any(w in msg for w in name_words if len(w) > 4):
                matched_items.append(item)

        # 2. Analyze sentiment & preference indicators
        is_iced = "ice" in msg or "cold" in msg or "chilled" in msg or "refreshing" in msg
        is_hot = "hot" in msg or "warm" in msg or "steamed" in msg
        is_sweet = "sweet" in msg or "syrup" in msg or "honey" in msg or "caramel" in msg
        is_unsweetened = "unsweet" in msg or "no sugar" in msg or "not sweet" in msg or "low sugar" in msg or "keto" in msg
        is_oat = "oat" in msg
        is_almond = "almond" in msg
        is_vegan = "vegan" in msg or "plant-based" in msg or "dairy-free" in msg
        is_decaf = "decaf" in msg or "no caffeine" in msg or "caffeine-free" in msg
        is_pastry = "pastry" in msg or "croissant" in msg or "sweet bite" in msg or "bakery" in msg or "snack" in msg
        is_food = "food" in msg or "hungry" in msg or "lunch" in msg or "brunch" in msg or "toast" in msg or "eat" in msg
        is_focus = "focus" in msg or "study" in msg or "work" in msg or "deep work" in msg or "coding" in msg or "exam" in msg

        # 3. Handle Greeting
        if any(msg.startswith(g) for g in ["hi", "hello", "hey", "good morning", "good afternoon"]) and len(msg.split()) <= 4:
            return {
                "message": "Welcome to The Café Companion! ☕ I'm your digital barista. Whether you're here to power through deep work, catch up with someone at the Social Table, or discover a rare single-origin roast, I'm here to help. What are you in the mood for today?",
                "suggestedItems": [self.items[0], self.items[1], self.items[4]],
                "quickReplies": [
                    "Something iced & refreshing 🧊",
                    "Best coffee for deep work 💻",
                    "Vegan & gluten-free options 🌿",
                    "Surprise me with a signature pairing ✨"
                ]
            }

        # 4. Handle Wait Time / Crowd query
        if any(w in msg for w in ["wait", "busy", "crowd", "line", "ready", "time"]):
            return {
                "message": "Right now our espresso bar is flowing smoothly with an average wait time of **3 to 4.5 minutes**! If you order slow bar pour-overs or toasted sandwiches, add about 2 minutes. We currently have 18 comfortable seats open.",
                "suggestedItems": [],
                "quickReplies": [
                    "View Best Times to Visit ⏱️",
                    "Order Amber Honey Flat White ☕",
                    "Check Table Beacon 🪑"
                ]
            }

        # 5. Handle "Focus / Deep Work" query
        if is_focus or "caffeine" in msg:
            rec1 = next((i for i in self.items if i["id"] == "item_5"), self.items[0]) # Ceremonial Matcha (L-Theanine)
            rec2 = next((i for i in self.items if i["id"] == "item_1"), self.items[0]) # Amber Honey Flat White
            return {
                "message": "For deep focus sessions, I recommend our **Ceremonial Uji Matcha Latte**—its naturally rich L-Theanine provides sustained calm clarity without caffeine jitters! Or if you want a velvety espresso lift, our **Amber Honey Oat Flat White** is the house favorite.",
                "suggestedItems": [rec1, rec2],
                "quickReplies": [
                    "Add Matcha Latte to order 🍵",
                    "Make it iced with Oat Milk 🧊",
                    "Add Amber Flat White ☕",
                    "Pair with a light bite 🥐"
                ]
            }

        # 6. Handle "Iced / Cold" recommendation
        if is_iced and not matched_items:
            rec_cold1 = next((i for i in self.items if i["id"] == "item_2"), self.items[0])
            rec_cold2 = next((i for i in self.items if i["id"] == "item_6"), self.items[0])
            return {
                "message": "For chilled perfection, you'll love the **Cascara Cloud Cold Brew** (topped with cascara cherry cold foam) or our naturally caffeine-free **Blueberry Hibiscus Sparkler** crafted with crushed Maine blueberries.",
                "suggestedItems": [rec_cold1, rec_cold2],
                "quickReplies": [
                    "Add Cascara Cold Brew to Cart ☕",
                    "Add Blueberry Hibiscus Sparkler 🫐",
                    "Can you make it with oat milk?"
                ]
            }

        # 7. Handle Vegan / Plant-Based queries
        if is_vegan:
            vegan_items = [i for i in self.items if any("Vegan" in d or "Plant-based" in d for d in i.get("dietary", []) + i.get("tags", []))]
            return {
                "message": "We take plant-based artisan craft seriously! All our espresso drinks can be steamed with barista-grade oat, almond, or pistachio milk. Here are our top plant-based culinary highlights:",
                "suggestedItems": vegan_items[:3],
                "quickReplies": [
                    "Order Avocado Tartine 🥑",
                    "Order Matcha with Oat Milk 🍵",
                    "Show gluten-free pastries"
                ]
            }

        # 8. Handle Pastry / Pairing / Food queries
        if is_pastry or is_food or "pair" in msg or "snack" in msg:
            rec_croissant = next((i for i in self.items if i["id"] == "item_7"), self.items[6])
            rec_toast = next((i for i in self.items if i["id"] == "item_8"), self.items[7])
            rec_gruyere = next((i for i in self.items if i["id"] == "item_9"), self.items[8])
            return {
                "message": "Our bakery oven just pulled out fresh batches! The **Pistachio Rosewater Croissant** is magnificent with single-origin pour-overs, and the **Truffled Mushroom Gruyère Toastie** is the ultimate hearty comfort for lunch.",
                "suggestedItems": [rec_croissant, rec_gruyere, rec_toast],
                "quickReplies": [
                    "Warm up the Pistachio Croissant 🥐",
                    "Order Truffled Mushroom Toastie 🥪",
                    "Add an iced coffee to match ☕"
                ]
            }

        # 9. If a specific item was found in the user's message
        if matched_items:
            target = matched_items[0]
            mods = []
            if is_iced: mods.append("Iced")
            elif is_hot: mods.append("Hot")
            if is_oat: mods.append("Oat Milk")
            elif is_almond: mods.append("Almond Milk")
            if is_unsweetened: mods.append("Unsweetened")
            elif is_sweet: mods.append("Standard Sweetness")
            if is_decaf: mods.append("Decaf")

            mod_text = f" ({', '.join(mods)})" if mods else ""
            return {
                "message": f"Splendid choice! The **{target['name']}** is one of our masterworks: *{target['description']}*. Shall I queue this up for your order{mod_text}?",
                "suggestedItems": [target],
                "cartAdditionCandidate": {
                    "id": target["id"],
                    "name": target["name"],
                    "price": target["price"],
                    "mods": ", ".join(mods) if mods else "Standard Barista Recipe"
                },
                "quickReplies": [
                    f"Yes, add to order (${target['price']:.2f}) 🛒",
                    "Customize details first ⚙️",
                    "Suggest a pastry pairing 🥐"
                ]
            }

        # 10. General fallback: intelligent, polite guidance
        return {
            "message": "I hear you! I can tailor your drink to your exact roast preference, dairy choice, or dietary needs. What flavors or energy level are you craving right now?",
            "suggestedItems": [self.items[0], self.items[3], self.items[7]],
            "quickReplies": [
                "Single-Origin Slow Bar (Ethiopia V60) 🫖",
                "Velvety Flat White with Oat Milk ☕",
                "Savory Avocado Yuzu Tartine 🥑",
                "Explore The Social Table 👥"
            ]
        }
