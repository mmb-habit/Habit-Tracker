// ✅ Definimos el avatar solo UNA vez
const avatar = { nombre: "Mel", vidas: 5, energia: 100, oxidative: 0 };
let runProgress = 0;

// 🗓️ Almacenar hábitos completados por día
let dailySummary = {};

// 📅 Datos para el calendario
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let currentMonthIndex = 1;

// ✅ Crear checkboxes para todos los hábitos
function createCheckboxes() {
  const habits = [
    "sleep", "meditation", "eat", "workout", "study", "learn", "money", "biohacking", "work",
    "sleepLess", "foodPorn", "socialMedia", "tv", "negativeThoughts"
  ];

  habits.forEach(habit => {
    const container = document.getElementById(habit);
    for (let i = 0; i < 7; i++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("change", () => updateHabit(habit, checkbox));
      container.appendChild(checkbox);
    }
  });
}

// ✅ Actualizar energía, vidas y registrar hábitos
function updateHabit(habit, checkbox) {
  const energyChange = 25;
  const oxidativeChange = 10;
  const today = new Date();
  const key = `${months[today.getMonth()]}-${today.getDate()}`;

  if (!dailySummary[key]) {
    dailySummary[key] = { good: [], bad: [] };
  }

  const badHabits = ["sleepLess", "foodPorn", "socialMedia", "tv", "negativeThoughts"];
  const category = badHabits.includes(habit) ? "bad" : "good";
  const habitName = habit.replace(/([A-Z])/g, ' $1').trim();

  if (checkbox.checked) {
    dailySummary[key][category].push(habitName);
    if (category === "bad") {
      avatar.energia = Math.max(0, avatar.energia - energyChange);
      avatar.oxidative = Math.min(100, avatar.oxidative + oxidativeChange);
    } else {
      avatar.energia = Math.min(100, avatar.energia + energyChange);
    }
  } else {
    dailySummary[key][category] = dailySummary[key][category].filter(h => h !== habitName);
    if (category === "bad") {
      avatar.energia = Math.min(100, avatar.energia + energyChange);
      avatar.oxidative = Math.max(0, avatar.oxidative - oxidativeChange);
    } else {
      avatar.energia = Math.max(0, avatar.energia - energyChange);
    }
  }

  // Control de vidas
  checkLifeStatus();

  // Actualizar UI
  updateUI();
}

// ✅ Control de vidas y límites
function checkLifeStatus() {
  if (avatar.energia <= 0) {
    avatar.vidas = Math.max(0, avatar.vidas - 1);
    avatar.energia = 0;
    alert("⚠️ Has perdido una vida por falta de energía.");
  }

  if (avatar.oxidative >= 100) {
    avatar.vidas = Math.max(0, avatar.vidas - 1);
    avatar.oxidative = 0;
    alert("⚠️ Has perdido una vida por exceso de estrés.");
  }
}

// ✅ Actualizar UI
function updateUI() {
  document.getElementById("lives").innerText = avatar.vidas;
  document.getElementById("energy").innerText = avatar.energia;
  document.getElementById("stress").innerText = avatar.oxidative;

  updateAvatarMood();
}

// 🏃‍♂️ Carrera de 20 km
function addRun() {
  runProgress++;
  document.getElementById("run-progress").value = runProgress;

  if (runProgress >= 20) {
    avatar.vidas = Math.min(5, avatar.vidas + 1);
    runProgress = 0;
    alert("🎉 ¡Has recuperado una vida!");
  }

  updateAvatarMood();
}

// ✅ Crear calendario con resumen al hacer clic
function createCalendar(monthIndex) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  document.getElementById("current-month").innerText = months[monthIndex];

  for (let day = 1; day <= daysInMonth[monthIndex]; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.innerText = day;

    dayDiv.addEventListener("click", () => showSummary(monthIndex, day));
    calendar.appendChild(dayDiv);
  }
}


// 📅 Navegar entre meses
function prevMonth() {
  if (currentMonthIndex > 0) {
    currentMonthIndex--;
    createCalendar(currentMonthIndex);
  }
}

