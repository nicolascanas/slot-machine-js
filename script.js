const symbols = ["🍒", "🍋", "🍊", "⭐", "💎", "🔥"];

const reels = document.querySelectorAll(".reel");
const spinButton = document.querySelector(".spin-button");
const resultText = document.getElementById("result");
const coinsDisplay = document.getElementById("coins");

const loginScreen = document.getElementById("loginScreen");
const gameScreen = document.getElementById("game");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

let currentUser = null;
let coins = 0;
let freeSpins = 0;
let multiplier = 1;
let isSpinning = false;

/* INIT REELS */

reels.forEach(reel => {
  const strip = document.createElement("div");
  strip.classList.add("reel-strip");

  for (let i = 0; i < 20; i++) {
    const s = document.createElement("div");
    s.classList.add("symbol");
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    strip.appendChild(s);
  }

  reel.appendChild(strip);
});

/* AUTH */

signupBtn.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  if (!user || !pass) return;

  if (localStorage.getItem("user_" + user)) {
    alert("User already exists");
    return;
  }

  localStorage.setItem("user_" + user, JSON.stringify({
    password: pass,
    coins: 500
  }));

  alert("Account created!");
});

loginBtn.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  const data = JSON.parse(localStorage.getItem("user_" + user));

  if (!data || data.password !== pass) {
    alert("Invalid login");
    return;
  }

  currentUser = user;
  coins = data.coins;

  loginScreen.style.display = "none";
  gameScreen.style.display = "block";

  updateCoins();
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  gameScreen.style.display = "none";
  loginScreen.style.display = "block";
});

/* SPIN */

spinButton.addEventListener("click", async () => {
  if (isSpinning) return;

  isSpinning = true;

  clearHighlights();

  reels.forEach(r => r.classList.add("spinning"));

  await delay(1200);

  reels.forEach(r => r.classList.remove("spinning"));

  let grid = [[], [], []];
  let scatter = 0;

  reels.forEach((reel, col) => {
    const strip = reel.querySelector(".reel-strip");

    for (let row = 0; row < 3; row++) {
      const rand = symbols[Math.floor(Math.random() * symbols.length)];
      strip.children[row].textContent = rand;
      grid[row][col] = rand;

      if (rand === "🔥") scatter++;
    }
  });

  evaluate(grid, scatter);

  isSpinning = false;
});

/* GAME LOGIC */

function evaluate(grid, scatter) {
  let win = 0;
  let winningRows = [];

  if (scatter >= 3) {
    freeSpins += 5;
    resultText.textContent = "🔥 FREE SPINS!";
  }

  grid.forEach((row, i) => {
    const [a,b,c] = row;

    if (a === b && b === c) {
      win += 150;
      winningRows.push(i);
    }
  });

  if (win > 0) {
    if (freeSpins > 0) {
      win *= multiplier;
      multiplier++;
    }

    coins += win;

    resultText.textContent = `🎉 WIN +${win} (x${multiplier})`;
    resultText.classList.add("win");

    highlight(winningRows);
  } else {
    resultText.textContent = "❌ LOSE";
  }

  save();
  updateCoins();
}

/* HIGHLIGHT */

function highlight(rows) {
  rows.forEach(r => {
    reels.forEach(reel => {
      reel.querySelectorAll(".symbol")[r].classList.add("win-symbol");
    });
  });

  reels.forEach(r => r.classList.add("win-reel"));
}

function clearHighlights() {
  document.querySelectorAll(".symbol").forEach(s => s.classList.remove("win-symbol"));
  reels.forEach(r => r.classList.remove("win-reel"));
}

/* SAVE */

function save() {
  if (!currentUser) return;

  const data = JSON.parse(localStorage.getItem("user_" + currentUser));
  data.coins = coins;

  localStorage.setItem("user_" + currentUser, JSON.stringify(data));
}

/* UTILS */

function updateCoins() {
  coinsDisplay.textContent = coins;
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}