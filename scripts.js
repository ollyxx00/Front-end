document.addEventListener("DOMContentLoaded", () => {
  // --- Dark Mode Persistence ---
  const body = document.body;
  const modeToggle = document.getElementById("darkModeToggle");
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "on") body.classList.add("dark");

  modeToggle.onclick = () => {
    body.classList.toggle("dark");
    localStorage.setItem("darkMode", body.classList.contains("dark") ? "on" : "off");
  };

  // --- Weather Fetch & UI ---
  const iconEl = document.getElementById("weatherIcon");
  const tempEl = document.getElementById("weatherTemp");
  const condEl = document.getElementById("weatherCondition");
  const loadingEls = [iconEl, tempEl, condEl];

  loadingEls.forEach(el => el.classList.add("loading"));
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=Liverpool&units=metric&appid=22de135cb5b175370f615c9b31eb40b5`)
    .then(r => r.json())
    .then(data => {
      iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      iconEl.alt = data.weather[0].description;
      tempEl.textContent = `${Math.round(data.main.temp)}°C`;
      condEl.textContent = data.weather[0].description;
      loadingEls.forEach(el => el.classList.remove("loading"));
    }).catch(err => {
      console.error(err);
      condEl.textContent = "Error loading weather";
      loadingEls.forEach(el => el.classList.remove("loading"));
    });

  // --- Device Controls Simulation ---
  ["dimmer", "fan"].forEach(id => {
    document.getElementById(id).addEventListener("input", e => {
      console.log(`[CTRL] ${id} set to ${e.target.value}`);
      // Future: send to MQTT / WebSocket
    });
  });

  // --- Scenes & Actions ---
  function handleAction(name) {
    alert(`✔️ Triggered: ${name}`);
    console.log(`[ACTION] ${name}`);
    // Future: real backend call
  }
  document.querySelectorAll(".run-btn").forEach(btn =>
    btn.onclick = () => handleAction(`Scene: ${btn.dataset.scene}`));
  document.querySelectorAll(".action-btn").forEach(btn =>
    btn.onclick = () => handleAction(`Action: ${btn.textContent.trim()}`));

  // --- Nav Active State Set ---
  const path = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-link").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
});