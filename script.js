const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const dayIndex = new Date().getDay();

const routines = [
  ["Rest Day", "Review Weekly Progress"],
  ["Push-Ups: 30", "Bicep Curls: 40", "Triceps Dips: 20", "Study: 30 mins"],
  ["Push-Ups: 30", "Bicep Curls: 40", "Triceps Dips: 20", "Study: 30 mins"],
  ["Crunches: (15×3)", "Leg Raise: (12×3)", "Plank: (30s×3)", "Study: 30 mins"],
  ["Crunches: (15×3)", "Leg Raise: (12×3)", "Plank: (30s×3)", "Study: 30 mins"],
  ["Squats: (15×3)", "Step-Ups: (10×3)", "Calf Raises: (20×3)", "Study: 30 mins"],
  ["Squats: (15×3)", "Step-Ups: (10×3)", "Calf Raises: (20×3)", "Study: 30 mins"]
];

let xp = parseInt(localStorage.getItem("xp")) || 0;
let completed = JSON.parse(localStorage.getItem("completed")) || [];

function updateUI() {
    const xpPerLevel = 250;
    let level = Math.floor(xp / xpPerLevel) + 1;
    let prog = xp % xpPerLevel;
    
    document.getElementById("xp").innerText = prog;
    document.getElementById("level").innerText = level;
    document.getElementById("rank").innerText = level > 10 ? "D" : "E";
    document.getElementById("progressBar").style.width = (prog / xpPerLevel * 100) + "%";
    
    document.getElementById("currentStreak").innerText = localStorage.getItem("currentStreak") || 0;
    document.getElementById("highestStreak").innerText = localStorage.getItem("highestStreak") || 0;
}

// Day Strip with Dates
const strip = document.getElementById("dayStrip");
const todayNum = new Date().getDate();

days.forEach((d, i) => {
    const el = document.createElement("div");
    const diff = i - dayIndex;
    const dateNum = todayNum + diff;
    el.innerHTML = `<strong>${d}</strong><br>${dateNum}`;
    if(i === dayIndex) el.classList.add("active");
    strip.appendChild(el);
});

// Render Tasks
const taskList = document.getElementById("taskList");
routines[dayIndex].forEach((task, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = task;
    const box = document.createElement("div");
    box.className = "check-box";

    if (completed.includes(index)) {
        li.style.borderColor = "#222"; // Dull border for completed
        li.style.boxShadow = "none";
        box.style.display = "none";
        span.innerText += " ✔";
        span.className = "completed-text";
    }

    box.onclick = () => {
        if (!completed.includes(index)) {
            completed.push(index);
            localStorage.setItem("completed", JSON.stringify(completed));
            xp += 10;
            localStorage.setItem("xp", xp);
            
            // Check if all tasks done for streak
            if(completed.length === routines[dayIndex].length) {
                let s = parseInt(localStorage.getItem("currentStreak")) || 0;
                let h = parseInt(localStorage.getItem("highestStreak")) || 0;
                s++;
                if(s > h) localStorage.setItem("highestStreak", s);
                localStorage.setItem("currentStreak", s);
            }
            location.reload(); 
        }
    };
    li.append(span, box);
    taskList.appendChild(li);
});

updateUI();
