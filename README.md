# ☕ The Café Companion (Aura Café AI)
### *A Smarter, More Connected Café Experience Powered by AI*

---

## 🌟 Executive Overview
**The Café Companion** is a dual-perspective AI ecosystem crafted for modern artisan coffee roasters, third-wave cafés, and community spaces. It bridges the gap between **patrons** seeking great coffee, productive workspaces, and serendipitous human connections, and **café teams** striving for fluid operations, harmonious acoustic ambiance, and exceptional hospitality.

```
                     ┌────────────────────────────────────────┐
                     │          THE CAFÉ COMPANION            │
                     │         (Aura Intelligence)            │
                     └───────────────────┬────────────────────┘
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                                                 ▼
 ☕ CUSTOMER EXPERIENCE                                            👨‍🍳 CAFÉ TEAM OPERATIONS
 ├── 1. Smarter Ordering (AI Barista Assistant)                    ├── 5. Understand the Room (Acoustic Decibels)
 ├── 2. Better Waits (Wait Prediction & Hourly Heatmap)            ├── 6. Live Sentiment & Comfort Feedback
 ├── 3. Discovery (Mood/Weather Pairings & Taste Profiler)         ├── 7. Barista Queue Kanban Flow
 └── 4. The Social Table (Opt-in Beacon & AI Icebreakers)          └── 8. Smart Staff Restock/Acoustic Alerts
```

---

## 🏛️ The Five Core Pillars

### 1. 🤖 Smarter Ordering
- **Conversational AI Barista**: Natural language and simulated voice order parsing. Patrons can type or speak freely:
  > *"I want an iced oat flat white with subtle sweetness and something light to pair with my coding session."*
- **Ingredient & Flavor Intelligence**: Automatically parses roast acidity, brew ratios, dairy substitutes (Oat, Almond, Pistachio, Whole), decaf alternatives, and sweetness percentages.
- **Direct Tray Integration**: Barista recommendations contain 1-click **Add to Tray** triggers with real-time bill calculation.
- **Dietary & Allergen Filtering**: 1-click filtering across Vegan, Vegetarian, Gluten-Free, and Sugar-Free artisan items.

### 2. ⏱️ Better Waits
- **Dynamic AI Wait-Time Predictor**:
  $$\text{Wait Time} = \frac{\text{Queue Backlog} + \sum \text{Item Complexity}}{\text{Active Baristas}} + \text{Rush Hour Overhead}$$
  Considers whether a drink is an instant batch brew (45s), an espresso build (120s), or an artisan V60 pour-over (240s).
- **Live 4-Stage Visual Stepper**:
  - `Stage 1`: Order Received & Confirmed
  - `Stage 2`: Bean Grinding, Extraction & Steaming
  - `Stage 3`: Finishing Touches & Plating
  - `Stage 4`: Ready for Pickup / Delivered to Table
- **"Best Times to Visit" Forecasting**:
  - 12-hour predictive curve (7:00 AM – 6:00 PM) showing crowd density (%) and estimated wait times.
  - Highlights quiet focus windows (e.g. *10:45 AM - 11:45 AM* and *2:00 PM - 3:30 PM*).

### 3. ✨ Personalized Discovery
- **Mood & Weather Harmonizer**:
  - Select your vibe (*Deep Focus*, *Cozy Chill*, *Social Spark*, *Afternoon Revival*) and weather (*Sunny*, *Rainy*, *Warm*).
  - Chemical and flavor synergy matching: Pairs drinks and foods (e.g., *Kyoto Matcha Latte + Avocado Yuzu Tartine* for sustained L-theanine cognitive focus without insulin crashes).
- **Interactive Taste Profiler Quiz**:
  - 3-step quiz mapping roast preference, milk texture, and aromatics into signature personas (*The Single-Origin Purist*, *The Botanical Connoisseur*, *The Velvet Explorer*).
- **Terroir & Micro-Lot Showcase**: Educational insights into seasonal single origins (Ethiopia Yirgacheffe washed lot, Colombia Huila Geisha anaerobic).

