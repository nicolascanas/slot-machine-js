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

const spinCost = 50;
const winReward = 150;
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

/* GAME */

spinButton.addEventListener("click", async () => {
  if (isSpinning) return;

  if (currentUser !== "admin" && coins < spinCost) {
    resultText.textContent = "💸 Not enough coins!";
    resultText.style.color = "#ff9800";
    return;
  }

  isSpinning = true;
  spinButton.disabled = true;

  if (currentUser !== "admin") {
    coins -= spinCost;
  }

  updateCoins();
  saveUserData();

  resultText.textContent = "Spinning...";
  resultText.style.color = "#fff";

  let results = [];

  for (let i = 0; i < reels.length; i++) {
    const reel = reels[i];
    const symbolElement = reel.querySelector(".symbol");

    reel.classList.add("spinning");

    await delay(500 + i * 300);

    reel.classList.remove("spinning");

    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    symbolElement.textContent = randomSymbol;
    results.push(randomSymbol);
  }

  checkWin(results);

  isSpinning = false;
  spinButton.disabled = false;
});

bonusBtn.addEventListener("click", () => {
  if (currentUser === "admin") return;

  const now = Date.now();

  if (now - lastBonus >= cooldown) {
    coins += dailyBonus;
    lastBonus = now;

    saveUserData();
    updateCoins();
    updateBonusButton();

    resultText.textContent = "🎁 Bonus claimed!";
    resultText.style.color = "#4caf50";
  }
});

/* LOGIC */

function checkWin(results) {
  resultText.classList.remove("win");

  if (results[0] === results[1] && results[1] === results[2]) {
    if (currentUser !== "admin") {
      coins += winReward;
    }

    resultText.textContent = "🎉 WIN!";
    resultText.style.color = "#4caf50";
    resultText.classList.add("win");

  } else {
    resultText.textContent = "❌ LOSE";
    resultText.style.color = "#f44336";
  }

  saveUserData();
  updateCoins();
}

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
    bonusBtn.disabled = false;
    bonusBtn.textContent = "Claim Daily Bonus";
  } else {
    bonusBtn.disabled = true;

    const remaining = cooldown - (now - lastBonus);
    const hours = Math.floor(remaining / (1000 * 60 * 60));

    bonusBtn.textContent = `Available in ${hours}h`;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}