alert("JS connected");

const routines = [
  ["Push-ups 30", "Bicep curl 40", "Tricep dips 20", "Study 30 min(4 blocks)"],
  ["Push-ups 30", "Bicep curl 40", "Tricep dips 20", "Study 30 min(4 blocks)"],
  ["Crunches (15×3)", "Leg Raise (12×3)", "Plank 30 sec (3 sets)", "Study 30 min(4 blocks)"],
  ["Crunches (15×3)", "Leg Raise (12×3)", "Plank 30 sec (3 sets)", "Study 30 min(4 blocks)"],
  ["Squats (15×3)", "Setp-Ups (10×3", "Calf Raises (20×3)", "Study 30 min(4 blocks)"],
  ["Squats (15×3)", "Setp-Ups (10×3", "Calf Raises (20×3)", "Study 30 min(4 blocks)"],
  ["Rest Today", "Study 30 min(5 blocks)"],
];

const today = new Date().toDateString();
let savedDate = localStorage.getItem("date");

if (savedDate !== today) {
  localStorage.setItem("date", today);
  localStorage.setItem("completed", JSON.stringify([]));
  localStorage.setItem("xp", "0");
}

const completed = JSON.parse(localStorage.getItem("completed")) || [];
let xp = parseInt(localStorage.getItem("xp")) || 0;

document.getElementById("xp").innerText = xp;

const dayIndex = new Date().getDay();
document.getElementById("dayText").innerText =
  "Day " + (dayIndex + 1) + " Routine";

const taskList = document.getElementById("taskList");

routines[dayIndex].forEach((task, index) => {
  const li = document.createElement("li");
  const btn = document.createElement("button");

  li.innerText = task;
  btn.innerText = completed.includes(index) ? "✔ DONE" : "DONE";

  if (completed.includes(index)) {
    btn.disabled = true;
  }

  btn.onclick = () => {
    completed.push(index);
    localStorage.setItem("completed", JSON.stringify(completed));
    xp += 10;
    localStorage.setItem("xp", xp.toString());
    location.reload();
  };

  li.appendChild(btn);
  taskList.appendChild(li);
});



function updateDateTime() {
  const now = new Date();

  const days = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const dayName = days[now.getDay()];
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  document.getElementById("realDay").innerText =
    "📅 " + dayName + " | " + date;

  document.getElementById("realTime").innerText =
    "⏰ " + time;
}

// first call
updateDateTime();

// update every second (real time)
setInterval(updateDateTime, 1000);



const daysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const todayIndex = new Date().getDay();

const dayStrip = document.getElementById("dayStrip");
dayStrip.innerHTML = "";

daysShort.forEach((day, index) => {
  const d = document.createElement("div");
  d.innerText = day;
  if (index === todayIndex) d.classList.add("active");
  dayStrip.appendChild(d);
});

// live time
function updateTime() {
  const now = new Date();
  document.getElementById("liveTime").innerText =
    "⏰ " + now.toLocaleTimeString();
}

updateTime();
setInterval(updateTime, 1000);
