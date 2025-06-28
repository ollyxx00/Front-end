console.log("😀 scripts.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("🟢 DOM fully loaded");

  // --- Dark Mode Toggle ---
  const body = document.body;
  const dmBtn = document.getElementById("darkModeToggle");
  if (localStorage.getItem("darkMode") === "on") body.classList.add("dark");
  dmBtn.onclick = () => {
    const enabled = body.classList.toggle("dark");
    localStorage.setItem("darkMode", enabled ? "on" : "off");
  };

  // --- Tile Injection ---
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) return console.error("❌ '#dashboard' not found, tiles cannot inject.");

  dashboard.append(
    createMediaTile({ title: "Music & Co", playlist: "Get Up and Go" }),
    createSliderTile({ title: "Lamp", emoji: "💡", unit: "%", topic: "lamp-brightness", initial: 80 }),
    createWeatherTile({ city: "Liverpool" }),
    createTimerTile(),
    createSceneTile({ title: "Movie Night", emoji: "📺", sceneId: "movie" }),
    createActionTile({ title: "Lock Doors", emoji: "🔒", actionId: "lockDoors" }),
    createAddDeviceTile()
  );
});

// --- Tile Factory Functions ---

function createMediaTile({ title, playlist }) {
  const el = document.createElement("div");
  el.className = "tile tile-large";
  el.innerHTML = `
    <div class="tile-content">
      <div class="emoji">🎵</div>
      <h3>${title}</h3>
      <p>⏯️ ${playlist}</p>
      <div class="tile-overlay-button">
        <button class="overlay-btn">▶️</button>
      </div>
    </div>`;
  el.querySelector(".overlay-btn").onclick = () => {
    alert(`🎶 Playing playlist: ${playlist}`);
    console.log("[MEDIA PLAY]", playlist);
  };
  return el;
}

function createSliderTile({ title, emoji, unit, topic, initial }) {
  const el = document.createElement("div");
  el.className = "tile tile-small";
  el.innerHTML = `
    <div class="tile-content">
      <div class="emoji">${emoji}</div>
      <h3>${title}</h3>
      <p><span id="lbl-${topic}">${initial}${unit}</span></p>
      <input type="range" id="rng-${topic}" min="0" max="100" value="${initial}">
    </div>`;
  const slider = el.querySelector(`#rng-${topic}`);
  const label = el.querySelector(`#lbl-${topic}`);
  slider.oninput = e => {
    label.textContent = `${e.target.value}${unit}`;
    console.log(`[SLIDER] ${topic}: ${e.target.value}${unit}`);
  };
  return el;
}

function createWeatherTile({ city }) {
  const el = document.createElement("div");
  el.className = "tile tile-small";
  el.innerHTML = `
    <div class="tile-content">
      <div class="emoji">🌤️</div>
      <h3 id="weather-temp">--°C</h3>
      <p id="weather-cond">--</p>
    </div>`;
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_API_KEY`)
    .then(res => res.json())
    .then(data => {
      el.querySelector("#weather-temp").textContent = `${Math.round(data.main.temp)}°C`;
      el.querySelector("#weather-cond").textContent = data.weather[0].description;
    })
    .catch(err => console.error("[WEATHER ERROR]", err));

  return el;
}

function createTimerTile() {
  let elapsed = 0, timer = null;
  const el = document.createElement("div");
  el.className = "tile tile-small";
  el.innerHTML = `
    <div class="tile-content">
      <div class="emoji">⏱️</div>
      <h3 id="timer-display">0:00</h3>
      <button class="timer-btn">Start</button>
    </div>`;
  
  const btn = el.querySelector(".timer-btn");
  const disp = el.querySelector("#timer-display");
  btn.onclick = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      btn.textContent = "Start";
    } else {
      timer = setInterval(() => {
        elapsed++;
        const m = Math.floor(elapsed / 60);
        const s = (elapsed % 60).toString().padStart(2, "0");
        disp.textContent = `${m}:${s}`;
      }, 1000);
      btn.textContent = "Stop";
    }
  };
  return el;
}

function createSceneTile({ title, emoji, sceneId }) {
  const el = document.createElement("div");
  el.className = "tile tile-medium";
  el.innerHTML = `
    <div class="tile-content">
      <div class="emoji">${emoji}</div>
      <h3>${title}</h3>
      <button class="run-btn">▶️ Run</button>
    </div>`;
  el.querySelector(".run-btn").onclick = () => {
    alert(`▶️ Running scene: ${title}`);
    console.log("[SCENE]", sceneId);
  };
  return el;
}

function createActionTile({ title, emoji, actionId }) {
  const el = document.createElement("div");
  el.className = "tile tile-medium";
  el.innerHTML = `
    <div class="tile-content">
      <div class="emoji">${emoji}</div>
      <h3>${title}</h3>
      <button class="action-btn">${emoji} Act</button>
    </div>`;
  el.querySelector(".action-btn").onclick = () => {
    alert(`🔔 Action executed: ${title}`);
    console.log("[ACTION]", actionId);
  };
  return el;
}

function createAddDeviceTile() {
  const el = document.createElement("div");
  el.className = "tile tile-add";
  el.innerHTML = `
    <div class="tile-content">
      <div class="emoji">➕</div>
      <h3>Add Device</h3>
      <button class="add-btn">➕ Add</button>
    </div>`;
  el.querySelector(".add-btn").onclick = openDeviceModal;
  return el;
}

function openDeviceModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Add New Device</h2>
      <label>Name:<input type="text" id="device-name" placeholder="Living Room Lamp"/></label>
      <label>Type:<select id="device-type"><option>Light</option><option>Fan</option><option>Thermostat</option><option>Speaker</option></select></label>
      <label>Room:<input type="text" id="device-room" placeholder="Room Name"/></label>
      <div class="modal-actions">
        <button id="confirm-add">✅ Add</button>
        <button id="cancel-add">❌ Cancel</button>
      </div>
    </div>`;
  
  document.body.append(modal);
  modal.querySelector("#cancel-add").onclick = () => modal.remove();
  modal.querySelector("#confirm-add").onclick = () => {
    const name = modal.querySelector("#device-name").value.trim();
    const type = modal.querySelector("#device-type").value;
    const room = modal.querySelector("#device-room").value.trim();
    if (!name || !room) return alert("Please fill in all fields.");
    alert(`📡 Added "${name}" (${type}) in ${room}`);
    console.log("[DEVICE ADDED]", { name, type, room });
    modal.remove();
  };
}
