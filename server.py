"""
The Café Companion - Backend Server (Tornado Async Web Server)
Orchestrates AI Barista conversational engine, predictive wait times,
flavor discovery, social matchmaking, and room sentiment telemetry.
"""

import os
import json
import logging
import tornado.ioloop
import tornado.web

from engine.ai_barista import AIBarista
from engine.wait_predictor import WaitPredictor
from engine.discovery_engine import DiscoveryEngine
from engine.social_table import SocialTableEngine
from engine.room_pulse import RoomPulseEngine

# Directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
STATIC_DIR = os.path.join(BASE_DIR, "static")

MENU_PATH = os.path.join(DATA_DIR, "menu.json")
FORECAST_PATH = os.path.join(DATA_DIR, "forecast.json")
DEMO_PATH = os.path.join(DATA_DIR, "demo_data.json")

# Initialize engines
ai_barista = AIBarista(MENU_PATH)
wait_predictor = WaitPredictor(FORECAST_PATH, MENU_PATH)
discovery_engine = DiscoveryEngine(MENU_PATH)
social_engine = SocialTableEngine(DEMO_PATH)
pulse_engine = RoomPulseEngine(DEMO_PATH)

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with, Content-Type")
        self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.set_header("Content-Type", "application/json")

    def options(self, *args, **kwargs):
        self.set_status(204)
        self.finish()

    def get_json_body(self):
        try:
            return json.loads(self.request.body.decode('utf-8'))
        except Exception:
            return {}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "text/html")
        with open(os.path.join(STATIC_DIR, "index.html"), "r", encoding="utf-8") as f:
            self.write(f.read())

class MenuHandler(BaseHandler):
    def get(self):
        with open(MENU_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.write(json.dumps(data))

class ChatHandler(BaseHandler):
    def post(self):
        body = self.get_json_body()
        message = body.get("message", "")
        history = body.get("history", [])
        cart = body.get("cart", [])
        response = ai_barista.process_message(message, history, cart)
        self.write(json.dumps(response))

class WaitPredictionHandler(BaseHandler):
    def get(self):
        orders = pulse_engine.get_orders()
        active_count = len([o for o in orders if o.get("status") in ["In Queue", "Brewing"]])
        calc = wait_predictor.calculate_wait_time([], active_count)
        forecast = wait_predictor.get_forecast()
        res = {
            "currentEstimate": calc,
            "forecast": forecast
        }
        self.write(json.dumps(res))

    def post(self):
        body = self.get_json_body()
        items = body.get("items", [])
        orders = pulse_engine.get_orders()
        active_count = len([o for o in orders if o.get("status") in ["In Queue", "Brewing"]])
        calc = wait_predictor.calculate_wait_time(items, active_count)
        self.write(json.dumps(calc))

class DiscoveryHandler(BaseHandler):
    def get(self):
        mood = self.get_argument("mood", "focus")
        weather = self.get_argument("weather", "sunny")
        rec = discovery_engine.get_mood_recommendation(mood, weather)
        self.write(json.dumps(rec))

class TasteProfileHandler(BaseHandler):
    def post(self):
        body = self.get_json_body()
        res = discovery_engine.match_taste_profile(body)
        self.write(json.dumps(res))

class SocialPatronsHandler(BaseHandler):
    def get(self):
        patrons = social_engine.get_patrons()
        self.write(json.dumps(patrons))

    def post(self):
        body = self.get_json_body()
        patron = social_engine.add_patron(body)
        self.write(json.dumps(patron))

class SocialCorkboardHandler(BaseHandler):
    def get(self):
        notices = social_engine.get_corkboard()
        self.write(json.dumps(notices))

    def post(self):
        body = self.get_json_body()
        item = social_engine.post_corkboard(body)
        self.write(json.dumps(item))

class RoomPulseHandler(BaseHandler):
    def get(self):
        metrics = pulse_engine.get_pulse_metrics()
        self.write(json.dumps(metrics))

class FeedbackHandler(BaseHandler):
    def post(self):
        body = self.get_json_body()
        text = body.get("text", "")
        rating = int(body.get("rating", 5))
        customer = body.get("customer", "Guest Patron")
        res = pulse_engine.submit_feedback(text, rating, customer)
        self.write(json.dumps(res))

class OrdersHandler(BaseHandler):
    def get(self):
        orders = pulse_engine.get_orders()
        self.write(json.dumps(orders))

    def post(self):
        body = self.get_json_body()
        order = pulse_engine.add_order(body)
        self.write(json.dumps(order))

class OrderStatusHandler(BaseHandler):
    def post(self):
        body = self.get_json_body()
        order_id = body.get("orderId", "")
        new_status = body.get("status", "Brewing")
        order = pulse_engine.update_order_status(order_id, new_status)
        if order:
            self.write(json.dumps(order))
        else:
            self.set_status(404)
            self.write(json.dumps({"error": "Order not found"}))

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/index.html", MainHandler),
        (r"/api/menu", MenuHandler),
        (r"/api/chat", ChatHandler),
        (r"/api/wait-prediction", WaitPredictionHandler),
        (r"/api/wait-prediction/calculate", WaitPredictionHandler),
        (r"/api/discovery/recommendation", DiscoveryHandler),
        (r"/api/discovery/taste-profile", TasteProfileHandler),
        (r"/api/social/patrons", SocialPatronsHandler),
        (r"/api/social/corkboard", SocialCorkboardHandler),
        (r"/api/pulse", RoomPulseHandler),
        (r"/api/pulse/feedback", FeedbackHandler),
        (r"/api/orders", OrdersHandler),
        (r"/api/orders/update-status", OrderStatusHandler),
        (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": STATIC_DIR}),
        (r"/css/(.*)", tornado.web.StaticFileHandler, {"path": os.path.join(STATIC_DIR, "css")}),
        (r"/js/(.*)", tornado.web.StaticFileHandler, {"path": os.path.join(STATIC_DIR, "js")}),
    ], debug=True)

if __name__ == "__main__":
    port = 8080
    app = make_app()
    app.listen(port)
    print(f"✨ The Café Companion server running on http://127.0.0.1:{port}")
    tornado.ioloop.IOLoop.current().start()
