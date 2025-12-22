import { getQuestions, saveQuestions, resetQuestions, getLeaderboard, resetLeaderboard } from './storage.js';

const form = document.getElementById('questionForm');
const questionsList = document.getElementById('questionsList');
const resetBtn = document.getElementById('resetBtn');
const addOptionBtn = document.getElementById('addOptionBtn');
const optionsContainer = document.getElementById('optionsContainer');
const correctIndexSelect = document.getElementById('correctIndex');

let questions = [];

// Basic Auth Check
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        document.getElementById('loginOverlay').classList.add('hidden');
        init();
    } else {
        // Overlay is visible by CSS default, so we stop here.
        // Waiting for user to login.
    }
}

async function init() {
    try {
        questionsList.innerHTML = '<p style="color:white;">Loading questions...</p>';
        questions = await getQuestions();
        renderQuestions();
        renderLeaderboard();
    } catch (error) {
        console.error("Error init admin:", error);
        questionsList.innerHTML = '<p style="color:red;">Error loading data.</p>';
    }
}

function renderQuestions() {
    questionsList.innerHTML = '';
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = 'question-item';
        div.innerHTML = `
      <div class="q-content">
        <strong>${index + 1}. ${q.q}</strong>
        <ul style="margin-top: 5px; padding-left: 20px; color: #ccc; font-size: 0.9em;">
          ${q.options.map((opt, i) => `<li style="${i === q.correct ? 'color: #27ae60; font-weight: bold;' : ''}">${opt}</li>`).join('')}
        </ul>
      </div>
      <button class="delete-btn" onclick="deleteQuestion(${index})">&times;</button>
    `;
        questionsList.appendChild(div);
    });

    // Attach event listeners to delete buttons
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            deleteQuestion(i);
        })
    });
}

function deleteQuestion(index) {
    if (confirm('Are you sure you want to delete this question?')) {
        questions.splice(index, 1);
        saveQuestions(questions);
        renderQuestions();
    }
}
window.deleteQuestion = deleteQuestion; // Make it global for the inline onclick

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const qText = document.getElementById('questionText').value;
    const optionInputs = document.querySelectorAll('.option-input');
    const correctIndex = parseInt(document.getElementById('correctIndex').value);

    const options = Array.from(optionInputs).map(input => input.value).filter(val => val.trim() !== '');

    if (options.length < 2) {
        alert('Please provide at least 2 options.');
        return;
    }

    const newQuestion = {
        q: qText,
        options: options,
        correct: correctIndex
    };

    questions.push(newQuestion);
    await saveQuestions(questions); // Await save

    alert('Question Added!');
    form.reset();
    // Remove extra options, keep first 3 by default or just reset inputs? 
    // form.reset() clears values but doesn't remove elements.
    // Let's reset the container to 3 default inputs.
    optionsContainer.innerHTML = `
        <input type="text" class="option-input" placeholder="Option 1" required>
        <input type="text" class="option-input" placeholder="Option 2" required>
        <input type="text" class="option-input" placeholder="Option 3" required>
    `;
    updateCorrectIndexOptions();
    renderQuestions();
});

resetBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete ALL questions? This cannot be undone.')) {
        questions = await resetQuestions(); // Await reset
        renderQuestions();
    }
});

// Add Option Logic
addOptionBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'option-input';
    input.placeholder = `Option ${document.querySelectorAll('.option-input').length + 1}`;
    input.required = true;
    optionsContainer.appendChild(input);
    updateCorrectIndexOptions();
});

function updateCorrectIndexOptions() {
    const count = document.querySelectorAll('.option-input').length;
    correctIndexSelect.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `Option ${i + 1}`;
        correctIndexSelect.appendChild(opt);
    }
}


async function renderLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    if (!leaderboardBody) return;

    leaderboardBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Loading...</td></tr>';

    const leaders = await getLeaderboard();

    if (leaders.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No records yet</td></tr>';
        return;
    }

    leaderboardBody.innerHTML = leaders.map((entry, index) => {
        let rankEmoji = "";
        if (index === 0) rankEmoji = "🥇";
        if (index === 1) rankEmoji = "🥈";
        if (index === 2) rankEmoji = "🥉";

        return `
          <tr>
            <td>${rankEmoji || (index + 1)}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.time}s</td>
          </tr>
        `;
    }).join("");
}

document.getElementById('refreshLbBtn')?.addEventListener('click', renderLeaderboard);

document.getElementById('clearLbBtn')?.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear the leaderboard? This cannot be undone.')) {
        await resetLeaderboard();
        renderLeaderboard();
    }
});

// Start with Auth Check
checkAuth();

// Login Logic
document.getElementById('loginBtn').addEventListener('click', () => {
    const user = document.getElementById('usernameInput').value;
    const pass = document.getElementById('passwordInput').value;

    // Simple hardcoded check
    if (user === 'admin' && pass === '123') {
        sessionStorage.setItem('adminLoggedIn', 'true');
        checkAuth();
    } else {
        alert('Incorrect Username or Password');
    }
});

