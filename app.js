// Constants
const MIN_INTERVAL = 2000;
const MAX_INTERVAL = 20000;
const SAD_INTERVAL = 500;
const HUNGRY_INTERVAL = 2000;
const WINNING_SCORE = 100;

// DOM Elements
const wormContainer = document.querySelector(".worm-container");
const bgElement = document.querySelector(".bg");
const winElement = document.querySelector(".win");

// Game Variables
let score = 0;

// Utility Functions
const getInterval = () =>
  Date.now() + MIN_INTERVAL + Math.floor(Math.random() * MAX_INTERVAL);
const getSadInterval = () => Date.now() + SAD_INTERVAL;
const getHungryInterval = () => Date.now() + HUNGRY_INTERVAL;
const getKingStatus = () => Math.random() > 0.9;

// Mole Initialization
const moles = Array.from({ length: 10 }, (_, id) => ({
  status: "sad",
  next: getSadInterval(),
  king: getKingStatus(),
  node: document.getElementById(`hole-${id}`),
}));

// Mole Status Management
const updateMoleStatus = (mole) => {
  switch (mole.status) {
    case "sad":
    case "fed":
      setMoleLeaving(mole);
      break;
    case "leaving":
      setMoleGone(mole);
      break;
    case "hungry":
      setMoleSad(mole);
      break;
    case "gone":
      setMoleHungry(mole);
      break;
  }
};

const setMoleLeaving = (mole) => {
  mole.next = getSadInterval();
  mole.node.children[0].src = mole.king
    ? "./images/king-mole-leaving.png"
    : "./images/mole-leaving.png";
  mole.status = "leaving";
};

const setMoleGone = (mole) => {
  mole.next = getInterval();
  mole.king = false;
  mole.node.children[0].classList.add("gone");
  mole.status = "gone";
};

const setMoleSad = (mole) => {
  mole.node.children[0].classList.remove("hungry");
  mole.node.children[0].src = mole.king
    ? "./images/king-mole-sad.png"
    : "./images/mole-sad.png";
  mole.status = "sad";
  mole.next = getSadInterval();
};

const setMoleHungry = (mole) => {
  mole.status = "hungry";
  mole.king = getKingStatus();
  mole.next = getHungryInterval();
  mole.node.children[0].classList.add("hungry");
  mole.node.children[0].classList.remove("gone");
  mole.node.children[0].src = mole.king
    ? "./images/king-mole-hungry.png"
    : "./images/mole-hungry.png";
};

// Event Handlers
const feedMole = (event) => {
  if (
    event.target.tagName !== "IMG" ||
    !event.target.classList.contains("hungry")
  ) {
    return;
  }

  const mole = moles[+event.target.dataset.index];
  mole.status = "fed";
  mole.next = getSadInterval();
  mole.node.children[0].classList.remove("hungry");
  mole.node.children[0].src = mole.king
    ? "./images/king-mole-fed.png"
    : "./images/mole-fed.png";
  score += mole.king ? 20 : 10;

  if (score >= WINNING_SCORE) {
    showWinScreen();
  } else {
    updateWormMeter();
  }
};

// UI Updates
const updateWormMeter = () => {
  wormContainer.style.width = `${(score / WINNING_SCORE) * 100}%`;
};

const showWinScreen = () => {
  bgElement.classList.add("hide");
  winElement.classList.add("show");
};

// Animation Frame Loop
const nextFrame = () => {
  const now = Date.now();
  moles.forEach((mole) => {
    if (mole.next < now) {
      updateMoleStatus(mole);
    }
  });
  requestAnimationFrame(nextFrame);
};

// Event Listeners
bgElement.addEventListener("click", feedMole);

// Start the Game
requestAnimationFrame(nextFrame);
updateWormMeter();
