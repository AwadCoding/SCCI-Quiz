const questions = [
  {
    q: "What does SCCI stand for?",
    options: [
      "Students Conference for Communication & Information",
      "Smart Community for Creative Innovations",
      "Senate Committee for Computing & Informatics"
    ],
    correct: 0
  },
  {
    q: "Which workshop focuses on Full-Stack Web Development?",
    options: ["Data Station", "Divology", "TechSolve"],
    correct: 1
  },
  {
    q: "Which workshop teaches Arduino and Electronics?",
    options: ["Marketneur", "TechSolve", "Divology"],
    correct: 1
  },
  {
    q: "Which tool is mainly used in Data Station?",
    options: ["Excel & Power BI", "Premiere Pro", "Blender"],
    correct: 0
  },
  {
    q: "What is the final event of the season?",
    options: ["Mid-Year Challenge", "Final Conference", "Tech Day"],
    correct: 1
  }
];

let index = 0;
let score = 0;

const quizBox = document.getElementById("quizBox");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("resultBox");
const progressBar = document.getElementById("progressBar");

function loadQuestion() {
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
  quizBox.classList.add("hidden");
  progressBar.style.width = "100%";

  resultBox.classList.remove("hidden");
  resultBox.innerHTML = `
    <h2>Your Score</h2>
    <p>You got ${score} out of ${questions.length}</p>
  `;
}

loadQuestion();
