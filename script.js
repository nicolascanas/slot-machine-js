const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

const reels = document.querySelectorAll(".reel");
const spinButton = document.querySelector(".spin-button");
const resultText = document.getElementById("result");
const coinsDisplay = document.getElementById("coins");

let coins = 500;
const spinCost = 50;
const winReward = 150;

spinButton.addEventListener("click", () => {
  if (coins < spinCost) {
    resultText.textContent = "💸 Not enough coins!";
    resultText.style.color = "#ff9800";
    return;
  }

  coins -= spinCost;
  updateCoins();

  let results = [];

  reels.forEach(reel => {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    const randomSymbol = symbols[randomIndex];

    const symbolElement = reel.querySelector(".symbol");
    symbolElement.textContent = randomSymbol;

    results.push(randomSymbol);
  });

  checkWin(results);
});

function checkWin(results) {
  if (results[0] === results[1] && results[1] === results[2]) {
    coins += winReward;
    updateCoins();

    resultText.textContent = "🎉 WIN!";
    resultText.style.color = "#4caf50";
  } else {
    resultText.textContent = "❌ LOSE";
    resultText.style.color = "#f44336";
  }
}

function updateCoins() {
  coinsDisplay.textContent = coins;
}