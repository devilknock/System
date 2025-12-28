alert("JS connected");

// ================= ROUTINES =================
const routines = [
  ["Push-ups 30", "Bicep curl 40", "Tricep dips 20", "Study 30 min (4 blocks)"],
  ["Push-ups 30", "Bicep curl 40", "Tricep dips 20", "Study 30 min (4 blocks)"],
  ["Crunches (15×3)", "Leg Raise (12×3)", "Plank 30 sec (3 sets)", "Study 30 min (4 blocks)"],
  ["Crunches (15×3)", "Leg Raise (12×3)", "Plank 30 sec (3 sets)", "Study 30 min (4 blocks)"],
  ["Squats (15×3)", "Step-Ups (10×3)", "Calf Raises (20×3)", "Study 30 min (4 blocks)"],
  ["Squats (15×3)", "Step-Ups (10×3)", "Calf Raises (20×3)", "Study 30 min (4 blocks)"],
  ["Rest Day", "Study 30 min (5 blocks)"]
];

// ================= DAILY RESET =================
const today = new Date().toDateString();
const savedDate = localStorage.getItem("date");

if (savedDate !== today) {
  localStorage.setItem("date", today);
  localStorage.setItem("completed", JSON.stringify([]));
  localStorage.setItem("xp", "0");
}

// ================= XP & TASKS =================
let completed = JSON.parse(localStorage.getItem("completed")) || [];
let xp = parseInt(localStorage.getItem("xp")) || 0;

document.getElementById("xp").innerText = xp;

const dayIndex = new Date().getDay();
document.getElementById("dayText").innerText =
  "Day " + (dayIndex + 1) + " Routine";

const taskList = document.getElementById("taskList");

routines[dayIndex].forEach((task, index) => {
  const li = document.createElement("li");
  li.innerText = task;

  const btn = document.createElement("button");
  btn.innerText = completed.includes(index) ? "✔ DONE" : "DONE";

  if (completed.includes(index)) btn.disabled = true;

  btn.onclick = () => {
    if (!completed.includes(index)) {
      completed.push(index);
      xp += 10;

      localStorage.setItem("completed", JSON.stringify(completed));
      localStorage.setItem("xp", xp.toString());
      location.reload();
    }
  };

  li.appendChild(btn);
  taskList.appendChild(li);
});

// ================= STREAK SYSTEM =================
let currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
let highestStreak = parseInt(localStorage.getItem("highestStreak")) || 0;
let lastActiveDate = localStorage.getItem("lastActiveDate");

const todayDate = new Date().toDateString();

if (!lastActiveDate) {
  // First time user
  currentStreak = 1;
} else {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastActiveDate === yesterday.toDateString()) {
    // Continued streak
    currentStreak += 1;
  } else if (lastActiveDate !== todayDate) {
    // Missed day
    currentStreak = 1;
  }
}

// Update highest streak
if (currentStreak > highestStreak) {
  highestStreak = currentStreak;
}

// Save
localStorage.setItem("currentStreak", currentStreak);
localStorage.setItem("highestStreak", highestStreak);
localStorage.setItem("lastActiveDate", todayDate);

// UI update
document.getElementById("currentStreak").innerText = currentStreak;
document.getElementById("highestStreak").innerText = highestStreak;

// ================= DATE & TIME =================
function updateDateTime() {
  const now = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  document.getElementById("realDay").innerText =
    "📅 " + days[now.getDay()] + " | " + now.toLocaleDateString("en-IN");

  document.getElementById("realTime").innerText =
    "⏰ " + now.toLocaleTimeString();
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ================= DAY STRIP =================
const daysShort = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const dayStrip = document.getElementById("dayStrip");

daysShort.forEach((day, index) => {
  const d = document.createElement("div");
  d.innerText = day;
  if (index === dayIndex) d.classList.add("active");
  dayStrip.appendChild(d);
});
