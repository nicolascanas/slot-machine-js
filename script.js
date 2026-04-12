const symbols = ["🍒", "🍋", "🍊", "⭐", "💎", "🔥"];

const reels = document.querySelectorAll(".reel");
const spinButton = document.querySelector(".spin-button");
const resultText = document.getElementById("result");
const coinsDisplay = document.getElementById("coins");
const bonusBtn = document.getElementById("bonusBtn");

const loginScreen = document.getElementById("loginScreen");
const gameScreen = document.getElementById("game");
const loginBtn = document.getElementById("loginBtn");
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
    const symbol = document.createElement("div");
    symbol.classList.add("symbol");
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    strip.appendChild(symbol);
  }

  reel.appendChild(strip);
});

/* LOGIN */

loginBtn.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  if (!user || !pass) return;

  const stored = JSON.parse(localStorage.getItem("user_" + user));

  if (stored) {
    if (stored.password !== pass) {
      alert("Wrong password");
      return;
    }
    coins = stored.coins;
  } else {
    coins = 500;
    localStorage.setItem("user_" + user, JSON.stringify({
      password: pass,
      coins: coins
    }));
  }

  currentUser = user;

  loginScreen.style.display = "none";
  gameScreen.style.display = "block";

  updateCoins();
});

/* LOGOUT */

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  gameScreen.style.display = "none";
  loginScreen.style.display = "block";
});

/* SPIN */

spinButton.addEventListener("click", async () => {
  if (isSpinning) return;

  isSpinning = true;

  reels.forEach(r => r.classList.add("spinning"));

  await delay(1500);

  reels.forEach(r => r.classList.remove("spinning"));

  let grid = [[], [], []];
  let scatterCount = 0;

  reels.forEach((reel, col) => {
    const strip = reel.querySelector(".reel-strip");
    const symbolsElements = strip.children;

    for (let row = 0; row < 3; row++) {
      const rand = symbols[Math.floor(Math.random() * symbols.length)];
      symbolsElements[row].textContent = rand;
      grid[row][col] = rand;

      if (rand === "🔥") scatterCount++;
    }
  });

  evaluate(grid, scatterCount);

  isSpinning = false;
});

/* LOGIC */

function evaluate(grid, scatterCount) {
  let win = 0;

  if (scatterCount >= 3) {
    freeSpins += 5;
    resultText.textContent = "🔥 FREE SPINS!";
  }

  grid.forEach(row => {
    const [a,b,c] = row;

    if (a === b && b === c) {
      win += 150;
    }
  });

  if (win > 0) {
    if (freeSpins > 0) {
      win *= multiplier;
      multiplier++;
    }

    coins += win;
    resultText.textContent = `WIN +${win} (x${multiplier})`;
  } else {
    resultText.textContent = "LOSE";
  }

  save();
  updateCoins();
}

/* SAVE */

function save() {
  if (!currentUser) return;

  const data = JSON.parse(localStorage.getItem("user_" + currentUser));
  data.coins = coins;

  localStorage.setItem("user_" + currentUser, JSON.stringify(data));
}

/* UI */

function updateCoins() {
  coinsDisplay.textContent = coins;
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}