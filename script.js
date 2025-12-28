console.log("JS connected");

// ================= STREAK SYSTEM =================
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function updateStreak() {
  let currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
  let highestStreak = parseInt(localStorage.getItem("highestStreak")) || 0;
  let lastDate = localStorage.getItem("lastActiveDate");

  const today = getTodayDate();

  if (!lastDate) {
    currentStreak = 1;
  } else {
    const diff = (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24);

    if (diff === 1) currentStreak++;
    else if (diff > 1) currentStreak = 1;
  }

  if (currentStreak > highestStreak) highestStreak = currentStreak;

  localStorage.setItem("currentStreak", currentStreak);
  localStorage.setItem("highestStreak", highestStreak);
  localStorage.setItem("lastActiveDate", today);

  document.getElementById("currentStreak").innerText = currentStreak;
  document.getElementById("highestStreak").innerText = highestStreak;
}

updateStreak();

// ================= ROUTINE SYSTEM =================
const routines = [
  ["Push-ups 30", "Bicep curl 40", "Tricep dips 20", "Study 30 min (4 blocks)"],
  ["Push-ups 30", "Bicep curl 40", "Tricep dips 20", "Study 30 min (4 blocks)"],
  ["Crunches (15×3)", "Leg Raise (12×3)", "Plank 30 sec (3 sets)", "Study 30 min (4 blocks)"],
  ["Crunches (15×3)", "Leg Raise (12×3)", "Plank 30 sec (3 sets)", "Study 30 min (4 blocks)"],
  ["Squats (15×3)", "Step-Ups (10×3)", "Calf Raises (20×3)", "Study 30 min (4 blocks)"],
  ["Squats (15×3)", "Step-Ups (10×3)", "Calf Raises (20×3)", "Study 30 min (4 blocks)"],
  ["Rest Today", "Study 30 min (5 blocks)"],
];

const today = new Date().toDateString();
let savedDate = localStorage.getItem("date") || today;

if (savedDate !== today) {
  localStorage.setItem("date", today);
  localStorage.setItem("completed", JSON.stringify([]));
  localStorage.setItem("xp", "0");
}

// ================= PENALTY SYSTEM =================
const penaltyAppliedDate = localStorage.getItem("penaltyDate");
const yesterdayTasks = JSON.parse(localStorage.getItem("completed")) || [];

if (savedDate !== today && penaltyAppliedDate !== savedDate) {
  const yesterdayIndex = new Date(savedDate).getDay();
  const totalTasks = routines[yesterdayIndex]?.length || 0;

  if (yesterdayTasks.length < totalTasks) {
    // APPLY PENALTY
    localStorage.setItem("xp", "0");
    localStorage.setItem("currentStreak", "0");
    localStorage.setItem("penaltyDate", savedDate);

    document.getElementById("penaltyMsg").classList.remove("hidden");
  }
}

let completed = JSON.parse(localStorage.getItem("completed")) || [];
let xp = parseInt(localStorage.getItem("xp")) || 0;

document.getElementById("xp").innerText = xp;

function updateLevelAndRank(xp) {
  const xpPerLevel = 250; // 1 level = 250 XP
  const levelsPerRank = 10; // 10 levels = 1 rank

  let level = Math.floor(xp / xpPerLevel) + 1;
  let rankIndex = Math.floor((level - 1) / levelsPerRank);

  const ranks = ["E", "D", "C", "B", "A", "S"];
  let rank = ranks[Math.min(rankIndex, ranks.length - 1)];

  document.getElementById("level").innerText = level;
  document.getElementById("rank").innerText = rank;
}

// Initial call
updateLevelAndRank(xp);

const dayIndex = new Date().getDay();
document.getElementById("dayText").innerText =
  "Day " + (dayIndex + 1) + " Routine";

const taskList = document.getElementById("taskList");
taskList.innerHTML = "";

routines[dayIndex].forEach((task, index) => {
  const li = document.createElement("li");
  li.innerText = task;

  const btn = document.createElement("button");
  btn.innerText = completed.includes(index) ? "✔ DONE" : "DONE";

  if (completed.includes(index)) btn.disabled = true;

  btn.onclick = () => {
    if (!completed.includes(index)) {
      completed.push(index);
      localStorage.setItem("completed", JSON.stringify(completed));

      xp += 10;
      localStorage.setItem("xp", xp);
      document.getElementById("xp").innerText = xp;

      updateLevelAndRank(xp);

      btn.innerText = "✔ DONE";
      btn.disabled = true;
    }
  };

  li.appendChild(btn);
  taskList.appendChild(li);
});

// ================= TIME + DAY =================
function updateDateTime() {
  const now = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  document.getElementById("realDay").innerText =
    "📅 " + days[now.getDay()] + " | " + now.toLocaleDateString();

  document.getElementById("realTime").innerText =
    "⏰ " + now.toLocaleTimeString();
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ================= DAY STRIP =================
const daysShort = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const todayIndex = new Date().getDay();
const dayStrip = document.getElementById("dayStrip");

daysShort.forEach((day, index) => {
  const d = document.createElement("div");
  d.innerText = day;
  if (index === todayIndex) d.classList.add("active");
  dayStrip.appendChild(d);
});
