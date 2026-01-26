import { getQuestions, saveQuestions, resetQuestions, getLeaderboard, resetLeaderboard } from './storage.js';

const form = document.getElementById('questionForm');
const questionsList = document.getElementById('questionsList');
const resetBtn = document.getElementById('resetBtn');
const addOptionBtn = document.getElementById('addOptionBtn');
const optionsContainer = document.getElementById('optionsContainer');
const correctIndexSelect = document.getElementById('correctIndex');
const workshopSelect = document.getElementById('workshopSelect');

let questions = [];

// Basic Auth Check
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        // Assume loginOverlay might be present in index or handled differently, 
        // but admin.html usually doesn't have login overlay in the code showed.
        // It seems the login logic was at the bottom of the file but no overlay in HTML?
        // Ah, likely the user removed it or it's hidden. 
        // The original code had: document.getElementById('loginOverlay').classList.add('hidden');
        // valid check.
        if (document.getElementById('loginOverlay')) {
            document.getElementById('loginOverlay').classList.add('hidden');
        }
        init();
    } else {
        // If there's a login overlay, show it. If not, maybe redirect?
        // For now adhering to original structure.
    }
}

async function init() {
    await loadData();
}

async function loadData() {
    const workshop = workshopSelect.value;
    try {
        questionsList.innerHTML = '<p style="color:white;">Loading questions...</p>';
        questions = await getQuestions(workshop);
        renderQuestions();
        renderLeaderboard();
    } catch (error) {
        console.error("Error init admin:", error);
        questionsList.innerHTML = '<p style="color:red;">Error loading data.</p>';
    }
}

workshopSelect.addEventListener('change', loadData);

function renderQuestions() {
    questionsList.innerHTML = '';
    if (questions.length === 0) {
        questionsList.innerHTML = '<p style="color:rgba(255,255,255,0.5);">No questions for this workshop yet.</p>';
        return;
    }
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
    showConfirmModal('Delete Question', 'Are you sure you want to delete this question?', () => {
        questions.splice(index, 1);
        const workshop = workshopSelect.value;
        saveQuestions(questions, workshop);
        renderQuestions();
    });
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
    const workshop = workshopSelect.value;
    await saveQuestions(questions, workshop); // Await save

    alert('Question Added!');
    form.reset();

    // Reset options to default 3
    optionsContainer.innerHTML = `
        <input type="text" class="option-input" placeholder="Option 1" required dir="auto">
        <input type="text" class="option-input" placeholder="Option 2" required dir="auto">
        <input type="text" class="option-input" placeholder="Option 3" required dir="auto">
    `;
    updateCorrectIndexOptions();
    renderQuestions();
});

resetBtn.addEventListener('click', async () => {
    showConfirmModal('Delete All Questions', 'Are you sure you want to delete ALL questions? This cannot be undone.', async () => {
        const workshop = workshopSelect.value;
        questions = await resetQuestions(workshop);
        renderQuestions();
    });
});

// Add Option Logic
addOptionBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'option-input';
    input.placeholder = `Option ${document.querySelectorAll('.option-input').length + 1}`;
    input.required = true;
    input.dir = "auto";
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

    const workshop = workshopSelect.value;
    const leaders = await getLeaderboard(workshop);

    if (leaders.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No records yet</td></tr>';
        return;
    }

    leaderboardBody.innerHTML = leaders.map((entry, index) => {
        let rankDisplay = (index + 1);

        if (index === 0) {
            rankDisplay = `<img src="assets/images/goblet.jpg" class="rank-icon-gold" alt="Winner">`;
        } else if (index === 1) {
            rankDisplay = "🥈";
        } else if (index === 2) {
            rankDisplay = "🥉";
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
}

document.getElementById('refreshLbBtn')?.addEventListener('click', renderLeaderboard);

document.getElementById('clearLbBtn')?.addEventListener('click', async () => {
    showConfirmModal('Clear Leaderboard', 'Are you sure you want to clear the leaderboard? This cannot be undone.', async () => {
        const workshop = workshopSelect.value;
        await resetLeaderboard(workshop);
        renderLeaderboard();
    });
});

// Start with Auth Check
checkAuth();

// Login Logic (if elements exist)
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
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
}

// Custom Confirm Modal Functions
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmBtn');

    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    modal.style.display = 'flex';

    // Remove old listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    // Add new listener
    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        closeConfirmModal();
    });
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'none';
}

window.closeConfirmModal = closeConfirmModal;