function nextMonth() {
  if (currentMonthIndex < 11) {
    currentMonthIndex++;
    createCalendar(currentMonthIndex);
  }
}
// ✅ Crear calendario con el día actual resaltado
function createCalendar(monthIndex) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  document.getElementById("current-month").innerText = months[monthIndex];

  for (let day = 1; day <= daysInMonth[monthIndex]; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.innerText = day;

    // Resaltar el día actual
    if (day === currentDay && monthIndex === currentMonth && today.getFullYear() === currentYear) {
      dayDiv.classList.add("today"); // Agrega clase 'today' al día actual
    }

    // Evento: Marcar el día como "finalizado" y mostrar resumen
    dayDiv.addEventListener("click", () => {
      if (dayDiv.classList.contains("completed")) {
        dayDiv.classList.remove("completed"); // Quitar "finalizado"
      } else {
        dayDiv.classList.add("completed"); // Marcar como "finalizado"
        showSummary(monthIndex, day); // Mostrar resumen del día
      }
    });

    calendar.appendChild(dayDiv);
  }
}

// 📊 Mostrar resumen de hábitos del día seleccionado
function showSummary(monthIndex, day) {
  const key = `${months[monthIndex]}-${day}`;
  const summary = dailySummary[key] || { good: [], bad: [] };

  let message = `📅 Resumen del ${day} de ${months[monthIndex]}:\n\n`;
  message += "✅ Buenos hábitos completados:\n";
  message += summary.good.length > 0 ? summary.good.join("\n") : "Ninguno";
  message += "\n\n❌ Malos hábitos completados:\n";
  message += summary.bad.length > 0 ? summary.bad.join("\n") : "Ninguno";

  alert(message);
}

// ✅ Crear checkboxes para Oxidative Stress
function createOxidativeStressCheckboxes() {
  const categories = [
    "Financial Problems", "Health Inconvenients", "Family Noun Unexpected",
    "Friends to Solve", "Work Pressure"
  ];

  categories.forEach(category => {
    const container = document.getElementById(category);
    for (let i = 0; i < 7; i++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("red-checkbox");
      checkbox.addEventListener("change", () => updateOxidativeStress(checkbox));
      container.appendChild(checkbox);
    }
  });
}

// ✅ Lógica para actualizar el estrés oxidativo
function updateOxidativeStress(checkbox) {
  const stressChange = 15;

  if (checkbox.checked) {
    avatar.oxidative = Math.min(100, avatar.oxidative + stressChange);
  } else {
    avatar.oxidative = Math.max(0, avatar.oxidative - stressChange);
  }

  // Perder vida si el estrés llega a 100
  if (avatar.oxidative >= 100) {
    avatar.vidas--;
    avatar.oxidative = 0;
    alert("⚠️ Has perdido una vida por exceso de estrés oxidativo.");
  }

  // Actualizar la visualización
  document.getElementById("stress").innerText = avatar.oxidative;
  document.getElementById("lives").innerText = avatar.vidas;

  updateAvatarMood();
}

// 🔄 Cambiar la expresión del avatar según la energía
function updateAvatarMood() {
  const avatarImage = document.getElementById("avatar-image");

  if (avatar.energia > 70) {
    avatarImage.src = "happy.png";
    avatarImage.className = "energetic";
  } else if (avatar.energia > 40) {
    avatarImage.src = "neutral.png";
    avatarImage.className = "";
  } else {
    avatarImage.src = "sad.png";
    avatarImage.className = "tired";
  }
}
function createOxidativeStressCheckboxes() {
  const categories = [
    "Financial Problems", "Health Inconvenients", "Family Noun Unexpected",
    "Friends to Solve", "Work Pressure"
  ];

  categories.forEach(category => {
    const container = document.getElementById(category);
    for (let i = 0; i < 7; i++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("red-checkbox"); // Clase específica para casillas rojas
      checkbox.addEventListener("change", () => updateOxidativeStress(checkbox));
      container.appendChild(checkbox);
    }
  });
}

// Inicializar todo al cargar
createCheckboxes(); // Para Good y Bad Habits
createCalendar(currentMonthIndex);
createOxidativeStressCheckboxes(); // Para Oxidative Stress
updateAvatarMood();

