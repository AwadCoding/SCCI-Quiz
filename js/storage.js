import { db } from './firebase_config.js';
import { ref, get, set, child, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const DB_REF_KEY = 'questions';
const SCORES_KEY = 'scores';

const defaultQuestions = [];

// Async function to fetch questions
export async function getQuestions(workshop) {
    if (!workshop) {
        console.warn("getQuestions called without workshop. Returning empty defaults.");
        return defaultQuestions;
    }
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, `${DB_REF_KEY}/${workshop}`));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log(`No data available for ${workshop}. Returning defaults.`);
            return defaultQuestions;
        }
    } catch (error) {
        console.error("Error getting data:", error);
        // Fallback to defaults on error
        return defaultQuestions;
    }
}

// Async function to save questions
export async function saveQuestions(questions, workshop) {
    if (!workshop) {
        console.error("No workshop specified for saving questions.");
        return;
    }
    try {
        await set(ref(db, `${DB_REF_KEY}/${workshop}`), questions);
        console.log(`Data saved successfully for ${workshop}!`);
    } catch (error) {
        console.error("Error saving data:", error);
        alert("Error saving to cloud. Check console.");
    }
}

export async function resetQuestions(workshop) {
    if (!workshop) return;
    await saveQuestions([], workshop);
    return [];
}


export async function saveScore(name, score, time, workshop) {
    if (!workshop) {
        console.error("No workshop specified for saving score.");
        return;
    }
    try {
        const newScoreRef = push(child(ref(db), `${SCORES_KEY}/${workshop}`));
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

export async function getLeaderboard(workshop) {
    if (!workshop) return [];
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, `${SCORES_KEY}/${workshop}`));
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

export async function resetLeaderboard(workshop) {
    if (!workshop) return;
    try {
        await set(ref(db, `${SCORES_KEY}/${workshop}`), null);
        console.log(`Leaderboard cleared for ${workshop}!`);
    } catch (error) {
        console.error("Error clearing leaderboard:", error);
    }
}
