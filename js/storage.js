
const STORAGE_KEY = 'scci_quiz_questions';

const defaultQuestions = [
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

export function getQuestions() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Error parsing questions from local storage", e);
            return defaultQuestions;
        }
    }
    return defaultQuestions;
}

export function saveQuestions(questions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function resetQuestions() {
    localStorage.removeItem(STORAGE_KEY);
    return defaultQuestions;
}
