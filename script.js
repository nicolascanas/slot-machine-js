const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

const reels = document.querySelectorAll(".reel");
const spinButton = document.querySelector(".spin-button");
const resultText = document.getElementById("result");
const coinsDisplay = document.getElementById("coins");
const bonusBtn = document.getElementById("bonusBtn");

const loginScreen = document.getElementById("loginScreen");
const gameScreen = document.getElementById("game");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");

const spinSound = new Audio("sounds/spin.mp3");
const winSound = new Audio("sounds/win.mp3");

const spinCost = 50;
const dailyBonus = 200;
const cooldown = 24 * 60 * 60 * 1000;

let currentUser = null;
let coins = 0;
let lastBonus = 0;
let isSpinning = false;

/* LOGIN */

loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username) return;

  currentUser = username;
  loadUserData();

  loginScreen.style.display = "none";
  gameScreen.style.display = "block";

  updateCoins();
  updateBonusButton();
});

function loadUserData() {
  if (currentUser === "admin") {
    coins = 999999;
    lastBonus = 0;
    return;
  }

  const data = JSON.parse(localStorage.getItem("user_" + currentUser));

  if (data) {
    coins = data.coins;
    lastBonus = data.lastBonus;
  } else {
    coins = 500;
    lastBonus = 0;
    saveUserData();
  }
}

function saveUserData() {
  if (currentUser === "admin") return;

  localStorage.setItem("user_" + currentUser, JSON.stringify({
    coins,
    lastBonus
  }));
}

/* SPIN */

spinButton.addEventListener("click", async () => {
  if (isSpinning) return;

  if (currentUser !== "admin" && coins < spinCost) {
    resultText.textContent = "💸 Not enough coins!";
    return;
  }

  isSpinning = true;
  spinButton.disabled = true;

  spinSound.currentTime = 0;
  spinSound.play();

  if (currentUser !== "admin") coins -= spinCost;

  updateCoins();
  saveUserData();

  let grid = [[], [], []];

  for (let col = 0; col < reels.length; col++) {
    const reel = reels[col];
    const symbolsElements = reel.querySelectorAll(".symbol");

    reel.classList.add("spinning");
    await delay(600 + col * 300);
    reel.classList.remove("spinning");

    for (let row = 0; row < 3; row++) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      symbolsElements[row].textContent = randomSymbol;
      grid[row][col] = randomSymbol;
    }
  }

  evaluateGrid(grid);

  isSpinning = false;
  spinButton.disabled = false;
});

/* GRID LOGIC */

function evaluateGrid(grid) {
  resultText.classList.remove("win");
  reels.forEach(r => r.classList.remove("win-reel"));

  let totalWin = 0;

  grid.forEach(row => {
    const [a, b, c] = row;

    const isJackpot = (a === "💎" && b === "💎" && c === "💎");

    const isMatch =
      (a === b && b === c) ||
      (a === "⭐" || b === "⭐" || c === "⭐");

    if (isJackpot) {
      totalWin += 500;
    } else if (isMatch) {
      totalWin += 150;
    }
  });

  if (totalWin > 0) {
    coins += totalWin;

    resultText.textContent = `🎉 WIN +${totalWin}`;
    resultText.classList.add("win");

    winSound.currentTime = 0;
    winSound.play();

    reels.forEach(r => r.classList.add("win-reel"));

  } else {
    resultText.textContent = "❌ LOSE";
  }

  saveUserData();
  updateCoins();
}

/* BONUS */

bonusBtn.addEventListener("click", () => {
  if (currentUser === "admin") return;

  const now = Date.now();

  if (now - lastBonus >= cooldown) {
    coins += dailyBonus;
    lastBonus = now;

    saveUserData();
    updateCoins();
    updateBonusButton();
  }
});

/* UI */

function updateCoins() {
  coinsDisplay.textContent = coins;
}

function updateBonusButton() {
  if (currentUser === "admin") {
    bonusBtn.disabled = true;
    bonusBtn.textContent = "Admin mode";
    return;
  }

  const now = Date.now();

  if (now - lastBonus >= cooldown) {
    bonusBtn.textContent = "Claim Daily Bonus";
  } else {
    bonusBtn.disabled = true;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}