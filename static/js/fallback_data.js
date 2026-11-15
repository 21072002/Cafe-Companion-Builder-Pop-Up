// Embedded fallback dataset for standalone/offline and file:// execution
const FALLBACK_DATA = {
  "menu": {
    "categories": [
      {
        "id": "espresso",
        "name": "Specialty Espresso",
        "icon": "\u2615"
      },
      {
        "id": "pourover",
        "name": "Slow Bar & Single Origin",
        "icon": "\ud83e\uded6"
      },
      {
        "id": "botanical",
        "name": "Botanical, Teas & Matcha",
        "icon": "\ud83c\udf75"
      },
      {
        "id": "bakery",
        "name": "Artisanal Bakery",
        "icon": "\ud83e\udd50"
      },
      {
        "id": "savory",
        "name": "Wholesome Savory & Bowls",
        "icon": "\ud83e\udd57"
      }
    ],
    "items": [
      {
        "id": "item_1",
        "name": "Amber Honey Oat Flat White",
        "category": "espresso",
        "price": 5.5,
        "description": "Double ristretto over velvety micro-foamed oat milk infused with raw wildflower honey and smoked sea salt.",
        "flavorNotes": [
          "Wild Honey",
          "Smoked Toffee",
          "Velvety Oat"
        ],
        "caffeineLevel": "High",
        "prepTimeSec": 130,
        "tags": [
          "Popular",
          "Plant-based friendly"
        ],
        "dietary": [
          "Vegetarian"
        ],
        "customizable": {
          "temperature": [
            "Hot",
            "Iced"
          ],
          "milk": [
            "Oat Milk",
            "Almond Milk",
            "Pistachio Milk",
            "Whole Milk"
          ],
          "sweetness": [
            "Unsweetened",
            "Light (25%)",
            "Standard (50%)",
            "Full (100%)"
          ],
          "shots": [
            "Single",
            "Double (Default)",
            "Triple (+1.00)",
            "Decaf"
          ]
        },
        "image": "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "item_2",
        "name": "Cascara Cloud Cold Brew",
        "category": "espresso",
        "price": 6.0,
        "description": "18-hour single-origin slow cold brew crowned with silky cascara cherry whipped cold foam and orange zest.",
        "flavorNotes": [
          "Cherry Blossoms",
          "Dark Cocoa",
          "Candied Orange"
        ],
        "caffeineLevel": "Very High",
        "prepTimeSec": 90,
        "tags": [
          "Staff Pick",
          "Refreshing"
        ],
        "dietary": [
          "Gluten-Free",
          "Vegetarian"
        ],
        "customizable": {
          "temperature": [
            "Iced"
          ],
          "milk": [
            "Cold Foam (Oat)",
            "Cold Foam (Dairy)",
            "No Foam"
          ],
          "sweetness": [
            "Unsweetened",
            "Light (25%)",
            "Standard (50%)"
          ],
          "shots": [
            "Standard Cold Brew",
            "Draft Nitro (+0.75)"
          ]
        },
        "image": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "item_3",
        "name": "Spanish Saffron Cortado",
        "category": "espresso",
        "price": 5.25,
        "description": "Equal parts rich espresso and condensed cardamom milk with real saffron threads. Intensely aromatic.",
        "flavorNotes": [
          "Saffron",
          "Cardamom",
          "Toasted Pecan"
        ],
        "caffeineLevel": "Medium",
        "prepTimeSec": 120,
        "tags": [
          "Artisan Craft"
        ],
        "dietary": [
          "Vegetarian",
          "Gluten-Free"
        ],
        "customizable": {
          "temperature": [
            "Hot",
            "Iced"
          ],
          "milk": [
            "Whole Milk",
            "Oat Milk"
          ],
          "sweetness": [
            "Light",
            "Standard",
            "Less Sweet"
          ],
          "shots": [
            "Double (Standard)",
            "Decaf"
          ]
        },
        "image": "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "item_4",
        "name": "Ethiopia Yirgacheffe V60 Pour-Over",
        "category": "pourover",
        "price": 6.5,
        "description": "Washed heirloom lot. Delicately hand-poured with blooming temperature precision. Jasmine and peach notes.",
        "flavorNotes": [
          "Jasmine Florals",
          "White Peach",
          "Meyer Lemon"
        ],
        "caffeineLevel": "Medium-High",
        "prepTimeSec": 240,
        "tags": [
          "Single Origin",
          "Slow Bar"
        ],
        "dietary": [
          "Vegan",
          "Gluten-Free",
          "Sugar-Free"
        ],
        "customizable": {
          "temperature": [
            "Hot",
            "Flash Chilled (+0.50)"
          ],
          "grindProfile": [
            "Standard Filter",
            "Fine Extraction"
          ],
          "strength": [
            "Delicate (1:16)",
            "Balanced (1:15)",
            "Intense (1:14)"
          ]
        },
        "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "item_5",
        "name": "Ceremonial Uji Matcha Latte",
        "category": "botanical",
        "price": 5.75,
        "description": "First-harvest stone-ground Kyoto matcha whisked to order with warm oat milk and touch of pure vanilla bean.",
        "flavorNotes": [
          "Sweet Umami",
          "Spring Grass",
          "Creamy Vanilla"
        ],
        "caffeineLevel": "Smooth Focus (L-Theanine)",
        "prepTimeSec": 150,
        "tags": [
          "Calm Focus",
          "Superfood"
        ],
        "dietary": [
          "Vegan",
          "Gluten-Free"
        ],
        "customizable": {
          "temperature": [
            "Hot",
            "Iced"
          ],
          "milk": [
            "Oat Milk (Recommended)",
            "Almond Milk",
            "Whole Milk"
          ],
          "sweetness": [
            "Unsweetened",
            "Light (Vanilla)",
            "Sweet"
          ],
          "matchaGrade": [
            "Ceremonial (Standard)",
            "Imperial Extra Shot (+1.50)"
          ]
        },
        "image": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "item_6",
        "name": "Blueberry Hibiscus Sparkler",
        "category": "botanical",
        "price": 4.85,
        "description": "Cold-steeped ruby hibiscus blossoms, crushed wild Maine blueberries, sparkling mineral water, and fresh mint sprig.",
        "flavorNotes": [
          "Tart Cranberry",
          "Crushed Berry",
          "Crisp Mint"
        ],
        "caffeineLevel": "Zero Caffeine",
        "prepTimeSec": 60,
        "tags": [
          "Zero Caffeine",
          "Hydrating"
        ],
        "dietary": [
          "Vegan",
          "Gluten-Free"
        ],
        "customizable": {
          "temperature": [
            "Iced"
          ],
          "sweetness": [
            "Tart / Unsweetened",
            "Agave Touch",
            "Sweet"
          ],
          "effervescence": [
            "Gently Sparkling",
            "Extra Fizz"
          ]
        },
        "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "item_7",
        "name": "Pistachio Rosewater Croissant",
        "category": "bakery",
        "price": 4.95,
        "description": "Twice-baked butter croissant filled with house-ground Sicilian pistachio frangipane and scented with Damask rose glaze.",
        "flavorNotes": [
          "Toasted Nut",
          "Flaky Butter",
          "Subtle Rose"
        ],
        "caffeineLevel": "None",
        "prepTimeSec": 75,
        "tags": [
          "Bestseller",
          "Freshly Baked"
        ],
        "dietary": [
          "Vegetarian"
        ],
        "customizable": {
          "warming": [
            "Warm & Crisp (Recommended)",
            "Room Temp"
          ],
          "service": [
            "Dine-In Plate",
            "To-Go Bag"
          ]
        },
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "item_8",
        "name": "Avocado & Yuzu Tartine",
        "category": "savory",
        "price": 8.75,
        "description": "Toasted seeded sourdough, smashed Hass avocado, Japanese yuzu kosho, pickled shallots, microgreens, and toasted sesame.",
        "flavorNotes": [
          "Bright Citrus",
          "Creamy Avocado",
          "Seeded Crunch"
        ],
        "caffeineLevel": "None",
        "prepTimeSec": 180,
        "tags": [
          "Wholesome",
          "High Energy"
        ],
        "dietary": [
          "Vegan",
          "Dairy-Free"
        ],
        "customizable": {
          "egg": [
            "No Egg",
            "Poached Farm Egg (+1.50)",
            "Soft-boiled Egg (+1.50)"
          ],
          "bread": [
            "Seeded Sourdough",
            "Gluten-Free Brioche (+1.00)"
          ],
          "spice": [
            "Mild Yuzu",
            "Extra Spicy Kosho"
          ]
        },
        "image": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "item_9",
        "name": "Truffled Mushroom & Gruy\u00e8re Toastie",
        "category": "savory",
        "price": 9.5,
        "description": "Slow-braised cremini and shiitake mushrooms with aged Swiss Gruy\u00e8re, thyme butter, and white truffle essence on pain de mie.",
        "flavorNotes": [
          "Earthy Truffle",
          "Melted Nutty Cheese",
          "Crisp Thyme"
        ],
        "caffeineLevel": "None",
        "prepTimeSec": 220,
        "tags": [
          "Comfort Food",
          "Chef Special"
        ],
        "dietary": [
          "Vegetarian"
        ],
        "customizable": {
          "pressing": [
            "Well Toasted & Crispy",
            "Gently Melted"
          ],
          "side": [
            "Herb Sea Salt Chips",
            "Baby Arugula Salad"
          ]
        },
        "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  "forecast": {
    "currentStatus": {
      "occupancyPercent": 48,
      "availableSeats": 18,
      "totalSeats": 35,
      "avgWaitMinutes": 4.5,
      "activeBaristas": 3,
      "roomVibe": "Focus & Flow (Warm hum, lo-fi beats, warm lighting)",
      "soundLevelDb": 56,
      "soundClassification": "Comfortable Ambient",
      "optimalTimeBadge": "Great Time for Deep Work or Light Meetings"
    },
    "hourlyForecast": [
      {
        "hour": "7:00 AM",
        "militaryHour": 7,
        "busyness": 20,
        "waitMin": 2,
        "vibe": "Serene Morning Dawn",
        "recommendedFor": "Solo espresso & reading"
      },
      {
        "hour": "8:00 AM",
        "militaryHour": 8,
        "busyness": 65,
        "waitMin": 6,
        "vibe": "Morning Rush",
        "recommendedFor": "Quick pick-up"
      },
      {
        "hour": "9:00 AM",
        "militaryHour": 9,
        "busyness": 88,
        "waitMin": 9,
        "vibe": "High Energy Buzz",
        "recommendedFor": "Pre-order recommended"
      },
      {
        "hour": "10:00 AM",
        "militaryHour": 10,
        "busyness": 72,
        "waitMin": 7,
        "vibe": "Lively Co-Working",
        "recommendedFor": "Social meetups"
      },
      {
        "hour": "11:00 AM",
        "militaryHour": 11,
        "busyness": 45,
        "waitMin": 4,
        "vibe": "Balanced Flow",
        "recommendedFor": "Ideal study / focus window"
      },
      {
        "hour": "12:00 PM",
        "militaryHour": 12,
        "busyness": 82,
        "waitMin": 8,
        "vibe": "Lunchtime Spark",
        "recommendedFor": "Sandwiches & Bowls"
      },
      {
        "hour": "1:00 PM",
        "militaryHour": 13,
        "busyness": 68,
        "waitMin": 6,
        "vibe": "Active Midday",
        "recommendedFor": "Post-lunch coffee"
      },
      {
        "hour": "2:00 PM",
        "militaryHour": 14,
        "busyness": 40,
        "waitMin": 3.5,
        "vibe": "Quiet Golden Hour",
        "recommendedFor": "Prime creative session"
      },
      {
        "hour": "3:00 PM",
        "militaryHour": 15,
        "busyness": 55,
        "waitMin": 5,
        "vibe": "Afternoon Tea Chime",
        "recommendedFor": "Matcha & Pastry pause"
      },
      {
        "hour": "4:00 PM",
        "militaryHour": 16,
        "busyness": 38,
        "waitMin": 3,
        "vibe": "Deep Focus",
        "recommendedFor": "Long reading / writing"
      },
      {
        "hour": "5:00 PM",
        "militaryHour": 17,
        "busyness": 30,
        "waitMin": 2.5,
        "vibe": "Dusk Acoustic",
        "recommendedFor": "Unwinding & gentle catchup"
      },
      {
        "hour": "6:00 PM",
        "militaryHour": 18,
        "busyness": 22,
        "waitMin": 2,
        "vibe": "Mellow Twilight",
        "recommendedFor": "Decaf, herbal tea & quiet"
      }
    ],
    "bestTimeRecommendations": [
      {
        "period": "Morning Quiet Window",
        "timeRange": "10:45 AM - 11:45 AM",
        "reason": "Post-morning rush lull. 65% seating available, baristas ready for artisan pour-overs with 3-minute turnaround."
      },
      {
        "period": "Afternoon Focus Nirvana",
        "timeRange": "2:00 PM - 3:30 PM",
        "reason": "Sunlight fills the west gallery. Lowest acoustic noise (52 dB), perfect bandwidth, mellow music."
      }
    ]
  },
  "demo": {
    "orders": [
      {
        "id": "ORD-104",
        "customerName": "Elena R.",
        "customerAvatar": "\ud83d\udc69\u200d\ud83d\udcbb",
        "tableNumber": 3,
        "orderType": "Dine-In",
        "status": "Brewing",
        "statusStep": 2,
        "placedAt": "10:52 AM",
        "estimatedWaitMin": 3.5,
        "items": [
          {
            "name": "Amber Honey Oat Flat White",
            "mods": "Hot, Oat Milk, Standard Sweetness, Double Ristretto",
            "price": 5.5
          },
          {
            "name": "Pistachio Rosewater Croissant",
            "mods": "Warmed & Crispy",
            "price": 4.95
          }
        ],
        "total": 10.45
      },
      {
        "id": "ORD-105",
        "customerName": "Marcus T.",
        "customerAvatar": "\ud83d\udc68\u200d\ud83c\udfa8",
        "tableNumber": 7,
        "orderType": "To-Go",
        "status": "Ready",
        "statusStep": 3,
        "placedAt": "10:48 AM",
        "estimatedWaitMin": 0.5,
        "items": [
          {
            "name": "Cascara Cloud Cold Brew",
            "mods": "Cold Foam (Oat), Light Sweetness",
            "price": 6.0
          }
        ],
        "total": 6.0
      },
      {
        "id": "ORD-106",
        "customerName": "Devon & Sam",
        "customerAvatar": "\ud83e\uddd1\u200d\ud83d\udd2c",
        "tableNumber": 12,
        "orderType": "Dine-In",
        "status": "In Queue",
        "statusStep": 1,
        "placedAt": "10:55 AM",
        "estimatedWaitMin": 5.0,
        "items": [
          {
            "name": "Ceremonial Uji Matcha Latte",
            "mods": "Iced, Oat Milk, Unsweetened",
            "price": 5.75
          },
          {
            "name": "Avocado & Yuzu Tartine",
            "mods": "Poached Farm Egg, Seeded Sourdough",
            "price": 10.25
          }
        ],
        "total": 16.0
      }
    ],
    "socialPatrons": [
      {
        "id": "patron_1",
        "name": "Liam Vance",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        "table": "Table 4 (Window Bar)",
        "presence": "Open to Chat",
        "presenceColor": "emerald",
        "currentFocus": "Designing an offline-first mobile app for nature journaling \ud83c\udf3f",
        "interests": [
          "UI/UX Design",
          "Indie Hacking",
          "Specialty Coffee",
          "Hiking"
        ],
        "coffeeDrink": "Ethiopia Yirgacheffe V60",
        "icebreakerPrompt": "Ask Liam about his favorite minimalist app designs or where he gets single-origin beans!"
      },
      {
        "id": "patron_2",
        "name": "Maya Chen",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        "table": "Table 8 (Central Wood Table)",
        "presence": "Co-Working / Collab",
        "presenceColor": "amber",
        "currentFocus": "Researching multimodal AI agents & fine-tuning small language models \ud83e\udd16",
        "interests": [
          "Machine Learning",
          "Python",
          "Sci-Fi Books",
          "Matcha Enthusiast"
        ],
        "coffeeDrink": "Ceremonial Uji Matcha Latte",
        "icebreakerPrompt": "Ask Maya what she thinks about local AI agents or trade sci-fi book recommendations!"
      },
      {
        "id": "patron_3",
        "name": "Dr. Aris Thorne",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        "table": "Table 2 (Corner Booth)",
        "presence": "Silent Focus Buddy",
        "presenceColor": "violet",
        "currentFocus": "Writing chapter 4 of a historical fiction novel set in 1920s Vienna \u270d\ufe0f",
        "interests": [
          "Creative Writing",
          "History",
          "Chess",
          "Cortados"
        ],
        "coffeeDrink": "Spanish Saffron Cortado",
        "icebreakerPrompt": "Silent accountability partner. Give a respectful nod or challenge to a 10-minute speed chess game!"
      },
      {
        "id": "patron_4",
        "name": "Sora & Kaito",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
        "table": "Table 11 (Communal High-Top)",
        "presence": "Open to Chat",
        "presenceColor": "emerald",
        "currentFocus": "Organizing the Sunday Morning City Run & Roastery Hop \ud83c\udfc3\u200d\u2642\ufe0f\u2615",
        "interests": [
          "Running / 5K",
          "Photography",
          "Music Production",
          "Pastry Lovers"
        ],
        "coffeeDrink": "Cascara Cloud Cold Brew",
        "icebreakerPrompt": "Ask them about the upcoming weekend scenic 5k trail route starting right outside the caf\u00e9!"
      }
    ],
    "corkboard": [
      {
        "id": "cork_1",
        "title": "Wednesday Evening Board Game & Pour-over Club",
        "author": "Marcus (Barista)",
        "date": "Every Wed \u2022 6:30 PM",
        "tag": "Events",
        "desc": "Join us for casual Catan, Wingspan, and special single-origin micro-lots brewed tableside."
      },
      {
        "id": "cork_2",
        "title": "Local Book Swap Box",
        "author": "Community Corner",
        "date": "Always Open",
        "tag": "Exchange",
        "desc": "Take a book, leave a book. Currently on shelf: 'Klara and the Sun', 'Atomic Habits', 'Design Systems'."
      },
      {
        "id": "cork_3",
        "title": "Looking for Frontend React Dev for Coffee Tech Hackathon",
        "author": "Maya Chen",
        "date": "Posted 2h ago",
        "tag": "Collab",
        "desc": "Building a smart sensor app for micro-roasters. Stop by Table 8 if you'd like to jam!"
      }
    ],
    "roomPulse": {
      "liveSentimentScore": 93,
      "sentimentTrend": "+4% vs yesterday",
      "acousticsDb": 56,
      "acousticsStatus": "Optimal Ambient (Focus & Conversation)",
      "temperatureF": 70.5,
      "currentPlaylist": "Caf\u00e9 Lo-Fi & Mellow Brazilian Bossa Nova",
      "currentBpm": 74,
      "staffAlerts": [
        {
          "id": "alert_1",
          "level": "info",
          "title": "Cold Brew Surge (+42%)",
          "message": "Sunny midday shift caused sudden Cold Brew spike. Prep Keg #2 before 12:30 PM rush.",
          "action": "Dismiss"
        },
        {
          "id": "alert_2",
          "level": "warning",
          "title": "Zone B Acoustic Drift (63 dB)",
          "message": "Blender noise compounding with espresso grinder near pick-up counter. Suggest lower speaker volume at counter zone.",
          "action": "Adjusted"
        },
        {
          "id": "alert_3",
          "level": "success",
          "title": "Positive Vibe Streak",
          "message": "Last 12 customer feedback submissions gave 5/5 stars on hospitality and ambient comfort.",
          "action": "Celebrate"
        }
      ],
      "recentFeedback": [
        {
          "customer": "Guest at Table 4",
          "rating": 5,
          "sentiment": "Positive",
          "text": "The saffron cortado with the lo-fi beats is absolute perfection. Getting 3 hours of deep coding done!",
          "time": "12m ago"
        },
        {
          "customer": "Guest at Bar",
          "rating": 5,
          "sentiment": "Positive",
          "text": "Barista knew exactly which bean to suggest when I asked for floral notes. Outstanding knowledge.",
          "time": "28m ago"
        },
        {
          "customer": "Guest at Table 9",
          "rating": 4,
          "sentiment": "Neutral",
          "text": "Coffee was amazing! A slight draft near the patio door, but otherwise super cozy.",
          "time": "45m ago"
        }
      ]
    }
  }
};
