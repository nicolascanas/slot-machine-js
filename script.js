const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

const reels = document.querySelectorAll(".reel");
const spinButton = document.querySelector(".spin-button");
const resultText = document.getElementById("result");
const coinsDisplay = document.getElementById("coins");
const bonusBtn = document.getElementById("bonusBtn");

const spinCost = 50;
const winReward = 150;
const dailyBonus = 200;
const cooldown = 24 * 60 * 60 * 1000; // 24h

let coins = loadCoins();
let lastBonus = loadLastBonus();

updateCoins();
updateBonusButton();

spinButton.addEventListener("click", () => {
  if (coins < spinCost) {
    resultText.textContent = "💸 Not enough coins!";
    resultText.style.color = "#ff9800";
    return;
  }

  coins -= spinCost;
  saveCoins();

  let results = [];

  reels.forEach(reel => {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    const randomSymbol = symbols[randomIndex];

    reel.querySelector(".symbol").textContent = randomSymbol;
    results.push(randomSymbol);
  });

  checkWin(results);
});

bonusBtn.addEventListener("click", () => {
  const now = Date.now();

  if (now - lastBonus >= cooldown) {
    coins += dailyBonus;
    lastBonus = now;

    saveCoins();
    saveLastBonus();

    updateCoins();
    updateBonusButton();

    resultText.textContent = "🎁 Bonus claimed!";
    resultText.style.color = "#4caf50";
  }
});

function checkWin(results) {
  if (results[0] === results[1] && results[1] === results[2]) {
    coins += winReward;
    resultText.textContent = "🎉 WIN!";
    resultText.style.color = "#4caf50";
  } else {
    resultText.textContent = "❌ LOSE";
    resultText.style.color = "#f44336";
  }

  saveCoins();
  updateCoins();
}

function updateCoins() {
  coinsDisplay.textContent = coins;
}

function updateBonusButton() {
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

function saveCoins() {
  localStorage.setItem("coins", coins);
}

function loadCoins() {
  return parseInt(localStorage.getItem("coins")) || 500;
}

function saveLastBonus() {
  localStorage.setItem("lastBonus", lastBonus);
}

function loadLastBonus() {
  return parseInt(localStorage.getItem("lastBonus")) || 0;
}