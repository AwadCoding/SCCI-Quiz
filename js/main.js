import { getQuestions } from './storage.js';

let questions = [];
let index = 0;
let score = 0;

const quizBox = document.getElementById("quizBox");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("resultBox");
const progressBar = document.getElementById("progressBar");
const timerBox = document.getElementById("timerBox");
const timerText = document.getElementById("timerText");
const timerProgress = document.getElementById("timerProgress");

let timer;
const TIME_LIMIT = 30;
let timeLeft = TIME_LIMIT;
const FULL_DASH_ARRAY = 226; // 2 * PI * 36

async function init() {
  try {
    // Show loading state if needed, or just wait
    quizBox.innerHTML = '<p style="color:white; text-align:center;">Loading questions...</p>';
    questions = await getQuestions();

    // Check if we actually got questions
    if (!questions || questions.length === 0) {
      quizBox.innerHTML = '<p style="color:white; text-align:center;">No questions found.</p>';
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

function handleTimeUp() {
  if (answered) return;
  answered = true;

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
      <h3>${q.q}</h3>
      ${q.options
      .map(
        (opt, i) => `
        <div class="option" onclick="selectOption(this, ${i})">${opt}</div>`
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
    showResults();
  }
});

function showResults() {
  stopTimer();
  quizBox.classList.add("hidden");
  timerBox.classList.add("hidden"); // Hide timer container
  progressBar.style.width = "100%";

  resultBox.classList.remove("hidden");
  resultBox.innerHTML = `
    <h2>Your Score</h2>
    <p>You got ${score} out of ${questions.length}</p>
  `;
}

// Start the app
init();
