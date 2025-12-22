
import { db } from './firebase_config.js';
import { ref, get, set, child, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const DB_REF_KEY = 'questions';

const defaultQuestions = [];

// Async function to fetch questions
export async function getQuestions() {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, DB_REF_KEY));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available, using defaults. Saving defaults to cloud...");
            // If DB is empty, upload defaults so we have data
            await saveQuestions(defaultQuestions);
            return defaultQuestions;
        }
    } catch (error) {
        console.error("Error getting data:", error);
        // Fallback to defaults on error (e.g. offline)
        return defaultQuestions;
    }
}

// Async function to save questions
export async function saveQuestions(questions) {
    try {
        await set(ref(db, DB_REF_KEY), questions);
        console.log("Data saved successfully!");
    } catch (error) {
        console.error("Error saving data:", error);
        alert("Error saving to cloud. Check console.");
    }
}

export async function resetQuestions() {
    await saveQuestions([]);
    return [];
}

const SCORES_KEY = 'scores';

export async function saveScore(name, score, time) {
    try {
        const newScoreRef = push(child(ref(db), SCORES_KEY));
        await set(newScoreRef, {
            name: name,
            score: score,
            time: time,
            timestamp: Date.now()
        });
        console.log("Score saved!");
    } catch (error) {
        console.error("Error saving score:", error);
    }
}

export async function getLeaderboard() {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, SCORES_KEY));
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Convert object to array
            const scoresArray = Object.values(data);

            // Sort by Score (Desc) then Time (Asc)
            scoresArray.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score; // Higher score first
                }
                return a.time - b.time; // Lower time first
            });

            return scoresArray.slice(0, 10); // Return top 10
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
}

export async function resetLeaderboard() {
    try {
        await set(ref(db, SCORES_KEY), null);
        console.log("Leaderboard cleared!");
    } catch (error) {
        console.error("Error clearing leaderboard:", error);
    }
}
