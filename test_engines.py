"""
Comprehensive Unit Test Suite for The Café Companion Engines.
Verifies all 5 pillars:
1. Smarter Ordering & AI Barista
2. Better Waits & Forecasting
3. Personalized Discovery & Pairings
4. Connect People / The Social Table
5. Understand the Room / Room Pulse & Operations
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from engine.ai_barista import AIBarista
from engine.wait_predictor import WaitPredictor
from engine.discovery_engine import DiscoveryEngine
from engine.social_table import SocialTableEngine
from engine.room_pulse import RoomPulseEngine

MENU_PATH = os.path.join(BASE_DIR, "data", "menu.json")
FORECAST_PATH = os.path.join(BASE_DIR, "data", "forecast.json")
DEMO_PATH = os.path.join(BASE_DIR, "data", "demo_data.json")

def run_tests():
    print("=" * 60)
    print("🧪 RUNNING THE CAFÉ COMPANION ENGINE TEST SUITE")
    print("=" * 60)

    # 1. AI Barista Engine
    print("\n--- [Pillar 1: Smarter Ordering & AI Barista] ---")
    barista = AIBarista(MENU_PATH)
    
    # Test Greeting
    res_greet = barista.process_message("Hello there!")
    assert "Welcome" in res_greet["message"]
    print("✓ Greeting parsed correctly:", res_greet["message"][:60], "...")

    # Test Focus & Deep Work intent
    res_focus = barista.process_message("I need something for deep work and coding focus")
    assert any("Matcha" in i["name"] or "Amber" in i["name"] for i in res_focus["suggestedItems"])
    print("✓ Focus intent recognized with tailored high-clarity items!")

    # Test Iced & Plant-based custom order
    res_order = barista.process_message("I want an iced oat flat white unsweetened")
    assert "Amber Honey Oat Flat White" in res_order["message"]
    assert "cartAdditionCandidate" in res_order
    print("✓ Custom extraction & cartAdditionCandidate generated:", res_order["cartAdditionCandidate"])

    # Test Wait Time query
    res_wait = barista.process_message("How long is the wait right now?")
    assert "wait time" in res_wait["message"].lower()
    print("✓ Wait time query answered conversationally!")

    # 2. Wait Predictor Engine
    print("\n--- [Pillar 2: Better Waits & Busyness Forecast] ---")
    predictor = WaitPredictor(FORECAST_PATH, MENU_PATH)
    
    sample_basket = [
        {"id": "item_1", "name": "Amber Honey Oat Flat White"},
        {"id": "item_7", "name": "Pistachio Rosewater Croissant"}
    ]
    calc = predictor.calculate_wait_time(sample_basket, active_orders_count=2, active_baristas=3)
    assert calc["estimatedWaitMinutes"] > 0
    assert "speedTier" in calc
    print(f"✓ Dynamic wait calculation for 2 items + 2 orders ahead: {calc['estimatedWaitMinutes']} mins ({calc['speedTier']})")

    forecast = predictor.get_forecast()
    assert len(forecast["hourlyForecast"]) == 12
    print(f"✓ Hourly busyness curves loaded for {len(forecast['hourlyForecast'])} operational hours.")

    # 3. Discovery Engine
    print("\n--- [Pillar 3: Discovery & Personalized Pairings] ---")
    discovery = DiscoveryEngine(MENU_PATH)
    
    pairings_focus = discovery.get_mood_recommendation(mood="focus", weather="sunny")
    assert len(pairings_focus["curatedPairings"]) >= 2
    print("✓ Synergy pairing generated:", pairings_focus["curatedPairings"][0]["title"], "->", pairings_focus["curatedPairings"][0]["synergy"][:65], "...")

    # Taste Profile matching
    quiz_res = discovery.match_taste_profile({"roast": "light", "sweetness": "none", "milk": "black"})
    assert quiz_res["persona"] == "The Single-Origin Purist"
    print("✓ Taste Profiler matched persona:", quiz_res["persona"], "-> Recommended:", quiz_res["recommendedItem"]["name"])

    # 4. Social Table Engine
    print("\n--- [Pillar 4: Connect People / The Social Table] ---")
    social = SocialTableEngine(DEMO_PATH)
    patrons = social.get_patrons()
    assert len(patrons) >= 4
    print(f"✓ Loaded {len(patrons)} active patrons with opt-in presence modes.")

    # Add new patron beacon
    new_patron = social.add_patron({
        "name": "Alex Mercer",
        "presence": "Open to Chat",
        "currentFocus": "Building an autonomous agent framework ⚡",
        "interests": ["Machine Learning", "System Architecture", "Specialty Coffee"]
    })
    assert new_patron["name"] == "Alex Mercer"
    print("✓ New patron beacon successfully broadcasted!")

    # Calculate interest match
    matches = social.calculate_matches(["Machine Learning", "UI/UX Design"])
    assert len(matches) > 0
    print(f"✓ Highest compatibility match: {matches[0]['patron']['name']} with {matches[0]['compatibility']}% affinity!")

    # 5. Room Pulse & Operations Engine
    print("\n--- [Pillar 5: Understand the Room / Operations & Barista Dashboard] ---")
    pulse = RoomPulseEngine(DEMO_PATH)
    metrics = pulse.get_pulse_metrics()
    assert metrics["liveSentimentScore"] > 80
    assert metrics["acousticsDb"] > 40
    print(f"✓ Live Room Telemetry: Sentiment = {metrics['liveSentimentScore']}%, Decibels = {metrics['acousticsDb']} dB ({metrics['acousticsStatus']})")

    # Ingest negative feedback to verify automatic staff alert generation
    fb_entry = pulse.submit_feedback(
        text="A bit chilly near the window, could someone check the AC?",
        rating=2,
        customer="Guest at Table 5"
    )
    assert fb_entry["sentiment"] == "Needs Attention"
    latest_metrics = pulse.get_pulse_metrics()
    assert any("Guest Feedback Attention Needed" in a["title"] for a in latest_metrics["staffAlerts"])
    print("✓ Ingested room feedback automatically triggered proactive Staff Alert card!")

    # Test Order Progression Kanban
    order = pulse.add_order({
        "customerName": "Sophia L.",
        "tableNumber": "Table 9",
        "orderType": "Dine-In",
        "items": [{"name": "Ethiopia Yirgacheffe V60", "price": 6.50}],
        "total": 6.50
    })
    assert order["status"] == "In Queue"
    updated_order = pulse.update_order_status(order["id"], "Brewing")
    assert updated_order["status"] == "Brewing"
    print(f"✓ Order #{order['id']} status transition verified: In Queue -> Brewing")

    print("\n" + "=" * 60)
    print("🏆 ALL 5 PILLARS SYSTEM INTEGRITY VERIFIED (100% PASS)")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
