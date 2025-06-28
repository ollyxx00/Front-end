document.addEventListener("DOMContentLoaded", () => {
  // Dark mode
  const btn = document.getElementById("darkModeToggle");
  btn.onclick = () => document.body.classList.toggle("dark");

  // Weather fetch
  const iconEl = document.getElementById("weatherIcon");
  const tempEl = document.getElementById("weatherTemp");
  const condEl = document.getElementById("weatherCondition");
  fetch("https://api.openweathermap.org/data/2.5/weather?q=Liverpool&units=metric&appid=YOUR_API_KEY")
    .then(r => r.json())
    .then(data => {
      iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      iconEl.alt = data.weather[0].description;
      tempEl.textContent = `${Math.round(data.main.temp)}°C`;
      condEl.textContent = data.weather[0].description;
    })
    .catch(console.error);

  // Control handling
  const controls = [
    { id: "dimmer", topic: "hue/bulb", unit: "%" },
    { id: "fan", topic: "dyson/fan", unit: "level" }
  ];
  controls.forEach(c => {
    const el = document.getElementById(c.id);
    el.oninput = () => {
      console.log(`Set ${c.topic} to ${el.value}${c.unit}`);
    };
  });

  // Scene and quick-action handlers
  document.querySelectorAll(".run-btn").forEach(btn => {
    btn.onclick = () => alert(`Running scene: ${btn.dataset.scene}`);
  });
  document.querySelectorAll(".quick-actions button").forEach(b => {
    b.onclick = () => console.log(`Action: ${b.dataset.action}`);
  });

  // Dropdown accessibility
  const drop = document.querySelector(".dropdown");
  const dbtn = drop.querySelector(".dropbtn");
  const menu = drop.querySelector(".dropdown-content");
  dbtn.onclick = () => {
    const expanded = dbtn.getAttribute("aria-expanded") === "true" ? "false" : "true";
    dbtn.setAttribute("aria-expanded", expanded);
    menu.style.display = expanded === "true" ? "block" : "none";
  };
});