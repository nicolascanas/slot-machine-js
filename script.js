const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

const reels = document.querySelectorAll(".reel");
const spinButton = document.querySelector(".spin-button");

spinButton.addEventListener("click", () => {
  reels.forEach(reel => {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    const randomSymbol = symbols[randomIndex];

    const symbolElement = reel.querySelector(".symbol");
    symbolElement.textContent = randomSymbol;
  });
});