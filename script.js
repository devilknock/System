console.log("SystemX Loaded");

// ================= HELPERS =================
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// ================= DAYS =================
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const dayIndex = new Date().getDay();

// ================= ROUTINES (CALENDAR BASED) =================
const routines = [
  ["Rest", "Study: 30 mins (5 Blocks)"], // Sunday
  ["Push-Ups: 30", "Bicep Curls: 40", "Triceps Dips: 20", "Study: 30 mins (4 Blocks)"], // Monday
  ["Push-Ups: 30", "Bicep Curls: 40", "Triceps Dips: 20", "Study: 30 mins (4 Blocks)"], // Tuesday
  ["Crunches: (15×3)", "Leg Raise: (12×3)", "Plank: (30s×3)", "Study: 30 mins (4 Blocks)"], // Wednesday
  ["Crunches: (15×3)", "Leg Raise: (12×3)", "Plank: (30s×3)", "Study: 30 mins (4 Blocks)"], // Thursday
  ["Squats: (15×3)", "Step-Ups: (10×3)", "Calf Raises: (20×3)", "Study: 30 mins (4 Blocks)"], // Friday
  ["Squats: (15×3)", "Step-Ups: (10×3)", "Calf Raises: (20×3)", "Study: 30 mins (4 Blocks)"] // Saturday
];

// ================= DAILY QUEST TEXT =================
document.getElementById("dayText").innerText =
  days[dayIndex] + " Daily Quest";

// ================= DAILY RESET =================
const today = getTodayDate();
const savedDate = localStorage.getItem("date");

if (savedDate !== today) {
  localStorage.setItem("date", today);
  localStorage.setItem("completed", JSON.stringify([]));
  localStorage.setItem("xp", "0");
}

// ================= XP / LEVEL / RANK =================
let completed = JSON.parse(localStorage.getItem("completed")) || [];
let xp = parseInt(localStorage.getItem("xp")) || 0;

document.getElementById("xp").innerText = xp;

function updateLevelAndRank(xp) {
  const xpPerLevel = 250;
  const levelsPerRank = 10;
  const ranks = ["E","D","C","B","A","S"];

  let level = Math.floor(xp / xpPerLevel) + 1;
  let rankIndex = Math.floor((level - 1) / levelsPerRank);

  document.getElementById("level").innerText = level;
  document.getElementById("rank").innerText =
    ranks[Math.min(rankIndex, ranks.length - 1)];
}
updateLevelAndRank(xp);

// ================= TASK LIST =================
const taskList = document.getElementById("taskList");
taskList.innerHTML = "";

routines[dayIndex].forEach((task, index) => {
  const li = document.createElement("li");

  const text = document.createElement("span");
  text.innerText = task;

  const box = document.createElement("div");
  box.className = "check-box";

  if (completed.includes(index)) {
    box.style.display = "none";
    text.innerText = task + " ✔ COMPLETED";
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
      text.innerText = task + " ✔ COMPLETED";

      checkStreak();
    }
  };

  li.appendChild(text);
  li.appendChild(box);
  taskList.appendChild(li);
});

// ================= STREAK SYSTEM =================
function checkStreak() {
  if (completed.length === routines[dayIndex].length) {
    const today = getTodayDate();
    const last = localStorage.getItem("lastStreakDate");

    if (last !== today) {
      let streak = parseInt(localStorage.getItem("currentStreak")) || 0;
      let highest = parseInt(localStorage.getItem("highestStreak")) || 0;

      streak++;
      if (streak > highest) highest = streak;

      localStorage.setItem("currentStreak", streak);
      localStorage.setItem("highestStreak", highest);
      localStorage.setItem("lastStreakDate", today);

      document.getElementById("currentStreak").innerText = streak;
      document.getElementById("highestStreak").innerText = highest;
    }
  }
}

document.getElementById("currentStreak").innerText =
  localStorage.getItem("currentStreak") || 0;
document.getElementById("highestStreak").innerText =
  localStorage.getItem("highestStreak") || 0;

// ================= TIME =================
function updateTime() {
  const now = new Date();
  document.getElementById("realDay").innerText =
    "📅 " + days[now.getDay()] + " | " + now.toLocaleDateString();
  document.getElementById("realTime").innerText =
    "⏰ " + now.toLocaleTimeString();
}
updateTime();
setInterval(updateTime, 1000);

// ================= DAY STRIP =================
const strip = document.getElementById("dayStrip");
days.forEach((d,i)=>{
  const el = document.createElement("div");
  el.innerText = d.slice(0,3).toUpperCase();
  if(i === dayIndex) el.classList.add("active");
  strip.appendChild(el);
});
