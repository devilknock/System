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
  ["Rest", "Study: 30 mins (5 blocks)"],
  ["Push-Ups: 30", "Bicep Curls: 40", "Triceps Dips: 20", "Study: 30mins(4 Blocks)"],
  ["Push-Ups: 30", "Bicep Curls: 40", "Triceps Dips: 20", "Study: 30mins(4 Blocks)"],
  ["Crunches: (15×3)", "Leg Raise: (12×3)", "Planks: (30sec ×3)", "Study: 30mins(4Blocks)"],
  ["Crunches: (15×3)", "Leg Raise: (12×3)", "Planks: (30sec ×3)", "Study: 30mins(4Blocks)"],
  ["Squats: (15×3)", "Step-Ups: (10×3)", "Calf-Raises: (20×3)", "Study: 30mins (4Blocks)"],
  ["Squats: (15×3)", "Step-Ups: (10×3)", "Calf-Raises: (20×3)", "Study: 30mins (4Blocks)"],
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

  const taskText = document.createElement("span");
  taskText.innerText = task;

  const box = document.createElement("div");
  box.classList.add("check-box");

  if (completed.includes(index)) {
    box.style.display = "none";
    taskText.innerText = task + " ✔ COMPLETED";
  }

  box.onclick = () => {
    if (!completed.includes(index)) {
      completed.push(index);
      localStorage.setItem("completed", JSON.stringify(completed));

      xp += 10;
      localStorage.setItem("xp", xp);
      document.getElementById("xp").innerText = xp;
      updateLevelAndRank(xp);

      box.style.display = "none";
      taskText.innerText = task + " ✔ COMPLETED";
    }
  };

  li.appendChild(taskText);
  li.appendChild(box);
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
