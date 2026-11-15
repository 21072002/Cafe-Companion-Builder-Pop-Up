"""
Room Pulse & Operations Engine for The Café Companion.
Tracks room acoustics, live customer sentiment, environmental comfort,
and produces actionable AI operational alerts for the café team.
"""

import json
import random
from typing import Dict, Any, List

class RoomPulseEngine:
    def __init__(self, demo_data_path: str):
        self.demo_data_path = demo_data_path
        with open(demo_data_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)

        self.orders = self.data.get("orders", [])
        self.pulse = self.data.get("roomPulse", {})

    def get_pulse_metrics(self) -> Dict[str, Any]:
        # Small dynamic variation for live feel
        db_fluctuation = random.choice([-1, 0, 1])
        current_db = max(48, min(68, self.pulse.get("acousticsDb", 56) + db_fluctuation))
        
        return {
            "liveSentimentScore": self.pulse.get("liveSentimentScore", 93),
            "sentimentTrend": self.pulse.get("sentimentTrend", "+4% vs yesterday"),
            "acousticsDb": current_db,
            "acousticsStatus": "Optimal Ambient (Focus & Conversation)" if current_db < 60 else "Vibrant Rush",
            "temperatureF": self.pulse.get("temperatureF", 70.5),
            "currentPlaylist": self.pulse.get("currentPlaylist", "Café Lo-Fi & Mellow Brazilian Bossa Nova"),
            "currentBpm": self.pulse.get("currentBpm", 74),
            "activeOrdersCount": len([o for o in self.orders if o.get("status") in ["In Queue", "Brewing", "Ready"]]),
            "staffAlerts": self.pulse.get("staffAlerts", []),
            "recentFeedback": self.pulse.get("recentFeedback", [])
        }

    def submit_feedback(self, text: str, rating: int, customer: str = "Guest") -> Dict[str, Any]:
        text_lower = text.lower()
        if rating <= 2 or any(w in text_lower for w in ["cold", "chilly", "draft", "loud", "slow", "wrong", "wait", "noisy", "freeze", "bad", "terrible", "spill"]):
            sentiment = "Needs Attention"
            level = "warning"
        elif rating >= 4 or any(w in text_lower for w in ["love", "great", "delicious", "perfect", "best", "amazing", "good", "wonderful", "warm"]):
            sentiment = "Positive"
            level = "success"
        else:
            sentiment = "Neutral"
            level = "info"

        feedback_entry = {
            "customer": customer,
            "rating": rating,
            "sentiment": sentiment,
            "text": text,
            "time": "Just now"
        }
        self.pulse["recentFeedback"].insert(0, feedback_entry)

        # Trigger staff alert if negative/actionable
        if sentiment == "Needs Attention":
            alert = {
                "id": f"alert_{len(self.pulse['staffAlerts']) + 1}",
                "level": "warning",
                "title": f"Guest Feedback Attention Needed ({customer})",
                "message": f"\"{text}\" - Check area comfort or order status.",
                "action": "Acknowledge"
            }
            self.pulse["staffAlerts"].insert(0, alert)
        elif rating == 5:
            # Maybe update sentiment score slightly
            self.pulse["liveSentimentScore"] = min(99, self.pulse.get("liveSentimentScore", 93) + 1)

        return feedback_entry

    def get_orders(self) -> List[Dict[str, Any]]:
        return self.orders

    def add_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        order_id = f"ORD-{100 + len(self.orders) + 1}"
        new_order = {
            "id": order_id,
            "customerName": order_data.get("customerName", "Guest Patron"),
            "customerAvatar": order_data.get("customerAvatar", "☕"),
            "tableNumber": order_data.get("tableNumber", "Pickup Counter"),
            "orderType": order_data.get("orderType", "Dine-In"),
            "status": "In Queue",
            "statusStep": 1,
            "placedAt": "Just now",
            "estimatedWaitMin": order_data.get("estimatedWaitMin", 4.0),
            "items": order_data.get("items", []),
            "total": order_data.get("total", 0.0)
        }
        self.orders.insert(0, new_order)
        return new_order

    def update_order_status(self, order_id: str, new_status: str) -> Dict[str, Any]:
        status_map = {
            "In Queue": 1,
            "Brewing": 2,
            "Ready": 3,
            "Completed": 4
        }
        for o in self.orders:
            if o["id"] == order_id:
                o["status"] = new_status
                o["statusStep"] = status_map.get(new_status, 1)
                return o
        return None
