const symbols = ["🍒","🍋","🍊","⭐","💎","🔥"];

const reels = document.querySelectorAll(".reel");
const spinButton = document.querySelector(".spin-button");
const resultText = document.getElementById("result");
const coinsDisplay = document.getElementById("coins");
const bonusBtn = document.getElementById("bonusBtn");

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
let lastBonus = 0;

const spinCost = 50;
const bonusAmount = 200;
const cooldown = 86400000;

/* ADMIN AUTO CREATE */
if (!localStorage.getItem("user_admin")) {
  localStorage.setItem("user_admin", JSON.stringify({
    password: "admin",
    coins: 999999
  }));
}

/* INIT REELS */
reels.forEach(reel => {
  const strip = document.createElement("div");
  strip.classList.add("reel-strip");

  for (let i=0;i<20;i++){
    const s=document.createElement("div");
    s.classList.add("symbol");
    s.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    strip.appendChild(s);
  }

  reel.appendChild(strip);
});

/* AUTH */
signupBtn.onclick=()=>{
  const u=usernameInput.value.trim();
  const p=passwordInput.value.trim();
  if(!u||!p)return;

  if(localStorage.getItem("user_"+u)){
    alert("User exists");return;
  }

  localStorage.setItem("user_"+u,JSON.stringify({
    password:p,
    coins:500,
    lastBonus:0
  }));
};

loginBtn.onclick=()=>{
  const u=usernameInput.value.trim();
  const p=passwordInput.value.trim();

  const data=JSON.parse(localStorage.getItem("user_"+u));
  if(!data||data.password!==p){
    alert("Invalid");return;
  }

  currentUser=u;
  coins=data.coins;
  lastBonus=data.lastBonus||0;

  loginScreen.style.display="none";
  gameScreen.style.display="block";

  updateCoins();
};

logoutBtn.onclick=()=>{
  currentUser=null;
  gameScreen.style.display="none";
  loginScreen.style.display="block";
};

/* BONUS */
bonusBtn.onclick=()=>{
  if(currentUser==="admin")return;

  const now=Date.now();
  if(now-lastBonus>=cooldown){
    coins+=bonusAmount;
    lastBonus=now;
    save();
    updateCoins();
    resultText.textContent="🎁 Bonus claimed!";
  }
};

/* SPIN */
spinButton.onclick=async()=>{
  if(freeSpins===0 && currentUser!=="admin" && coins<spinCost){
    resultText.textContent="No coins";
    return;
  }

  clearHighlights();

  if(freeSpins>0){
    freeSpins--;
  }else if(currentUser!=="admin"){
    coins-=spinCost;
  }

  updateCoins();
  save();

  reels.forEach(r=>r.classList.add("spinning"));
  await delay(1200);
  reels.forEach(r=>r.classList.remove("spinning"));

  let grid=[[],[],[]];
  let scatter=0;

  reels.forEach((reel,col)=>{
    const strip=reel.querySelector(".reel-strip");

    for(let row=0;row<3;row++){
      const rand=symbols[Math.floor(Math.random()*symbols.length)];
      strip.children[row].textContent=rand;
      grid[row][col]=rand;
      if(rand==="🔥")scatter++;
    }
  });

  evaluate(grid,scatter);

  if(freeSpins>0){
    setTimeout(()=>spinButton.click(),800);
  }else{
    multiplier=1;
  }
};

/* GAME */
function evaluate(grid,scatter){
  let win=0;
  let rows=[];

  if(scatter>=3){
    freeSpins+=5;
    resultText.textContent="🔥 FREE SPINS!";
  }

  grid.forEach((r,i)=>{
    const[a,b,c]=r;
    if(a===b&&b===c){
      win+=150;
      rows.push(i);
    }
  });

  if(win>0){
    if(freeSpins>0){
      win*=multiplier;
      multiplier++;
    }

    coins+=win;

    resultText.textContent=`🎉 WIN +${win} (x${multiplier})`;
    resultText.classList.add("win");

    highlight(rows);
  }else{
    resultText.textContent="❌ LOSE";
  }

  save();
  updateCoins();
}

/* HIGHLIGHT */
function highlight(rows){
  rows.forEach(r=>{
    reels.forEach(reel=>{
      reel.querySelectorAll(".symbol")[r].classList.add("win-symbol");
    });
  });

  reels.forEach(r=>r.classList.add("win-reel"));
}

function clearHighlights(){
  document.querySelectorAll(".symbol").forEach(s=>s.classList.remove("win-symbol"));
  reels.forEach(r=>r.classList.remove("win-reel"));
}

/* SAVE */
function save(){
  if(!currentUser)return;

  const data=JSON.parse(localStorage.getItem("user_"+currentUser));
  data.coins=coins;
  data.lastBonus=lastBonus;

  localStorage.setItem("user_"+currentUser,JSON.stringify(data));
}

/* UI */
function updateCoins(){
  coinsDisplay.textContent=coins;
}

function delay(ms){
  return new Promise(r=>setTimeout(r,ms));
}