### 4. 👥 Connect People (The Social Table / Café Commons)
- **Opt-In Table Beacon**:
  - Patrons can turn their table into an open invitation by broadcasting their status:
    - 🟢 *Open to Chat* (Casual conversation, coffee tasting)
    - 🟡 *Co-Working / Collab* (Seeking tech/design feedback, jamming)
    - 🟣 *Silent Focus Buddy* (Accountability partner, deep focus)
- **AI Icebreaker Sparks**:
  - Generates context-aware, low-pressure conversation starters based on overlapping interest tags (e.g. *#UIUX*, *#MachineLearning*, *#SciFiBooks*).
- **Digital Coffee Cheers ☕**: Send a respectful, non-intrusive high-five to a neighbor.
- **Community Corkboard**: Digital bulletin board for weekly chess meetups, book swaps, and local creative circles.

### 5. 📊 Understand the Room (Café Pulse & Barista Command)
- **Acoustic & Decibel Telemetry**:
  - Live sound level meter (e.g. 56 dB – *Optimal Ambient Hum*) with simulated acoustic waveform and volume drift alerts.
- **Real-Time Customer Sentiment Stream**:
  - Ingests customer star ratings and feedback with automatic sentiment parsing (`Positive`, `Neutral`, `Needs Attention`).
- **AI Operational Action Cards**:
  - Proactive notifications: Cold brew inventory spikes, patio door draft warnings, grinder calibration alerts.
- **Barista Order Flow Kanban**:
  - 3-column drag/click Kanban (`In Queue` ➔ `Brewing & Plating` ➔ `Ready`).
  - Barista actions directly update the customer's live order progress tracker in real time.
- **Feedback Simulation Suite**: Test how live customer sentiment alerts fire and get resolved.

---

## 🛠️ Technology Stack & Architecture

- **Backend**: Python 3.12 + **Tornado 6.6** (Asynchronous non-blocking web server, REST API, JSON endpoints)
- **Frontend**: Responsive Single-Page Application (HTML5, Tailwind CSS, FontAwesome 6, Chart.js for time-series forecasting, custom micro-animations)
- **State Management**: Reactive vanilla JS with zero build-step overhead
- **Design Language**: Deep Obsidian Black (`#060504`) with ultra-luxurious **Transparent Liquid Glassmorphism** (translucent frosted backdrop blur, specular edge reflections, glowing amber liquid pills, and interactive canvas-based molten amber fluid metaballs that react dynamically to cursor/touch gestures).

---

## 🚀 How to Run the Application

### 1. Start the Server
Open a terminal in the project directory:
```powershell
cd "PATH"
python server.py
```

### 2. Open in Your Browser
Navigate to:
```
http://127.0.0.1:8080
```

### 3. Run the Automated Unit Test Suite
To verify all 5 pillars and core engines:
```powershell
python test_engines.py
```
*(All 5 engines pass with 100% test coverage!)*

---

## 📁 Project Directory Structure
```
cafe-companion/
├── server.py                 # Tornado async web server & REST endpoints
├── test_engines.py           # Unit test suite verifying all 5 pillars
├── README.md                 # Project architecture & system manual
├── engine/
│   ├── ai_barista.py         # Conversational ordering & natural language parser
│   ├── wait_predictor.py     # Recipe complexity & rush-hour predictive engine
│   ├── discovery_engine.py   # Mood, weather, and chemical synergy pairing engine
│   ├── social_table.py       # Opt-in beacons, interest matching & AI icebreakers
│   └── room_pulse.py         # Acoustic telemetry, live sentiment & staff alerts
├── static/
│   ├── index.html            # Dual-view modern web interface (Customer & Barista)
│   ├── css/
│   │   └── styles.css        # Bespoke artisan typography, glassmorphism, wave bars
│   └── js/
│       └── app.js            # Reactive application logic, chat, cart, charts, kanban
└── data/
    ├── menu.json             # Artisan coffee, specialty tea, bakery & brunch catalog
    ├── forecast.json         # Hourly crowd density & wait time forecast curves
    └── demo_data.json        # Active patrons, live orders & room telemetry state
```
