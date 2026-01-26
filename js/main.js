import { getQuestions, saveScore, getLeaderboard } from './storage.js';

let questions = [];
let index = 0;
let score = 0;
let playerName = "";
let selectedWorkshop = "";
let accumulatedTime = 0; // Total time taken in seconds

const quizBox = document.getElementById("quizBox");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("resultBox");
const progressBar = document.getElementById("progressBar");
const timerBox = document.getElementById("timerBox");
const timerText = document.getElementById("timerText");
const timerProgress = document.getElementById("timerProgress");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("startBtn");
const leaderboardSection = document.getElementById("leaderboardSection");
const leaderboardBody = document.getElementById("leaderboardBody");
const workshopSelect = document.getElementById("workshopSelect");


let timer;
const TIME_LIMIT = 30;
let timeLeft = TIME_LIMIT;
const FULL_DASH_ARRAY = 226; // 2 * PI * 36

// START BUTTON HANDLER
startBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  const workshop = workshopSelect.value;

  if (name === "") {
    alert("Please enter your name!");
    return;
  }

  playerName = name;
  selectedWorkshop = workshop;

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  init();
});

async function init() {
  try {
    // Show loading state if needed, or just wait
    quizBox.innerHTML = '<p style="color:white; text-align:center;">Loading questions...</p>';
    questions = await getQuestions(selectedWorkshop);

    // Check if we actually got questions
    if (!questions || questions.length === 0) {
      quizBox.innerHTML = '<p style="color:white; text-align:center;">No questions found for ' + selectedWorkshop + '.</p>';
      return;
    }

    loadQuestion();
  } catch (error) {
    console.error("Failed to load questions:", error);
    quizBox.innerHTML = '<p style="color:red; text-align:center;">Error loading questions. Please refresh.</p>';
  }
}

function startTimer() {
  timeLeft = TIME_LIMIT;
  timerText.innerHTML = timeLeft;
  timerText.classList.remove("time-up-text");

  // Reset circle
  timerProgress.style.strokeDasharray = `${FULL_DASH_ARRAY}`;
  timerProgress.style.strokeDashoffset = 0;
  timerProgress.style.stroke = "#c41e3a";

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerText.innerHTML = timeLeft;

    // Update Circle Progress
    const offset = FULL_DASH_ARRAY - (timeLeft / TIME_LIMIT) * FULL_DASH_ARRAY;
    timerProgress.style.strokeDashoffset = offset;

    if (timeLeft <= 10) {
      timerProgress.style.stroke = "#e74c3c"; // Optional: Warning color change
      timerText.classList.add("time-up-text");
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// Helper to record time for current question
function recordTime() {
  accumulatedTime += (TIME_LIMIT - timeLeft);
}

function handleTimeUp() {
  if (answered) return;
  answered = true;
  recordTime(); // Time ran out, so full time added (or close to it) changes slightly if we just use TIME_LIMIT

  const correctIndex = questions[index].correct;
  const options = document.querySelectorAll(".option");

  // Highlight correct answer only
  if (options[correctIndex]) {
    options[correctIndex].classList.add("correct");
  }

  nextBtn.classList.remove("hidden");
}

function loadQuestion() {
  startTimer();
  const q = questions[index];

  quizBox.innerHTML = `
    <div class="question">
      <h3 dir="auto"><img src="assets/images/icons/question%20mark.png" class="question-icon" alt="?"> ${q.q}</h3>
      ${q.options
      .map(
        (opt, i) => `
        <div class="option" onclick="selectOption(this, ${i})" dir="auto">${opt}</div>`
      )
      .join("")}
    </div>
  `;

  progressBar.style.width = ((index) / questions.length) * 100 + "%";
}

let answered = false;

function selectOption(el, i) {
  if (answered) return;
  stopTimer(); // Stop timer when user selects
  answered = true;
  recordTime();

  const correctIndex = questions[index].correct;
  const options = document.querySelectorAll(".option");

  options.forEach((opt, idx) => {
    if (idx === correctIndex) opt.classList.add("correct");
    if (idx === i && i !== correctIndex) opt.classList.add("wrong");
  });

  if (i === correctIndex) score++;

  nextBtn.classList.remove("hidden");
}

window.selectOption = selectOption;

nextBtn.addEventListener("click", () => {
  index++;
  answered = false;

  nextBtn.classList.add("hidden");

  if (index < questions.length) {
    loadQuestion();
  } else {
    finishGame();
  }
});

async function finishGame() {
  stopTimer();
  quizBox.classList.add("hidden");
  timerBox.classList.add("hidden");
  progressBar.style.width = "100%";

  resultBox.classList.remove("hidden");
  resultBox.innerHTML = `
    <h2>Your Score</h2>
    <p>You got ${score} out of ${questions.length}</p>
    <p style="font-size:14px; color:#aaa;">Time taken: ${accumulatedTime}s</p>
    <div style="margin-top:20px; color:#fff;">Saving score...</div>
  `;

  // Save Score
  await saveScore(playerName, score, accumulatedTime, selectedWorkshop);

  // Fetch Leaderboard
  const leaders = await getLeaderboard(selectedWorkshop);

  // Update Leaderboard UI
  leaderboardBody.innerHTML = leaders.map((entry, index) => {
    let rankDisplay = (index + 1);

    if (index === 0) {
      rankDisplay = `<img src="assets/images/icons/maincup1.png" class="rank-icon-gold" alt="1st">`;
    } else if (index === 1) {
      rankDisplay = `<img src="assets/images/icons/cup2.png" class="rank-icon-silver" alt="2nd">`;
    } else if (index === 2) {
      rankDisplay = `<img src="assets/images/icons/cup3.png" class="rank-icon-bronze" alt="3rd">`;
    }

    return `
      <tr>
        <td>${rankDisplay}</td>
        <td>${entry.name}</td>
        <td>${entry.score}</td>
        <td>${entry.time}s</td>
      </tr>
    `;
  }).join("");

  // Reveal Leaderboard
  leaderboardSection.classList.remove("hidden");

  // Clear "Saving score..." message by updating resultBox content slightly if needed, or just append table
  resultBox.innerHTML = `
    <h2>Your Score</h2>
    <p>You got ${score} out of ${questions.length}</p>
    <p style="font-size:14px; color:#aaa;">Time taken: ${accumulatedTime}s</p>
  `;
}

// Spotlight Effect
const spotlight = document.getElementById('spotlight');
if (spotlight) {
  document.addEventListener('mousemove', (e) => {
    spotlight.style.left = e.pageX + 'px';
    spotlight.style.top = e.pageY + 'px';
  });
}
