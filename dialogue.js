const dialogues = [
  {
    line1: "I want to disappear.",
    line2: "Then become something so bright they can’t look away.",
    weight: 10
  },
  {
    line1: "No one notices me.",
    line2: "Then make them remember you like a storm.",
    weight: 6
  },
  {
    line1: "I'm tired of trying.",
    line2: "Then try for yourself this time.",
    weight: 5
  },
  {
    line1: "I'm not enough.",
    line2: "You are. Even cracked stars still burn.",
    weight: 4
  },
  {
    line1: "This world doesn’t deserve me.",
    line2: "Maybe, but someone in it still needs you.",
    weight: 2
  }
];

const line1 = document.querySelector('.line1');
const line2 = document.querySelector('.line2');
const numberDisplay = document.getElementById('dialogue-number');

let canClick = true; // cooldown flag

function getRandomDialogue(shown = new Set()) {
  const unseen = dialogues.filter(d => !shown.has(d.line1 + d.line2));
  if (unseen.length === 0) return null;
  const totalWeight = unseen.reduce((sum, d) => sum + d.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const d of unseen) {
    if (rand < d.weight) return d;
    rand -= d.weight;
  }
  return unseen[unseen.length - 1];
} 

function showRandomDialogue() {
  // Calculate total weight
  const totalWeight = dialogues.reduce((sum, d) => sum + d.weight, 0);

  // Pick weighted random dialogue
  let rand = Math.random() * totalWeight;
  for (let i = 0; i < dialogues.length; i++) {
    rand -= dialogues[i].weight;
    if (rand <= 0) {
      const d = dialogues[i];
      line1.textContent = d.line1;
      line2.textContent = d.line2;
      numberDisplay.textContent = `#${i + 1} of ${dialogues.length}`;
      break;
    }
  }
}

dialogue.addEventListener('click', () => {
  if (!canClick) return;

  canClick = false;

  // Fade out
  dialogue.classList.add('fade');
  dialogue.style.opacity = 0;

  // Wait for fade out before changing text
  setTimeout(() => {
    showRandomDialogue(); // change text while invisible

    // Fade in
    dialogue.style.opacity = 1;

    // Clean up
    dialogue.classList.remove('fade');
    setTimeout(() => {
      canClick = true;
    }, 400); // shorter cooldown, since it fades now
  }, 300); // halfway through fade animation
});

// Show initial dialogue
showRandomDialogue();