
import { db } from './firebase_config.js';
import { ref, get, set, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
