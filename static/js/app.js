/**
 * The Café Companion — Client Application Logic
 * Integrates Conversational AI Barista, Wait Predictor, Discovery Engine,
 * Social Commons, and Barista Room Pulse Operations.
 */

// Global Application State
const state = {
  view: 'customer', // 'customer' or 'barista'
  customerTab: 'ordering',
  menu: { categories: [], items: [] },
  cart: [],
  orders: [],
  forecast: null,
  pulse: null,
  patrons: [],
  corkboard: [],
  chatHistory: [],
  activeCustomizingItem: null,
  forecastChartInstance: null,
  userBeacon: null
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    fetchMenu(),
    fetchWaitForecast(),
    fetchOrders(),
    fetchRoomPulse(),
    fetchSocialData()
  ]);

  initBaristaChat();
  renderForecastChart();
  fetchDiscoveryPairings();

  // Polling loop for live telemetry feel (every 10 seconds)
  setInterval(() => {
    fetchRoomPulse(true);
    fetchOrders(true);
  }, 10000);
});

// ==========================================
// VIEW & TAB SWITCHING
// ==========================================
function toggleAppView() {
  state.view = state.view === 'customer' ? 'barista' : 'customer';
  const customerView = document.getElementById('customerView');
  const baristaView = document.getElementById('baristaView');
  const viewToggleLabel = document.getElementById('viewToggleLabel');

  if (state.view === 'barista') {
    customerView.classList.add('hidden');
    baristaView.classList.remove('hidden');
    viewToggleLabel.textContent = 'Switch to Customer View';
    fetchRoomPulse();
    renderBaristaDashboard();
    showToast('Switched to Barista Team Command Dashboard', 'fa-user-gear');
  } else {
    baristaView.classList.add('hidden');
    customerView.classList.remove('hidden');
    viewToggleLabel.textContent = 'Switch to Barista Team';
    showToast('Switched to Customer Experience', 'fa-mug-hot');
  }
}

function switchCustomerTab(tabId) {
  state.customerTab = tabId;
  const tabs = ['ordering', 'waits', 'discovery', 'social'];
  
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtn-${t}`);
    const content = document.getElementById(`tabContent-${t}`);
    
    if (t === tabId) {
      btn.className = 'nav-pill active flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-black transition-all whitespace-nowrap shadow-lg shadow-amber-500/20';
      content.classList.remove('hidden');
    } else {
      btn.className = 'nav-pill flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all whitespace-nowrap';
      content.classList.add('hidden');
    }
  });

  if (tabId === 'waits' && state.forecastChartInstance) {
    state.forecastChartInstance.resize();
  }
}

// ==========================================
// DATA FETCHING FUNCTIONS (With Automatic Standalone / Offline Resilience)
// ==========================================
const FALLBACK = (typeof FALLBACK_DATA !== 'undefined') ? FALLBACK_DATA : {
  menu: { categories: [], items: [] },
  forecast: { hourlyForecast: [] },
  demo: { orders: [], socialPatrons: [], corkboard: [], roomPulse: {} }
};

async function fetchMenu() {
  try {
    const res = await fetch('/api/menu');
    if (res.ok) {
      state.menu = await res.json();
    } else {
      state.menu = FALLBACK.menu;
    }
  } catch (err) {
    state.menu = FALLBACK.menu;
  }
  renderMenuItems(state.menu.items || []);
}

async function fetchWaitForecast() {
  try {
    const res = await fetch('/api/wait-prediction');
    if (res.ok) {
      const data = await res.json();
      state.forecast = data.forecast;
      updateWaitMetricsUI(data.currentEstimate);
      return;
    }
  } catch (err) {}
  state.forecast = FALLBACK.forecast;
  updateWaitMetricsUI({ estimatedWaitMinutes: 4.5, waitClassification: "Express Track (Fast)" });
}

async function fetchOrders(silent = false) {
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      state.orders = await res.json();
    } else if (!state.orders || state.orders.length === 0) {
      state.orders = [...(FALLBACK.demo.orders || [])];
    }
  } catch (err) {
    if (!state.orders || state.orders.length === 0) {
      state.orders = [...(FALLBACK.demo.orders || [])];
    }
  }
  if (state.view === 'barista') {
    renderKanban();
  }
  renderOrderTracker();
}

function renderOrderTracker() {
  const container = document.getElementById('orderTrackerContainer');
  if (!container || !state.orders || state.orders.length === 0) return;

  const activeOrder = state.orders.find(o => o.status !== 'Completed') || state.orders[0];
  if (!activeOrder) return;

  const titleEl = container.querySelector('h2');
  if (titleEl) {
    titleEl.textContent = `Order #${activeOrder.id} Progress Tracker (${activeOrder.customerName})`;
  }

  const estTimeEl = document.getElementById('trackerEstTime');
  if (estTimeEl) {
    if (activeOrder.status === 'Ready') {
      estTimeEl.textContent = '🎉 Ready for pickup / delivered!';
      estTimeEl.className = 'text-sm font-bold text-emerald-400';
    } else if (activeOrder.status === 'Brewing') {
      estTimeEl.textContent = '~1.5 minutes remaining';
      estTimeEl.className = 'text-sm font-bold text-amber-400';
    } else {
      estTimeEl.textContent = '~3.5 minutes remaining';
      estTimeEl.className = 'text-sm font-bold text-amber-300';
    }
  }

  const stepBoxes = container.querySelectorAll('.step-box');
  if (stepBoxes.length >= 4) {
    let stepNum = 1;
    if (activeOrder.status === 'Brewing') stepNum = 2;
    if (activeOrder.status === 'Ready' || activeOrder.status === 'Completed') stepNum = 4;

    stepBoxes.forEach((box, idx) => {
      const circle = box.querySelector('div');
      const text = box.querySelector('p');
      box.classList.remove('opacity-50');

      if (idx + 1 < stepNum) {
        circle.className = 'w-10 h-10 mx-auto rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/20';
        circle.innerHTML = '<i class="fa-solid fa-check"></i>';
        text.className = 'text-xs font-semibold text-white';
      } else if (idx + 1 === stepNum) {
        circle.className = 'w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black flex items-center justify-center font-bold text-sm step-active shadow-lg shadow-amber-500/30';
        text.className = 'text-xs font-semibold text-amber-400';
      } else {
        box.classList.add('opacity-50');
        circle.className = 'w-10 h-10 mx-auto rounded-full bg-white/5 border border-white/10 text-zinc-500 flex items-center justify-center font-bold text-sm';
        text.className = 'text-xs font-medium text-zinc-500';
      }
    });
  }
}

