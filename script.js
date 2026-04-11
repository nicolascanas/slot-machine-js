const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

const reels = document.querySelectorAll(".reel");
const spinButton = document.querySelector(".spin-button");
const resultText = document.getElementById("result");

spinButton.addEventListener("click", () => {
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
    resultText.textContent = "🎉 WIN!";
    resultText.style.color = "#4caf50";
  } else {
    resultText.textContent = "❌ LOSE";
    resultText.style.color = "#f44336";
  }
}