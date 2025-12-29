const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const now = new Date();
const dayIndex = now.getDay();
const todayStr = now.toDateString();

// Data & Reset Logic
if (localStorage.getItem("last_date") !== todayStr) {
    localStorage.setItem("last_date", todayStr);
    localStorage.setItem("completed", JSON.stringify([]));
}

let xp = parseInt(localStorage.getItem("xp")) || 0;
let str = parseInt(localStorage.getItem("statStr")) || 0;
let intel = parseInt(localStorage.getItem("statInt")) || 0;
let totalQuests = parseInt(localStorage.getItem("totalQuests")) || 0;
let completed = JSON.parse(localStorage.getItem("completed")) || [];

// Navigation
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(pageId).classList.remove('hidden');
    
    if(pageId === 'questPage') document.getElementById('navQuest').classList.add('active');
    else if(pageId === 'timerPage') document.getElementById('navTimer').classList.add('active');
    else document.getElementById('navProfile').classList.add('active');
    updateUI();
}

// Popups
function showPopup(text) {
    const overlay = document.getElementById("systemOverlay");
    document.getElementById("systemNotice").innerText = text;
    overlay.classList.remove("hidden");
    overlay.onclick = () => overlay.classList.add("hidden");
}

// Timer Logic
let timerInterval, timeLeft, isRunning = false, totalTime;

function setPreset(min) {
    if(isRunning) stopTimer();
    document.getElementById("customMin").value = min;
    updateTimerDisplay(min * 60);
}

function updateTimerDisplay(sec) {
    let m = Math.floor(sec / 60), s = sec % 60;
    document.getElementById("countdownDisplay").innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    const percent = (sec / totalTime) * 100;
    document.getElementById("powerFill").style.width = isNaN(percent) ? "100%" : percent + "%";
}

function toggleTimer() {
    const btn = document.getElementById("initiateBtn");
    if (!isRunning) {
        let mins = document.getElementById("customMin").value;
        timeLeft = mins * 60; totalTime = timeLeft;
        isRunning = true;
        btn.innerText = "ABORT"; btn.style.background = "#ff4444"; btn.style.color = "#fff";
        document.getElementById("syncStatus").innerText = "ACTIVE";
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                btn.innerText = "ENGAGE"; btn.style.background = "#fff"; btn.style.color = "#000";
                showPopup("FOCUS PROTOCOL SUCCESSFUL. +10 INTEL GAINED.");
                intel += 10; localStorage.setItem("statInt", intel);
                updateUI();
            }
        }, 1000);
    } else { stopTimer(); }
}

function stopTimer() {
    clearInterval(timerInterval); isRunning = false;
    const btn = document.getElementById("initiateBtn");
    btn.innerText = "ENGAGE"; btn.style.background = "#fff"; btn.style.color = "#000";
    document.getElementById("syncStatus").innerText = "IDLE";
}

// UI & Quests
function updateUI() {
    let lvl = Math.floor(xp / 250) + 1, prog = xp % 250;
    document.getElementById("xp").innerText = prog;
    document.getElementById("level").innerText = lvl;
    document.getElementById("rank").innerText = lvl > 10 ? "D" : "E";
    document.getElementById("progressBar").style.width = (prog / 250 * 100) + "%";
    document.getElementById("currentStreak").innerText = localStorage.getItem("currentStreak") || 0;
    document.getElementById("highestStreak").innerText = localStorage.getItem("highestStreak") || 0;
    
    document.getElementById("statStr").innerText = str;
    document.getElementById("statInt").innerText = intel;
    document.getElementById("totalXpDisplay").innerText = xp;
    document.getElementById("questsDone").innerText = totalQuests;
    document.getElementById("playerRankDisplay").innerText = `Hunter [Rank ${lvl > 10 ? 'D' : 'E'}]`;
}

// Day Strip & Tasks
const strip = document.getElementById("dayStrip");
days.forEach((d, i) => {
    const el = document.createElement("div");
    el.innerHTML = `<strong>${d}</strong><br>${now.getDate() + (i - dayIndex)}`;
    if(i === dayIndex) el.classList.add("active");
    strip.appendChild(el);
});

const routine = [
    ["Rest Day", "Review Progress"], ["Push-Ups: 30", "Bicep Curls: 40", "Study: 30 mins"],
    ["Push-Ups: 30", "Bicep Curls: 40", "Study: 30 mins"], ["Crunches: 15x3", "Plank: 30sx3", "Study: 30 mins"],
    ["Crunches: 15x3", "Plank: 30sx3", "Study: 30 mins"], ["Squats: 15x3", "Step-Ups: 10x3", "Study: 30 mins"],
    ["Squats: 15x3", "Step-Ups: 10x3", "Study: 30 mins"]
][dayIndex];

const taskList = document.getElementById("taskList");
routine.forEach((task, index) => {
    const li = document.createElement("li");
    const isDone = completed.includes(index);
    if(isDone) li.classList.add("completed-item");
    li.innerHTML = `<span>${task} ${isDone ? '✔' : ''}</span>`;
    const box = document.createElement("div");
    box.className = "check-box";
    if(isDone) box.style.display = "none";

    box.onclick = () => {
        completed.push(index);
        localStorage.setItem("completed", JSON.stringify(completed));
        if(task.toLowerCase().includes("study")) intel += 5; else str += 5;
        xp += 10;
        localStorage.setItem("statStr", str); localStorage.setItem("statInt", intel); localStorage.setItem("xp", xp);

        if(completed.length === routine.length) {
            totalQuests++; localStorage.setItem("totalQuests", totalQuests);
            let s = (parseInt(localStorage.getItem("currentStreak")) || 0) + 1;
            let h = parseInt(localStorage.getItem("highestStreak")) || 0;
            if(s > h) localStorage.setItem("highestStreak", s);
            localStorage.setItem("currentStreak", s);
            showPopup("DAILY QUEST CLEARED.");
        } else { showPopup("TASK COMPLETE. +10 XP"); }
        setTimeout(() => location.reload(), 800);
    };
    li.appendChild(box);
    taskList.appendChild(li);
});

window.onload = () => { updateUI(); setPreset(25); setTimeout(() => showPopup("System Online. Hunter Active."), 500); };
