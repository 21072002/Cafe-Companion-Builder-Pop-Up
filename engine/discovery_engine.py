"""
Discovery & Personalization Engine for The Café Companion.
Matches flavor profiles, moods, weather conditions, and dietary goals
to curate harmonious food & beverage pairings.
"""

import json
from typing import Dict, Any, List

class DiscoveryEngine:
    def __init__(self, menu_path: str):
        with open(menu_path, "r", encoding="utf-8") as f:
            self.menu = json.load(f)
        self.items = {item["id"]: item for item in self.menu.get("items", [])}

    def get_mood_recommendation(self, mood: str, weather: str) -> Dict[str, Any]:
        mood = mood.lower()
        weather = weather.lower()

        # Default pairings
        pairings = []

        if "focus" in mood or "work" in mood:
            pairings = [
                {
                    "title": "The Deep Flow Ritual",
                    "drink": self.items.get("item_5"), # Ceremonial Uji Matcha
                    "food": self.items.get("item_8"),  # Avocado & Yuzu Tartine
                    "synergy": "L-Theanine in Kyoto matcha produces sustained alpha brainwaves, while healthy fats from Hass avocado sustain mental stamina without blood sugar spikes.",
                    "tag": "Sustained Cognitive Energy"
                },
                {
                    "title": "The Artisan Coder",
                    "drink": self.items.get("item_1"), # Amber Honey Flat White
                    "food": self.items.get("item_7"),  # Pistachio Rosewater Croissant
                    "synergy": "The rich double ristretto cuts through the decadent pistachio frangipane, creating a comforting focus haven.",
                    "tag": "Creative Focus"
                }
            ]
        elif "cozy" in mood or "chill" in mood or "rain" in weather:
            pairings = [
                {
                    "title": "Rainy Hearth Comfort",
                    "drink": self.items.get("item_3"), # Spanish Saffron Cortado
                    "food": self.items.get("item_9"),  # Truffled Mushroom Toastie
                    "synergy": "Warm saffron and cardamom aromatics meet savory melted Gruyère and white truffle essence for deep rainy day coziness.",
                    "tag": "Warm & Grounding"
                },
                {
                    "title": "Sweet Solitude",
                    "drink": self.items.get("item_4"), # Ethiopia Yirgacheffe V60
                    "food": self.items.get("item_7"),  # Pistachio Rosewater Croissant
                    "synergy": "Jasmine floral notes and peach acidity of the Ethiopian washed lot illuminate the delicate floral rosewater glaze.",
                    "tag": "Artisan Symphony"
                }
            ]
        elif "social" in mood or "meet" in mood:
            pairings = [
                {
                    "title": "The Communal Spark",
                    "drink": self.items.get("item_2"), # Cascara Cloud Cold Brew
                    "food": self.items.get("item_7"),  # Pistachio Croissant
                    "synergy": "Refreshing effervescent cascara fruit with whipped cold foam—fun, conversation-starting, and effortlessly shareable.",
                    "tag": "Lively & Vibrant"
                },
                {
                    "title": "Table Share Harmony",
                    "drink": self.items.get("item_6"), # Blueberry Hibiscus Sparkler
                    "food": self.items.get("item_8"),  # Avocado Yuzu Tartine
                    "synergy": "Vibrant ruby colors and sparkling citrus notes complement the bright yuzu and pickled shallots.",
                    "tag": "Crisp & Social"
                }
            ]
        else: # Afternoon slump / Refresh
            pairings = [
                {
                    "title": "Afternoon Renaissance",
                    "drink": self.items.get("item_2"), # Cascara Cold Brew
                    "food": self.items.get("item_8"),  # Avocado Tartine
                    "synergy": "High-caffeine cold brew invigorates sluggish afternoons while yuzu kosho stimulates the palate.",
                    "tag": "Revitalizing Lift"
                },
                {
                    "title": "Calm Unwind",
                    "drink": self.items.get("item_6"), # Blueberry Hibiscus
                    "food": self.items.get("item_7"),  # Pistachio Croissant
                    "synergy": "Tart berry botanicals with zero caffeine, allowing you to relax into the golden hour.",
                    "tag": "Zero-Jitters Reset"
                }
            ]

        return {
            "mood": mood,
            "weather": weather,
            "curatedPairings": pairings
        }

    def match_taste_profile(self, answers: Dict[str, str]) -> Dict[str, Any]:
        """
        Calculates customer taste persona:
        answers: { "roast": "light" | "medium" | "dark", "sweetness": "none" | "subtle" | "sweet", "milk": "plant" | "dairy" | "black" }
        """
        roast = answers.get("roast", "light")
        sweetness = answers.get("sweetness", "subtle")
        milk = answers.get("milk", "plant")

        if milk == "black" and roast == "light":
            persona = "The Single-Origin Purist"
            hero_item = self.items.get("item_4")
            description = "You cherish terroir, floral nuance, and delicate origin characteristics in clean filter brewing."
        elif milk == "plant":
            persona = "The Botanical Connoisseur"
            hero_item = self.items.get("item_1") if sweetness != "none" else self.items.get("item_5")
            description = "You love silky oat or pistachio microfoam paired with harmonious botanical accents and velvety body."
        elif sweetness == "none":
            persona = "The High-Velocity Artisan"
            hero_item = self.items.get("item_3")
            description = "Bold, concentrated, unadulterated espresso strength with precise extraction."
        else:
            persona = "The Velvet Explorer"
            hero_item = self.items.get("item_2")
            description = "You love exciting culinary textures, cold foam layering, and memorable dessert-like nuances."

        return {
            "persona": persona,
            "description": description,
            "recommendedItem": hero_item
        }
