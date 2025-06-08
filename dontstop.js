function getUserId() {
  let id = localStorage.getItem('userId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('userId', id);
  }
  return id;
}

const userId = getUserId(); // get once

const button = document.getElementById("star-button");
const counter = document.getElementById("star-count");

import { doc, getDoc, updateDoc, arrayUnion, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const db = window.firestore;

// Get star data for a dialogue
async function getStarData(dialogueId) {
  const docRef = doc(db, "dialogues", dialogueId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // Create initial doc if missing
    await setDoc(docRef, { starCount: 0, usersStarred: [] });
    return { starCount: 0, usersStarred: [] };
  }
}

// Check if user already starred
function hasUserStarred(userId, usersStarred) {
  return usersStarred.includes(userId);
}

// Format stars count to "1k", "2.5k", etc
function formatStars(count) {
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return count.toString();
}

// Update UI star count text
function updateStarCountUI(count) {
  counter.textContent = formatStars(count);
}

// The dialogue ID should be dynamic — replace 'currentDialogueId' with your actual dialogue id variable
const currentDialogueId = "dialogue_1"; // example, replace with your dialogue's ID

// Initialize the star count UI on page load
async function initStarCount() {
  const data = await getStarData(currentDialogueId);
  updateStarCountUI(data.starCount);
  // Disable button if user already starred
  if (hasUserStarred(userId, data.usersStarred)) {
    button.disabled = true;
    button.textContent = "★"; // filled star or any indicator
  }
}

// Add star click handler
button.addEventListener("click", async () => {
  button.disabled = true; // disable immediately to prevent double-click
  const added = await addStar(currentDialogueId, userId);
  if (added) {
    const data = await getStarData(currentDialogueId);
    updateStarCountUI(data.starCount);
    button.textContent = "★";
  } else {
    // Already starred, maybe show message or keep disabled
  }
});

// Add star if not already starred
async function addStar(dialogueId, userId) {
  const docRef = doc(db, "dialogues", dialogueId);
  const data = await getStarData(dialogueId);

  if (!hasUserStarred(userId, data.usersStarred)) {
    await updateDoc(docRef, {
      starCount: increment(1),
      usersStarred: arrayUnion(userId),
    });
    return true; // Star added
  }
  return false; // Already starred
}

// Call init on page load
initStarCount();