async function fetchRoomPulse(silent = false) {
  try {
    const res = await fetch('/api/pulse');
    if (res.ok) {
      state.pulse = await res.json();
    } else if (!state.pulse) {
      state.pulse = FALLBACK.demo.roomPulse;
    }
  } catch (err) {
    if (!state.pulse) {
      state.pulse = FALLBACK.demo.roomPulse;
    }
  }
  updateRoomPulseUI(state.pulse);
}

async function fetchSocialData() {
  try {
    const [patronsRes, corkRes] = await Promise.all([
      fetch('/api/social/patrons'),
      fetch('/api/social/corkboard')
    ]);
    if (patronsRes.ok && corkRes.ok) {
      state.patrons = await patronsRes.json();
      state.corkboard = await corkRes.json();
    } else {
      state.patrons = [...(FALLBACK.demo.socialPatrons || [])];
      state.corkboard = [...(FALLBACK.demo.corkboard || [])];
    }
  } catch (err) {
    state.patrons = [...(FALLBACK.demo.socialPatrons || [])];
    state.corkboard = [...(FALLBACK.demo.corkboard || [])];
  }
  renderSocialPatrons();
  renderCorkboard();
}

// ==========================================
// 1. SMARTER ORDERING & CONVERSATIONAL BARISTA
// ==========================================
function initBaristaChat() {
  const container = document.getElementById('baristaMessages');
  container.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-black flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
        ☕
      </div>
      <div class="liquid-glass-card p-4 rounded-2xl rounded-tl-sm text-xs space-y-2 max-w-[85%] border border-white/10 shadow-lg text-zinc-200">
        <p class="text-white font-medium leading-relaxed">
          Good morning! ☕ I'm your <strong>Aura AI Barista</strong>. Trained on all our single-origin roasts, brew ratios, alt-milks, and dietary synergies.
        </p>
        <p class="text-zinc-400">
          Tell me what flavors you're craving, what project you're working on, or any dietary goals!
        </p>
      </div>
    </div>
  `;

  renderQuickReplies([
    "Something iced & refreshing 🧊",
    "Best coffee for deep work 💻",
    "Vegan & gluten-free options 🌿",
    "Surprise me with a signature pairing ✨"
  ]);
}

function renderQuickReplies(replies) {
  const container = document.getElementById('chatQuickReplies');
  if (!replies || replies.length === 0) {
    container.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');
  container.innerHTML = replies.map(r => `
    <button onclick="handleQuickReply('${escapeQuotes(r)}')" class="whitespace-nowrap px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-amber-400/40 text-[11px] text-zinc-300 hover:text-white transition-all">
      ${r}
    </button>
  `).join('');
}

function handleQuickReply(text) {
  document.getElementById('baristaInput').value = text;
  handleBaristaSend(new Event('submit'));
}

async function handleBaristaSend(e) {
  e.preventDefault();
  const input = document.getElementById('baristaInput');
  const userText = input.value.trim();
  if (!userText) return;

  input.value = '';
  appendUserChatMessage(userText);

  // Show typing indicator
  const typingId = showTypingIndicator();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        history: state.chatHistory,
        cart: state.cart
      })
    });
    if (res.ok) {
      const data = await res.json();
      removeTypingIndicator(typingId);
      appendBaristaChatMessage(data);
      if (data.quickReplies) {
        renderQuickReplies(data.quickReplies);
      }
      return;
    }
  } catch (err) {}

  // Local rule-based conversational AI fallback
  setTimeout(() => {
    removeTypingIndicator(typingId);
    const low = userText.toLowerCase();
    const items = state.menu.items || [];
    let reply = {
      message: "Here is an artisan craft recommendation tailored to your request! Our team hand-pulls each shot with precision.",
      suggestedItems: items.slice(0, 2),
      quickReplies: ["I want high caffeine ⚡", "Show vegan options 🌿", "Add to my tray 🛒"]
    };

    if (low.includes('wait') || low.includes('time') || low.includes('busy')) {
      reply.message = "Current bar flow is smooth! Estimated wait is **~3.5 minutes** for handcrafted espresso. You can track live queue status in the **Better Waits** tab.";
      reply.quickReplies = ["View wait forecast ⏱️", "Recommend a fast drink ⚡"];
    } else if (low.includes('focus') || low.includes('study') || low.includes('work') || low.includes('coding')) {
      reply.message = "For sustained deep focus without caffeine jitters, I recommend pairing our **Ceremonial Uji Matcha Latte** with clean plant fats. Its L-theanine promotes calm, laser-sharp alpha brainwaves.";
      reply.suggestedItems = items.filter(i => i.id === 'item_4' || i.id === 'item_1');
    } else if (low.includes('oat') || low.includes('flat white') || low.includes('honey')) {
      reply.message = "Our signature **Amber Honey Oat Flat White** is pulled with double ristretto over steamed minor figures oat milk with smoked sea salt.";
      reply.suggestedItems = items.filter(i => i.id === 'item_1');
      reply.cartAdditionCandidate = { id: 'item_1', name: 'Amber Honey Oat Flat White', price: 5.50, mods: 'Hot, Oat Milk, Wild Honey' };
    } else if (low.includes('cold') || low.includes('iced') || low.includes('refresh')) {
      reply.message = "Crisp and invigorating! Our **Cascara Cloud Cold Brew** is slow-steeped for 18 hours and crowned with silky cascara cherry whipped cold foam.";
      reply.suggestedItems = items.filter(i => i.id === 'item_2');
      reply.cartAdditionCandidate = { id: 'item_2', name: 'Cascara Cloud Cold Brew', price: 6.00, mods: 'Iced, Cascara Foam' };
    }

    appendBaristaChatMessage(reply);
    renderQuickReplies(reply.quickReplies);
  }, 400);
}

function appendUserChatMessage(text) {
  const container = document.getElementById('baristaMessages');
  const bubble = document.createElement('div');
  bubble.className = 'flex items-start justify-end gap-2.5';
  bubble.innerHTML = `
    <div class="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold p-3 rounded-2xl rounded-tr-sm text-xs max-w-[80%] shadow-lg shadow-amber-500/20">
      ${escapeHtml(text)}
    </div>
  `;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  state.chatHistory.push({ role: 'user', content: text });
}

function appendBaristaChatMessage(data) {
  const container = document.getElementById('baristaMessages');
  const bubble = document.createElement('div');
  bubble.className = 'flex items-start gap-3';

  let itemsHtml = '';
  if (data.suggestedItems && data.suggestedItems.length > 0) {
    itemsHtml = `
      <div class="pt-2 space-y-2">
        ${data.suggestedItems.map(item => `
          <div class="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 shadow-md">
            <div class="flex items-center gap-2.5">
              <img src="${item.image}" alt="${item.name}" class="w-10 h-10 object-cover rounded-lg" />
              <div>
                <h4 class="font-bold text-white text-xs">${item.name}</h4>
                <p class="text-[10px] text-amber-400 font-mono font-bold">$${item.price.toFixed(2)} • ${item.caffeineLevel || 'Standard'}</p>
              </div>
            </div>
            <button onclick="openCustomizeModal('${item.id}')" class="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-[11px] whitespace-nowrap shadow-sm">
              Add +
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  let cartAddHtml = '';
  if (data.cartAdditionCandidate) {
    const c = data.cartAdditionCandidate;
    cartAddHtml = `
      <div class="mt-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
        <div class="text-[11px]">
          <span class="font-bold text-emerald-400">Ready to Queue:</span>
          <p class="text-white">${c.name} (${c.mods}) - $${c.price.toFixed(2)}</p>
        </div>
        <button onclick="addDirectToCart('${c.id}', '${escapeQuotes(c.name)}', ${c.price}, '${escapeQuotes(c.mods)}', this)" class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
          Confirm 🛒
        </button>
      </div>
    `;
  }

  bubble.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-black flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
      ☕
    </div>
    <div class="liquid-glass-card p-4 rounded-2xl rounded-tl-sm text-xs space-y-2 max-w-[85%] border border-white/10 shadow-lg text-zinc-200">
      <div class="leading-relaxed text-white">${formatMarkdown(data.message)}</div>
      ${itemsHtml}
      ${cartAddHtml}
    </div>
  `;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  state.chatHistory.push({ role: 'barista', content: data.message });
}

function showTypingIndicator() {
  const container = document.getElementById('baristaMessages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'flex items-center gap-2 text-zinc-400 text-xs p-2';
  div.innerHTML = `
    <span class="wave-bar"></span>
    <span class="wave-bar"></span>
    <span class="wave-bar"></span>
    <span class="text-[11px] ml-1">Barista is crafting recommendation...</span>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function openBaristaChatModal() {
  const modal = document.getElementById('baristaChatModal');
  if (modal) modal.classList.remove('hidden');
  const input = document.getElementById('baristaInput');
  if (input) setTimeout(() => input.focus(), 100);
}

function closeBaristaChatModal() {
  const modal = document.getElementById('baristaChatModal');
  if (modal) modal.classList.add('hidden');
}

function triggerQuickPrompt(promptText) {
  openBaristaChatModal();
  const input = document.getElementById('baristaInput');
  if (input) {
    input.value = promptText;
    handleBaristaSend(new Event('submit'));
  }
}

function handleQuickBaristaPrompt(e) {
  e.preventDefault();
  const heroInput = document.getElementById('heroBaristaInput');
  const text = heroInput ? heroInput.value.trim() : '';
  if (!text) {
    openBaristaChatModal();
    return;
  }
  heroInput.value = '';
  triggerQuickPrompt(text);
}

function triggerBaristaFocus() {
  openBaristaChatModal();
}

function resetBaristaChat() {
  state.chatHistory = [];
  initBaristaChat();
  showToast('Chat refreshed with AI Barista', 'fa-arrow-rotate-right');
}

function simulateVoiceInput() {
  const mic = document.getElementById('heroVoiceMic') || document.getElementById('voiceMicIcon');
  if (mic) mic.className = 'fa-solid fa-microphone-lines text-rose-500 animate-pulse';
  showToast('Listening... Speak naturally', 'fa-microphone');
  
  setTimeout(() => {
    if (mic) mic.className = 'fa-solid fa-microphone text-xs sm:text-sm';
    triggerQuickPrompt("I'd like an iced honey oat flat white, extra cold foam");
  }, 1500);
}

// ==========================================
// MENU CATALOG & FILTERS
// ==========================================
function renderMenuItems(items) {
  const grid = document.getElementById('menuItemsGrid');
  if (!grid) return;
  
  grid.innerHTML = items.map(item => `
    <div class="liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-white/10 hover:border-amber-400/50 shadow-xl transition-all">
      <div class="relative h-44 w-full overflow-hidden bg-black/60">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
        <span class="absolute top-2.5 right-2.5 font-mono font-bold text-xs bg-black/80 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-full border border-white/15 shadow-md">
          $${item.price.toFixed(2)}
        </span>
        ${item.tags && item.tags[0] ? `
          <span class="absolute top-2.5 left-2.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-md">
            ${item.tags[0]}
          </span>
        ` : ''}
      </div>

      <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div class="space-y-1">
          <h4 class="font-serif font-bold text-white text-base leading-snug tracking-tight">${item.name}</h4>
          <p class="text-xs text-zinc-400 line-clamp-2">${item.description}</p>
          
          <div class="flex flex-wrap gap-1 pt-1.5">
            ${(item.flavorNotes || []).map(fn => `
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-300 font-medium border border-white/10">
                ${fn}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="flex items-center justify-between pt-2.5 border-t border-white/10 gap-2">
          <button onclick="openCustomizeModal('${item.id}')" class="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition-colors">
            <i class="fa-solid fa-sliders text-[10px]"></i>
            <span>Customize</span>
          </button>
          <button onclick="addDirectToCart('${item.id}', '${escapeQuotes(item.name)}', ${item.price}, 'Standard Craft', this)" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs transition-all shadow-md flex items-center gap-1.5">
            <span>+ Add</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterMenuCategory(catId) {
  document.querySelectorAll('.category-pill').forEach(pill => {
    if (pill.dataset.cat === catId) {
      pill.className = 'category-pill px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-black border border-amber-400/60 transition-all shadow-md';
    } else {
      pill.className = 'category-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] text-zinc-300 border border-white/10 hover:border-white/20 hover:text-white transition-all';
    }
  });

  if (catId === 'all') {
    renderMenuItems(state.menu.items);
  } else {
    const filtered = state.menu.items.filter(i => i.category === catId);
    renderMenuItems(filtered);
  }
}

function applyDietaryFilter(diet) {
  if (diet === 'all') {
    renderMenuItems(state.menu.items);
  } else {
    const filtered = state.menu.items.filter(i => (i.dietary || []).includes(diet));
    renderMenuItems(filtered);
  }
}

// ==========================================
// ITEM CUSTOMIZATION MODAL
// ==========================================
function openCustomizeModal(itemId) {
  const item = state.menu.items.find(i => i.id === itemId);
  if (!item) return;

  state.activeCustomizingItem = item;
  document.getElementById('customModalItemName').textContent = item.name;
  document.getElementById('customModalItemPrice').textContent = `$${item.price.toFixed(2)}`;

  const container = document.getElementById('customModalOptions');
  const custom = item.customizable || {};
  let html = '';

  for (const [key, options] of Object.entries(custom)) {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    html += `
      <div class="space-y-1.5">
        <label class="font-bold text-white uppercase text-[10px] tracking-wider">${label}</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${options.map((opt, idx) => `
            <label class="cursor-pointer p-2.5 rounded-xl bg-white/[0.04] border border-white/10 has-[:checked]:border-amber-400 has-[:checked]:bg-amber-500/10 text-center text-xs shadow-sm">
              <input type="radio" name="custom_${key}" value="${opt}" ${idx === 0 ? 'checked' : ''} class="hidden" />
              <span class="text-white font-semibold">${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html || '<p class="text-zinc-400">Standard artisan recipe, perfectly balanced.</p>';
  document.getElementById('customizeModal').classList.remove('hidden');
}

function closeCustomizeModal() {
  document.getElementById('customizeModal').classList.add('hidden');
  state.activeCustomizingItem = null;
}

function confirmCustomizedItemAdd() {
  if (!state.activeCustomizingItem) return;
  const item = state.activeCustomizingItem;
  const selectedMods = [];

  const inputs = document.querySelectorAll('#customModalOptions input[type="radio"]:checked');
  inputs.forEach(input => selectedMods.push(input.value));

  const modString = selectedMods.join(', ') || 'Standard Artisan Craft';
  addDirectToCart(item.id, item.name, item.price, modString);
  closeCustomizeModal();
}

// ==========================================
// CART & ORDER MANAGEMENT
// ==========================================
function addDirectToCart(id, name, price, mods, btnEl = null) {
  state.cart.push({ id, name, price, mods, quantity: 1 });
  updateCartUI();
  showToast(`Added ${name} to Tray!`, 'fa-cart-plus');

  // Interactive Button Feedback
  const btn = btnEl || (window.event && window.event.target ? window.event.target.closest('button') : null);
  if (btn) {
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check text-xs"></i> <span>Added!</span>';
    btn.classList.add('brightness-125');
    setTimeout(() => {
      btn.innerHTML = originalHtml;
      btn.classList.remove('brightness-125');
    }, 1200);
  }

  // Header tray icon pulse
  const badge = document.getElementById('cartCountBadge');
  if (badge) {
    badge.classList.add('scale-125');
    setTimeout(() => badge.classList.remove('scale-125'), 300);
  }
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const isHidden = drawer.classList.contains('hidden');
  if (isHidden) {
    drawer.classList.remove('hidden');
    updateCartUI();
  } else {
    drawer.classList.add('hidden');
  }
}

function updateCartUI() {
  const countBadge = document.getElementById('cartCountBadge');
  if (countBadge) countBadge.textContent = state.cart.length;

  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-zinc-500 space-y-2">
        <i class="fa-solid fa-mug-saucer text-3xl text-zinc-700"></i>
        <p class="text-xs">Your tray is empty.</p>
        <p class="text-[11px] text-zinc-400">Chat with the AI Barista or pick from the artisan menu!</p>
      </div>
    `;
    const subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    const taxEl = document.getElementById('cartTax');
    if (taxEl) taxEl.textContent = '$0.00';
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = '$0.00';
    const waitEl = document.getElementById('cartPredictedWait');
    if (waitEl) waitEl.textContent = '~0 mins';
    return;
  }

  container.innerHTML = state.cart.map((item, idx) => `
    <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 shadow-md">
      <div class="space-y-0.5">
        <h4 class="font-bold text-white text-xs">${item.name}</h4>
        <p class="text-[10px] text-zinc-400">${item.mods}</p>
        <span class="text-xs font-mono font-bold text-amber-400">$${item.price.toFixed(2)}</span>
      </div>
      <button onclick="removeFromCart(${idx})" class="text-zinc-400 hover:text-rose-400 p-1 text-xs">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');

  const subtotal = state.cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const subtotalEl = document.getElementById('cartSubtotal');
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  const taxEl = document.getElementById('cartTax');
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  // Recalculate dynamic wait for this cart
  calculateCartWait();
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  updateCartUI();
}

async function calculateCartWait() {
  if (state.cart.length === 0) return;
  try {
    const res = await fetch('/api/wait-prediction/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: state.cart })
    });
    const data = await res.json();
    document.getElementById('cartPredictedWait').textContent = `~${data.estimatedWaitMinutes} mins (${data.speedTier})`;
  } catch (err) {
    console.error('Wait calculation error:', err);
  }
}

async function submitCartOrder() {
  if (state.cart.length === 0) {
    alert('Please add items to your tray first.');
    return;
  }

  const orderType = document.getElementById('orderTypeSelect').value;
  const table = document.getElementById('orderTableInput').value || 'Table 3';
  const subtotal = state.cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal * 1.08;

  const orderPayload = {
    customerName: 'You (Mobile Companion)',
    customerAvatar: '☕',
    tableNumber: table,
    orderType: orderType,
    estimatedWaitMin: 3.5,
    items: state.cart.map(c => ({ name: c.name, mods: c.mods, price: c.price })),
    total: parseFloat(total.toFixed(2))
  };

  let newOrder = null;
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (res.ok) {
      newOrder = await res.json();
    }
  } catch (err) {}

  if (!newOrder) {
    newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      customerName: 'You (Mobile Companion)',
      customerAvatar: '☕',
      tableNumber: table,
      orderType: orderType,
      status: "In Queue",
      statusStep: 1,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMin: 3.5,
      items: state.cart.map(c => ({ name: c.name, mods: c.mods, price: c.price })),
      total: parseFloat(total.toFixed(2))
    };
    state.orders.unshift(newOrder);
  }

  // Clear cart and close
  state.cart = [];
  updateCartUI();
  toggleCartDrawer();

  // Refresh orders and switch to Waits tab
  renderOrderTracker();
  switchCustomerTab('waits');
  showToast(`Order #${newOrder.id} placed! Track progress in Better Waits.`, 'fa-circle-check');
}

// ==========================================
// 2. BETTER WAITS & FORECAST CHART
// ==========================================
function updateWaitMetricsUI(est) {
  if (!est) return;
  const waitValEl = document.getElementById('currentWaitMinutesVal');
  if (waitValEl) {
    waitValEl.textContent = est.estimatedWaitMinutes.toFixed(1);
  }
}

function renderForecastChart() {
  const ctx = document.getElementById('forecastChart');
  if (!ctx || !state.forecast) return;
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js library not loaded');
    return;
  }

  if (state.forecastChartInstance) {
    try {
      state.forecastChartInstance.destroy();
    } catch (e) {}
  }

  const hours = state.forecast.hourlyForecast.map(h => h.hour);
  const busyness = state.forecast.hourlyForecast.map(h => h.busyness);
  const waitMinutes = state.forecast.hourlyForecast.map(h => h.waitMin);

  state.forecastChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [
        {
          label: 'Crowd Density (%)',
          data: busyness,
          borderColor: '#C86D2C',
          backgroundColor: 'rgba(200, 109, 44, 0.12)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Estimated Wait (Mins)',
          data: waitMinutes,
          borderColor: '#15803D',
          borderDash: [5, 5],
          pointRadius: 4,
          pointBackgroundColor: '#15803D',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#E4E4E7', font: { size: 11, family: 'Plus Jakarta Sans', weight: '600' } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#A1A1AA', font: { size: 10 } }
        },
        y: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#F59E0B', font: { size: 10, weight: '600' } },
          min: 0,
          max: 100
        },
        y1: {
          type: 'linear',
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#10B981', font: { size: 10, weight: '600' } },
          min: 0,
          max: 12
        }
      }
    }
  });

  // Render hourly cards below
  const list = document.getElementById('forecastHourlyList');
  if (list && state.forecast.hourlyForecast) {
    list.innerHTML = state.forecast.hourlyForecast.slice(0, 6).map(h => `
      <div class="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 shadow-sm text-center space-y-1 hover:border-amber-500/30 transition-colors">
        <p class="text-[10px] font-bold text-amber-400">${h.hour}</p>
        <p class="text-xs font-mono font-bold text-white">${h.waitMin} min wait</p>
        <p class="text-[9px] text-zinc-400 truncate">${h.vibe}</p>
      </div>
    `).join('');
  }
}

// ==========================================
// 3. DISCOVERY & PAIRINGS
// ==========================================
async function fetchDiscoveryPairings() {
  const mood = document.getElementById('discoveryMoodSelect')?.value || 'focus';
  const weather = document.getElementById('discoveryWeatherSelect')?.value || 'sunny';

  try {
    const res = await fetch(`/api/discovery/recommendation?mood=${mood}&weather=${weather}`);
    if (res.ok) {
      const data = await res.json();
      renderDiscoveryResults(data.curatedPairings);
      return;
    }
  } catch (err) {}

  // Fallback synergy pairings
  const items = state.menu.items || [];
  const matcha = items.find(i => i.id === 'item_4') || { id: 'item_4', name: 'Ceremonial Uji Matcha Latte', price: 5.75 };
  const toast = items.find(i => i.id === 'item_8') || { id: 'item_8', name: 'Heirloom Avocado & Yuzu Tartine', price: 9.50 };
  const cortado = items.find(i => i.id === 'item_3') || { id: 'item_3', name: 'Spanish Saffron Cortado', price: 4.85 };
  const croissant = items.find(i => i.id === 'item_6') || { id: 'item_6', name: 'Pistachio Rosewater Croissant', price: 4.95 };

  renderDiscoveryResults([
    {
      title: "The Deep Flow Ritual",
      tag: "Cognitive Synergy (Focus)",
      synergy: "L-Theanine in Kyoto matcha produces sustained alpha brainwaves, while healthy fats in sourdough avocado prevent glycemic spikes.",
      drink: matcha,
      food: toast
    },
    {
      title: "Golden Hour Solace",
      tag: "Warm Comfort & Mood Elevation",
      synergy: "Rich saffron terpenes harmonize with velvety milk texture, complemented by antioxidant-dense Sicilian pistachios.",
      drink: cortado,
      food: croissant
    }
  ]);
}

function renderDiscoveryResults(pairings) {
  const container = document.getElementById('discoveryPairingsContainer');
  if (!container || !pairings) return;

  container.innerHTML = pairings.map(p => `
    <div class="liquid-glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between space-y-4 shadow-xl">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-extrabold tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
            ${p.tag}
          </span>
          <span class="text-xs text-zinc-400 font-serif italic">Synergy Match</span>
        </div>
        <h4 class="font-serif text-lg font-bold text-white">${p.title}</h4>
        
        <!-- Drink & Food Duo Showcase -->
        <div class="grid grid-cols-2 gap-3 pt-1">
          <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
            <span class="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Beverage</span>
            <p class="font-bold text-xs text-white">${p.drink.name}</p>
            <p class="text-[10px] text-amber-400 font-mono font-bold">$${p.drink.price.toFixed(2)}</p>
          </div>
          <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
            <span class="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Culinary Pair</span>
            <p class="font-bold text-xs text-white">${p.food.name}</p>
            <p class="text-[10px] text-emerald-400 font-mono font-bold">$${p.food.price.toFixed(2)}</p>
          </div>
        </div>

        <p class="text-xs text-zinc-400 pt-1 leading-relaxed">
          <strong class="text-white">Why it works:</strong> ${p.synergy}
        </p>
      </div>

      <button onclick="orderPairingCombo('${p.drink.id}', '${p.food.id}')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all">
        Add Pairing to Tray ($${(p.drink.price + p.food.price).toFixed(2)})
      </button>
    </div>
  `).join('');
}

function orderPairingCombo(drinkId, foodId) {
  const drink = state.menu.items.find(i => i.id === drinkId);
  const food = state.menu.items.find(i => i.id === foodId);
  if (drink) state.cart.push({ id: drink.id, name: drink.name, price: drink.price, mods: 'Artisan Synergy Pairing', quantity: 1 });
  if (food) state.cart.push({ id: food.id, name: food.name, price: food.price, mods: 'Warmed Pairing', quantity: 1 });
  updateCartUI();
  toggleCartDrawer();
  showToast('Added Synergistic Duo to Tray!', 'fa-wand-magic-sparkles');
}

// Taste Quiz
function openTasteQuizModal() {
  document.getElementById('tasteQuizModal').classList.remove('hidden');
}
function closeTasteQuizModal() {
  document.getElementById('tasteQuizModal').classList.add('hidden');
}
async function submitTasteQuiz(e) {
  e.preventDefault();
  const form = document.getElementById('tasteQuizForm');
  const formData = new FormData(form);
  const answers = {
    roast: formData.get('roast'),
    milk: formData.get('milk'),
    sweetness: formData.get('sweetness')
  };

  let result = null;
  try {
    const res = await fetch('/api/discovery/taste-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
    });
    if (res.ok) result = await res.json();
  } catch (err) {}

  if (!result) {
    const items = state.menu.items || [];
    if (answers.milk === 'none') {
      result = {
        persona: "The Single-Origin Purist",
        description: "You revere unadulterated terroir, delicate berry florals, and bright clean acidity.",
        recommendedItem: items.find(i => i.id === 'item_5') || items[0]
      };
    } else {
      result = {
        persona: "The Velvet Explorer",
        description: "You appreciate silky micro-foam, complex honey sweetness, and comforting aromatics.",
        recommendedItem: items.find(i => i.id === 'item_1') || items[0]
      };
    }
  }

  const resultContainer = document.getElementById('tasteQuizResult');
  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = `
    <div class="space-y-2">
      <span class="text-[10px] font-extrabold tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full">Your Match</span>
      <h4 class="font-serif text-lg font-bold text-white">${result.persona}</h4>
      <p class="text-xs text-zinc-400">${result.description}</p>
      <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between shadow-md">
        <div>
          <p class="text-[10px] text-amber-400 font-bold">Recommended Drink:</p>
          <p class="text-xs font-bold text-white">${result.recommendedItem.name}</p>
        </div>
        <button onclick="addDirectToCart('${result.recommendedItem.id}', '${result.recommendedItem.name}', ${result.recommendedItem.price}, 'Taste Match'); closeTasteQuizModal();" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-md">
          Add to Tray ☕
        </button>
      </div>
    </div>
  `;
}

// ==========================================
// 4. THE SOCIAL TABLE (CAFÉ COMMONS)
// ==========================================
function renderSocialPatrons() {
  const grid = document.getElementById('socialPatronsGrid');
  if (!grid) return;

  grid.innerHTML = state.patrons.map(p => `
    <div class="liquid-glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between space-y-3.5 shadow-xl">
      <div class="space-y-2.5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${p.avatar}" alt="${p.name}" class="w-11 h-11 rounded-full object-cover border border-white/15 shadow-md" />
            <div>
              <h4 class="font-bold text-white text-sm">
                ${p.name}
              </h4>
              <p class="text-[11px] text-zinc-400 font-medium">${p.table}</p>
            </div>
          </div>

          <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${p.presence === 'Open to Chat' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : p.presence === 'Co-Working / Collab' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}">
            <span class="inline-block w-1.5 h-1.5 rounded-full ${p.presence === 'Open to Chat' ? 'bg-emerald-400 animate-pulse' : p.presence === 'Co-Working / Collab' ? 'bg-amber-400' : 'bg-purple-400'} mr-1"></span>
            ${p.presence}
          </span>
        </div>

        <p class="text-xs text-zinc-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5 leading-relaxed font-medium">
          "${p.currentFocus}"
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5">
          ${p.interests.map(tag => `
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 border border-white/10 font-medium">
              #${tag}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2 pt-2 border-t border-white/10">
        <button onclick="sparkIcebreaker('${escapeQuotes(p.name)}', '${escapeQuotes(p.icebreakerPrompt)}')" class="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors">
          <i class="fa-solid fa-sparkles text-amber-400"></i>
          <span>AI Icebreaker</span>
        </button>
        <button onclick="sendCoffeeCheers('${escapeQuotes(p.name)}')" class="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all" title="Send Coffee Cheers">
          ☕ Cheers
        </button>
      </div>
    </div>
  `).join('');
}

function sparkIcebreaker(name, prompt) {
  alert(`✨ AI Icebreaker Spark for ${name}:\n\n"${prompt}"\n\nTips: A warm, unhurried smile and a genuine question make natural café conversations easy!`);
}

function sendCoffeeCheers(name) {
  showToast(`You sent a digital Coffee Cheers to ${name}! ☕✨`, 'fa-mug-hot');
}

function openBeaconModal() {
  document.getElementById('beaconModal').classList.remove('hidden');
}
function closeBeaconModal() {
  document.getElementById('beaconModal').classList.add('hidden');
}
async function submitBeacon(e) {
  e.preventDefault();
  const name = document.getElementById('beaconName').value;
  const table = document.getElementById('beaconTable').value;
  const presence = document.getElementById('beaconPresence').value;
  const currentFocus = document.getElementById('beaconFocus').value;
  const interests = document.getElementById('beaconInterests').value.split(',').map(s => s.trim()).filter(Boolean);

  const payload = {
    name,
    table,
    presence,
    currentFocus,
    interests: interests.length > 0 ? interests : ['Coffee', 'Deep Work', 'Design']
  };

  let newPatron = null;
  try {
    const res = await fetch('/api/social/patrons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) newPatron = await res.json();
  } catch (err) {}

  if (!newPatron) {
    newPatron = {
      id: `patron_${Date.now()}`,
      name: payload.name,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      table: payload.table,
      presence: payload.presence,
      currentFocus: payload.currentFocus,
      interests: payload.interests,
      icebreakerPrompt: `Ask ${payload.name} what sparked their focus on ${payload.interests[0] || 'creativity'} today!`
    };
  }

  state.patrons.unshift(newPatron);
  renderSocialPatrons();
  closeBeaconModal();

  // Show active bar
  const bar = document.getElementById('userActiveBeaconBar');
  bar.classList.remove('hidden');
  document.getElementById('userBeaconSummary').textContent = `"${currentFocus} • ${presence}"`;
  showToast('Your Table Beacon is now live on the Café Commons radar!', 'fa-tower-broadcast');
}

function removeUserBeacon() {
  document.getElementById('userActiveBeaconBar').classList.add('hidden');
  showToast('Table beacon turned off', 'fa-power-off');
}

function renderCorkboard() {
  const grid = document.getElementById('corkboardGrid');
  if (!grid) return;

  grid.innerHTML = state.corkboard.map(c => `
    <div class="liquid-glass-card rounded-2xl p-4 border border-white/10 space-y-2 flex flex-col justify-between shadow-lg">
      <div class="space-y-1">
        <div class="flex items-center justify-between text-[10px]">
          <span class="text-amber-400 font-bold">${c.tag}</span>
          <span class="text-zinc-500">${c.date}</span>
        </div>
        <h4 class="font-bold text-white text-xs">${c.title}</h4>
        <p class="text-[11px] text-zinc-400 leading-relaxed">${c.desc}</p>
      </div>
      <p class="text-[10px] text-zinc-500 font-mono pt-1">by ${c.author}</p>
    </div>
  `).join('');
}

function openPostNoticeModal() {
  const title = prompt('Notice Title (e.g. "Looking for Chess Partner"):');
  if (!title) return;
  const desc = prompt('Notice Description:');
  if (!desc) return;

  fetch('/api/social/corkboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, desc, tag: 'Community', author: 'You' })
  }).then(r => r.json()).then(item => {
    state.corkboard.unshift(item);
    renderCorkboard();
    showToast('Notice pinned to Corkboard!', 'fa-thumbtack');
  });
}

// ==========================================
// 5. UNDERSTAND THE ROOM & BARISTA DASHBOARD
// ==========================================
function updateRoomPulseUI(pulse) {
  if (!pulse) return;

  // Header Status
  const headerStatus = document.getElementById('headerLiveStatus');
  if (headerStatus) {
    headerStatus.textContent = `Bar Flowing • ~4.5m wait • ${pulse.acousticsDb} dB Ambient`;
  }

  // Barista View Metrics
  const sentimentScoreEl = document.getElementById('pulseSentimentScore');
  if (sentimentScoreEl) sentimentScoreEl.textContent = `${pulse.liveSentimentScore}%`;

  const decibelsEl = document.getElementById('pulseDecibels');
  if (decibelsEl) decibelsEl.textContent = `${pulse.acousticsDb} dB`;

  const decibelDescEl = document.getElementById('pulseDecibelDesc');
  if (decibelDescEl) decibelDescEl.textContent = pulse.acousticsStatus;

  // Render Alerts
  const alertsContainer = document.getElementById('baristaAlertsContainer');
  if (alertsContainer && pulse.staffAlerts) {
    alertsContainer.innerHTML = pulse.staffAlerts.map(alert => `
      <div class="p-3.5 rounded-2xl ${alert.level === 'warning' ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : alert.level === 'info' ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'} border flex items-start justify-between gap-3 text-xs shadow-md backdrop-blur-md">
        <div class="space-y-1">
          <p class="font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-bell"></i> ${alert.title}
          </p>
          <p class="text-[11px] leading-snug opacity-90">${alert.message}</p>
        </div>
        <button onclick="dismissAlert('${alert.id}')" class="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-bold text-white transition-colors whitespace-nowrap shadow-sm">
          ${alert.action}
        </button>
      </div>
    `).join('');
  }

  // Render Feedback Feed
  const feedbackContainer = document.getElementById('feedbackStreamList');
  if (feedbackContainer && pulse.recentFeedback) {
    feedbackContainer.innerHTML = pulse.recentFeedback.slice(0, 3).map(f => `
      <div class="liquid-glass-card rounded-2xl p-4 border border-white/10 shadow-md space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-white">${f.customer}</span>
          <span class="text-amber-400 font-mono text-[11px]">${'⭐'.repeat(f.rating)}</span>
        </div>
        <p class="text-xs text-zinc-400 italic leading-relaxed">"${f.text}"</p>
        <div class="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
          <span class="px-2 py-0.5 rounded-full font-bold ${f.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : f.sentiment === 'Needs Attention' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-white/5 text-zinc-300 border border-white/10'}">
            ${f.sentiment}
          </span>
          <span>${f.time}</span>
        </div>
      </div>
    `).join('');
  }
}

function dismissAlert(alertId) {
  if (state.pulse && state.pulse.staffAlerts) {
    state.pulse.staffAlerts = state.pulse.staffAlerts.filter(a => a.id !== alertId);
    updateRoomPulseUI(state.pulse);
    showToast('Alert handled and cleared', 'fa-check');
  }
}

function renderKanban() {
  const queueCol = document.getElementById('kanbanQueueList');
  const brewCol = document.getElementById('kanbanBrewingList');
  const readyCol = document.getElementById('kanbanReadyList');

  const inQueue = state.orders.filter(o => o.status === 'In Queue');
  const brewing = state.orders.filter(o => o.status === 'Brewing');
  const ready = state.orders.filter(o => o.status === 'Ready');

  document.getElementById('colCount-queue').textContent = inQueue.length;
  document.getElementById('colCount-brewing').textContent = brewing.length;
  document.getElementById('colCount-ready').textContent = ready.length;

  queueCol.innerHTML = inQueue.map(o => renderKanbanCard(o, 'Brewing', 'Start Brewing ☕')).join('') || emptyKanbanCol();
  brewCol.innerHTML = brewing.map(o => renderKanbanCard(o, 'Ready', 'Mark Ready 🔔')).join('') || emptyKanbanCol();
  readyCol.innerHTML = ready.map(o => renderKanbanCard(o, 'Completed', 'Serve / Clear ✅')).join('') || emptyKanbanCol();
}

function emptyKanbanCol() {
  return `<p class="text-xs text-zinc-500 text-center py-6">No orders in this station.</p>`;
}

function renderKanbanCard(order, nextStatus, nextBtnLabel) {
  return `
    <div class="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5 shadow-md hover:border-amber-500/30 transition-colors">
      <div class="flex items-center justify-between text-xs">
        <span class="font-mono font-bold text-amber-400">#${order.id}</span>
        <span class="text-[10px] text-zinc-400">${order.tableNumber} • ${order.orderType}</span>
      </div>

      <div class="space-y-0.5">
        <h5 class="font-bold text-white text-xs">${order.customerName}</h5>
        <div class="space-y-0.5 text-[11px] text-zinc-300">
          ${order.items.map(item => `
            <div>
              <span>• ${item.name}</span>
              ${item.mods ? `<p class="text-[10px] text-zinc-500 pl-2">${item.mods}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
        <span class="text-[10px] text-zinc-500 font-mono">${order.placedAt}</span>
        <button onclick="updateOrderStatus('${order.id}', '${nextStatus}')" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-[11px] shadow-sm transition-all">
          ${nextBtnLabel}
        </button>
      </div>
    </div>
  `;
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch('/api/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus })
    });
    if (res.ok) {
      await fetchOrders();
      showToast(`Order #${orderId} moved to ${newStatus}`, 'fa-arrow-right');
      return;
    }
  } catch (err) {}

  // Fallback offline transition
  const o = (state.orders || []).find(ord => ord.id === orderId);
  if (o) o.status = newStatus;
  renderKanban();
  renderOrderTracker();
  showToast(`Order #${orderId} moved to ${newStatus}`, 'fa-arrow-right');
}

function renderBaristaDashboard() {
  if (state.pulse) updateRoomPulseUI(state.pulse);
  renderKanban();
}

// Guest Feedback Simulator
function openFeedbackSimModal() {
  document.getElementById('feedbackSimModal').classList.remove('hidden');
}
function closeFeedbackSimModal() {
  document.getElementById('feedbackSimModal').classList.add('hidden');
}
async function submitFeedbackSim(e) {
  e.preventDefault();
  const customer = document.getElementById('simGuestLocation').value;
  const rating = parseInt(document.getElementById('simRating').value);
  const text = document.getElementById('simComment').value;

  try {
    const res = await fetch('/api/pulse/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, rating, text })
    });
    if (res.ok) {
      await fetchRoomPulse();
      closeFeedbackSimModal();
      showToast('Feedback submitted! Room pulse & alerts updated in real time.', 'fa-heart-pulse');
      return;
    }
  } catch (err) {}

  // Fallback offline feedback simulation
  const sentiment = rating >= 4 ? 'Positive' : rating <= 2 ? 'Needs Attention' : 'Neutral';
  if (!state.pulse) state.pulse = { ...(FALLBACK.demo.roomPulse || {}) };
  if (!state.pulse.recentFeedback) state.pulse.recentFeedback = [];
  if (!state.pulse.staffAlerts) state.pulse.staffAlerts = [];

  state.pulse.recentFeedback.unshift({ customer, rating, text, sentiment, time: 'Just now' });
  if (sentiment === 'Needs Attention') {
    state.pulse.staffAlerts.unshift({
      id: `alert-${Date.now()}`,
      title: `Guest Alert: ${customer}`,
      message: text,
      level: 'warning',
      action: 'Check Table'
    });
  }
  closeFeedbackSimModal();
  updateRoomPulseUI(state.pulse);
  showToast('Feedback submitted! Room pulse & alerts updated in real time.', 'fa-heart-pulse');
}

// ==========================================
// TOAST NOTIFICATIONS & HELPERS
// ==========================================
function showToast(message, iconClass = 'fa-circle-check') {
  const toast = document.getElementById('toastNotification');
  const icon = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMessage');
  if (!toast) return;

  if (icon) icon.className = `fa-solid ${iconClass} text-amber-400 text-base`;
  if (msg) msg.textContent = message;

  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 2800);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function escapeQuotes(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}
