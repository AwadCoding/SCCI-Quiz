
# SCCI Weekly Knowledge Check 🧠

![SCCI Quiz Preview](images/scci-preview.png)

A dynamic and interactive quiz application tailored for SCCI (Student's Conference for Communication and Information) members. This tool allows for weekly assessments with a modern, glassmorphism UI and a powerful admin panel for dynamic content management.

## ✨ Key Features

- **Dynamic Question System**: Questions are not hardcoded. They can be fully managed via the Admin Panel.
- **Admin Panel**: 
    - Add new questions with custom options.
    - Select correct answers dynamically.
    - Delete old questions.
    - Reset to default question set.
- **Interactive Timer**: 
    - **30-second** countdown per question.
    - Circular progress ring animation.
    - Auto-reveals the correct answer when time is up.
- **Persistent Storage**: Uses `LocalStorage` to save your custom questions locally in the browser.
- **Responsive Design**: Fully responsive layout that looks great on mobile and desktop.
- **Glassmorphism UI**: Modern aesthetic with blurred backgrounds and smooth transitions.

## 🚀 How to Use

### Taking the Quiz
1. Open `index.html` in your browser.
2. Read the question and select an answer.
3. Watch the timer! You have 30 seconds.
4. instant feedback on right/wrong answers.

### Managing Questions (Admin)
1. Click the **"Admin Panel ⚙️"** link at the bottom of the quiz or open `admin.html`.
2. Enter your question text and at least 2 options.
3. Select the correct answer from the dropdown.
4. Click **"Add Question"**.
5. Go back to the Quiz to see your new questions in action!

## 🛠️ Technologies Used

- **HTML5**: Semantic structure.
- **CSS3**: Variables, Flexbox, Animations, Glassmorphism effects.
- **Vanilla JavaScript (ES6+)**:
    - DOM Manipulation.
    - `localStorage` API for data persistence.
    - SVG Animation for the timer.

## 📂 Project Structure

```
├── index.html       # Main Quiz Interface
├── admin.html       # Question Management Panel
├── css/
│   └── style.css    # Global Styles & Themes
├── js/
│   ├── main.js      # Quiz Logic & Timer
│   ├── admin.js     # Admin Logic
│   └── storage.js   # Data Handling Module
└── images/          # Assets
```

---
*Created for SCCI Season '26*
