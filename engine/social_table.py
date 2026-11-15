"""
Social Table & Community Engine for The Café Companion.
Facilitates opt-in community connection, shared interest discovery,
and context-aware icebreakers for café patrons.
"""

import json
from typing import Dict, Any, List

class SocialTableEngine:
    def __init__(self, demo_data_path: str):
        with open(demo_data_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)
        self.patrons = self.data.get("socialPatrons", [])
        self.corkboard = self.data.get("corkboard", [])

    def get_patrons(self) -> List[Dict[str, Any]]:
        return self.patrons

    def get_corkboard(self) -> List[Dict[str, Any]]:
        return self.corkboard

    def add_patron(self, patron_data: Dict[str, Any]) -> Dict[str, Any]:
        patron_id = f"patron_{len(self.patrons) + 1}"
        new_patron = {
            "id": patron_id,
            "name": patron_data.get("name", "Fellow Guest"),
            "avatar": patron_data.get("avatar", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"),
            "table": patron_data.get("table", "Table Beacon Active"),
            "presence": patron_data.get("presence", "Open to Chat"),
            "presenceColor": "emerald" if patron_data.get("presence") == "Open to Chat" else "amber",
            "currentFocus": patron_data.get("currentFocus", "Enjoying specialty coffee & reading"),
            "interests": patron_data.get("interests", ["Specialty Coffee", "Reading", "Technology"]),
            "coffeeDrink": patron_data.get("coffeeDrink", "Amber Honey Oat Flat White"),
            "icebreakerPrompt": f"Say hi to {patron_data.get('name', 'your neighbor')}! Ask about: " + ", ".join(patron_data.get("interests", ["their project"]))
        }
        self.patrons.insert(0, new_patron)
        return new_patron

    def post_corkboard(self, notice: Dict[str, Any]) -> Dict[str, Any]:
        item = {
            "id": f"cork_{len(self.corkboard) + 1}",
            "title": notice.get("title", "Community Note"),
            "author": notice.get("author", "Café Guest"),
            "date": "Just now",
            "tag": notice.get("tag", "General"),
            "desc": notice.get("desc", "")
        }
        self.corkboard.insert(0, item)
        return item

    def calculate_matches(self, user_interests: List[str]) -> List[Dict[str, Any]]:
        user_set = set(i.lower().strip() for i in user_interests)
        results = []
        for p in self.patrons:
            p_interests = set(i.lower().strip() for i in p.get("interests", []))
            common = list(user_set.intersection(p_interests))
            match_score = int((len(common) / max(1, len(user_set))) * 100) if user_set else 50
            results.append({
                "patron": p,
                "commonInterests": common,
                "compatibility": min(98, max(45, match_score + 35))
            })
        results.sort(key=lambda x: x["compatibility"], reverse=True)
        return results
