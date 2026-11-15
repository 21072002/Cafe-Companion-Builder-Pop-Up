"""
Wait Predictor Engine for The Café Companion.
Calculates dynamic wait times based on live queue depth, recipe preparation complexity,
active staff capacity, and historical time-of-day traffic models.
"""

import json
from typing import Dict, Any, List

class WaitPredictor:
    def __init__(self, forecast_path: str, menu_path: str):
        with open(forecast_path, "r", encoding="utf-8") as f:
            self.forecast_data = json.load(f)
        with open(menu_path, "r", encoding="utf-8") as f:
            self.menu = json.load(f)

        self.item_prep_times = {item["name"]: item.get("prepTimeSec", 120) for item in self.menu.get("items", [])}
        # Fallback id mapping
        for item in self.menu.get("items", []):
            self.item_prep_times[item["id"]] = item.get("prepTimeSec", 120)

    def calculate_wait_time(self, items: List[Dict[str, Any]], active_orders_count: int, active_baristas: int = 3) -> Dict[str, Any]:
        """
        Estimates wait time in minutes:
        Wait = (Base Queue Overhead) + (Sum of Recipe Complexities / Parallel Baristas)
        """
        if active_baristas <= 0:
            active_baristas = 1

        # Complexity in seconds of the customer's items
        basket_prep_seconds = 0
        for item in items:
            name = item.get("name", "")
            item_id = item.get("id", "")
            sec = self.item_prep_times.get(name, self.item_prep_times.get(item_id, 120))
            basket_prep_seconds += sec

        # Active queue backlog (assuming average 110s per item in queue)
        queue_backlog_seconds = active_orders_count * 110

        total_work_seconds = queue_backlog_seconds + basket_prep_seconds
        # Effective parallel throughput
        estimated_seconds = total_work_seconds / active_baristas

        # Ensure realistic minimums
        min_seconds = 90 if items else 60
        effective_seconds = max(min_seconds, estimated_seconds)

        estimated_minutes = round(effective_seconds / 60.0, 1)

        # Readiness classification
        if estimated_minutes <= 3.0:
            speed_tier = "Express Track (Fast)"
            speed_color = "emerald"
        elif estimated_minutes <= 6.0:
            speed_tier = "Moderate Flow"
            speed_color = "amber"
        else:
            speed_tier = "Peak Rush"
            speed_color = "rose"

        return {
            "estimatedWaitMinutes": estimated_minutes,
            "estimatedSeconds": int(effective_seconds),
            "speedTier": speed_tier,
            "speedColor": speed_color,
            "activeBaristas": active_baristas,
            "ordersAhead": active_orders_count,
            "complexitySeconds": basket_prep_seconds
        }

    def get_forecast(self) -> Dict[str, Any]:
        return self.forecast_data
