document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const dmBtn = document.getElementById("darkModeToggle");
  if (localStorage.getItem("darkMode") === "on") body.classList.add("dark");
  dmBtn.onclick = () => {
    const on = body.classList.toggle("dark");
    localStorage.setItem("darkMode", on ? "on" : "off");
  };

  const dashboard = document.getElementById("dashboard");

  dashboard.append(
    createMediaTile({ title: "Music & Co", playlist: "Get Up and Go" }),
    createSliderTile({ title: "Lamp", emoji: "💡", unit: "%", topic: "lamp/brightness", initial: 80 }),
    createWeatherTile({ city: "Liverpool" }),
    createTimerTile(),
    createSceneTile({ title: "Movie Night", emoji: "📺", sceneId: "movie" }),
    createActionTile({ title: "Lock Doors", emoji: "🔒", actionId: "lockDoors" }),
    createAddDeviceTile()
  );
});

function createMediaTile({ title, playlist }) {
  const div = document.createElement("div");
  div.className = "tile tile-large";
  div.innerHTML = `
    <div class="tile-content">
      <div class="emoji">🎵</div>
      <h3>${title}</h3>
      <p>⏯️ ${playlist}</p>
      <div class="tile-overlay-button">
        <button class="overlay-btn">▶️</button>
      </div>
    </div>`;
  div.querySelector(".overlay-btn").onclick = () => {
    alert(`🎶 Playing playlist: ${playlist}`);
    console.log("[MEDIA PLAY]", playlist);
  };
  return div;
}

function createSliderTile({ title, emoji, unit, topic, initial }) {
  const div = document.createElement("div");
  div.className = "tile tile-small";
  div.innerHTML = `
    <div class="tile-content">
      <div class="emoji">${emoji}</div>
      <h3>${title}</h3>
      <p><span id="lbl-${topic}">${initial}${unit}</span></p>
      <input type="range" id="rng-${topic}" min="0" max="100" value="${initial}">
    </div>`;
  const slider = div.querySelector(`#rng-${topic}`);
  const label = div.querySelector(`#lbl-${topic}`);
  slider.oninput = e => {
    label.textContent = `${e.target.value}${unit}`;
    console.log(`[SLIDER] ${topic}: ${e.target.value}${unit}`);
  };
  return div;
}

function createWeatherTile({ city }) {
  const div = document.createElement("div");
  div.className = "tile tile-small";
  div.innerHTML = `
    <div class="tile-content">
      <div class="emoji">🌤️</div>
      <h3 id="weather-temp">--°C</h3>
      <p id="weather-cond">--</p>
    </div>`;
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=22de135cb5b175370f615c9b31eb40b5`)
    .then(r => r.json())
    .then(d => {
      div.querySelector("#weather-temp").textContent = `${Math.round(d.main.temp)}°C`;
      div.querySelector("#weather-cond").textContent = d.weather[0].description;
    })
    .catch(console.error);
  return div;
}

function createTimerTile() {
  let elapsed = 0, interval = null;
  const div = document.createElement("div");
  div.className = "tile tile-small";
  div.innerHTML = `
    <div class="tile-content">
      <div class="emoji">⏱️</div>
      <h3 id="timer-display">0:00</h3>
      <button class="timer-btn">Start</button>
    </div>`;
  const btn = div.querySelector(".timer-btn");
  const disp = div.querySelector("#timer-display");
  btn.onclick = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
      btn.textContent = "Start";
    } else {
      interval = setInterval(() => {
        elapsed++;
        const m = Math.floor(elapsed / 60);
        const s = (elapsed % 60).toString().padStart(2, "0");
        disp.textContent = `${m}:${s}`;
      }, 1000);
      btn.textContent = "Stop";
    }
  };
  return div;
}

function createSceneTile({ title, emoji, sceneId }) {
  const div = document.createElement("div");
  div.className = "tile tile-medium";
  div.innerHTML = `
    <div class="tile-content">
      <div class="emoji">${emoji}</div>
      <h3>${title}</h3>
      <button class="run-btn">▶️ Run</button>
    </div>`;
  div.querySelector(".run-btn").onclick = () => {
    alert(`▶️ Running scene: ${title}`);
    console.log("[SCENE]", sceneId);
  };
  return div;
}

function createActionTile({ title, emoji, actionId }) {
  const div = document.createElement("div");
  div.className = "tile tile-medium";
  div.innerHTML = `
    <div class="tile-content">
      <div class="emoji">${emoji}</div>
      <h3>${title}</h3>
      <button class="action-btn">${emoji} Act</button>
    </div>`;
  div.querySelector(".action-btn").onclick = () => {
    alert(`🔔 Action executed: ${title}`);
    console.log("[ACTION]", actionId);
  };
  return div;
}

function createAddDeviceTile() {
  const div = document.createElement("div");
  div.className = "tile tile-add";
  div.innerHTML = `
    <div class="tile-content">
      <div class="emoji">➕</div>
      <h3>Add Device</h3>
      <button class="add-btn">➕ Add</button>
    </div>`;
  div.querySelector(".add-btn").onclick = openDeviceModal;
  return div;
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
  document.getElementById("cancel-add").onclick = () => modal.remove();
  document.getElementById("confirm-add").onclick = () => {
    const name = modal.querySelector("#device-name").value.trim();
    const type = modal.querySelector("#device-type").value;
    const room = modal.querySelector("#device-room").value.trim();
    if (!name || !room) return alert("Please fill in all fields.");
    alert(`📡 Added "${name}" (${type}) in ${room}`);
    console.log("[DEVICE ADDED]", { name, type, room });
    modal.remove();
  };
}
// This code creates a simple home automation dashboard with tiles for media, weather, timers, scenes, and actions.