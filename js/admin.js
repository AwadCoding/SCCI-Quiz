
import { getQuestions, saveQuestions, resetQuestions } from './storage.js';

const form = document.getElementById('questionForm');
const questionsList = document.getElementById('questionsList');
const resetBtn = document.getElementById('resetBtn');
const addOptionBtn = document.getElementById('addOptionBtn');
const optionsContainer = document.getElementById('optionsContainer');
const correctIndexSelect = document.getElementById('correctIndex');

let questions = getQuestions();

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

form.addEventListener('submit', (e) => {
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
    saveQuestions(questions);

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

resetBtn.addEventListener('click', () => {
    if (confirm('This will delete all custom questions and restore defaults. Are you sure?')) {
        questions = resetQuestions();
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

// Initial Render
renderQuestions();
