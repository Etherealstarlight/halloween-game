import {
  MODEL_TYPES,
  MOVE_TYPES,
  GAME_LEVELS,
  CHARACTER_MESSAGES,
} from "./enums.js";
import { sendScore, showStatistic } from "./statistic.js";
import { openMenu } from "./menu.js";

class GameObject {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.moving = data.moving;
    this.sprite = data.sprite;
    this.speech = data.speech;
    this.sound = data.sound;
  }
}

const GAME_TIME = 30000;
const TIME_BONUS = 1000;

const eGameContainer = document.getElementById("gameContainer");
const eGameTimer = document.getElementById("timer");
const eGameScore = document.getElementById("score");
const eGameWrapper = document.getElementById("gameWrapper");
const eGameDecor = document.getElementsByClassName("game-decor");
const eStatsWrapper = document.getElementById("statsWrapper");
const eTopScoreTable = document.getElementById("topScoreTable");
const eNameInput = document.getElementById("name");
const eSendScoreButton = document.getElementById("sendScore");

let currentGameState = {
  started: null,
  timer: null,
  time: GAME_TIME,
  finished: null,
  score: 0,
  characters: [],
  charactersBirth: null,
  level: "easy",
};

let eTimerValueUpdateInterval = null;

const changeScore = (clickedCharacter) => {
  switch (clickedCharacter.type) {
    case MODEL_TYPES[1]:
      currentGameState.score += 15;
      break;
    case MODEL_TYPES[2]:
      currentGameState.score -= 35;
      break;
    case MODEL_TYPES[3]:
      currentGameState.time += TIME_BONUS;
      clearTimeout(currentGameState.timer);
      currentGameState.timer = setTimeout(() => {
        finishGame();
      }, currentGameState.time - Math.ceil(Date.now() - currentGameState.started) + TIME_BONUS);
      break;
  }

  if (currentGameState.score > 50) currentGameState.level = "normal";
  if (currentGameState.score > 100) currentGameState.level = "hard";
  if (currentGameState.score > 150) currentGameState.level = "extrahard";

  eGameScore.textContent = currentGameState.score;
};

const setETimerValueUpdateHandler = () => {
  if (eTimerValueUpdateInterval) clearInterval(eTimerValueUpdateInterval);

  eTimerValueUpdateInterval = setInterval(() => {
    const timeLeft =
      currentGameState.time / 1000 -
      Math.floor((Date.now() - currentGameState.started) / 1000);
    eGameTimer.textContent = timeLeft;

    if (timeLeft <= 0) clearInterval(eTimerValueUpdateInterval);
  }, 1000);
};

const createNewCharacterData = () => {
  const result = {};

  result.id = new Date().getTime();
  result.type = MODEL_TYPES[Math.round(Math.random() * (3 - 1)) + 1];

  switch (result.type) {
    case MODEL_TYPES[1]:
      result.sprite = `assets/image/s_enemy_0${
        Math.round(Math.random() * (5 - 1)) + 1
      }.svg`;
      result.moving = MOVE_TYPES[Math.round(Math.random() * (3 - 0)) + 0];
      result.sound = new Audio("assets/sound/click_01.mp3");
      break;
    case MODEL_TYPES[2]:
      result.sprite = `assets/image/s_character_0${
        Math.round(Math.random() * (5 - 0)) + 0
      }.png`;
      result.moving = MOVE_TYPES[Math.round(Math.random() * (3 - 0)) + 0];
      result.speech =
        CHARACTER_MESSAGES[Math.round(Math.random() * (15 - 0)) + 0];
      result.sound = new Audio("assets/sound/click_02.mp3");
      break;
    case MODEL_TYPES[3]:
      result.sprite = `assets/image/s_time_0${
        Math.round(Math.random() * (5 - 1)) + 1
      }.svg`;
      result.moving = MOVE_TYPES[Math.round(Math.random() * (1 - 0)) + 0];
      result.sound = new Audio("assets/sound/click_01.mp3");
      break;
  }

  return result;
};

const createNewCharacterElement = (newCharacterData) => {
  const e = document.createElement("div");
  e.style.width = "10%";
  e.src = newCharacterData.sprite;
  e.style.position = "absolute";
  e.style.left = `${Math.random() * (85 - 5) + 5}%`;
  e.style.top = `${Math.random() * (75 - 5) + 5}%`;

  const img = document.createElement("img");
  img.style.width = "100%";
  img.src = newCharacterData.sprite;
  img.draggable = false;

  e.classList.add("character");
  e.classList.add(newCharacterData.moving);

  e.appendChild(img);

  if (newCharacterData.type === MODEL_TYPES[2])
    e.appendChild(createMessageElement(newCharacterData));

  if (newCharacterData.type === MODEL_TYPES[3])
    e.appendChild(createTimerMessageElement());

  return e;
};

const createMessageElement = (newCharacterData) => {
  const e = document.createElement("div");
  e.textContent = newCharacterData.speech;
  e.style.whiteSpace = "nowrap";
  e.style.position = "absolute";
  e.style.right = "-50%";
  e.style.top = "-15%";
  e.style.background = "white";
  e.style.borderRadius = "4px";
  e.style.border = "1px solid grey";

  e.classList.add("d-none");
  e.classList.add("message");
  e.classList.add("label");

  return e;
};

const createTimerMessageElement = () => {
  const e = document.createElement("div");
  e.textContent = `+${TIME_BONUS / 1000}s`;
  e.style.color = "darkorange";

  e.classList.add("d-none");
  e.classList.add("label");

  return e;
};

const setNewGameCharacter = () => {
  const newCharacter = new GameObject(createNewCharacterData());
  currentGameState.characters.push(newCharacter);

  const eCharacter = createNewCharacterElement(newCharacter);
  eGameContainer.appendChild(eCharacter);

  function removeCharacter(immediate = false) {
    eCharacter.classList.add("removed");
    if (immediate) {
      if (newCharacter.type === MODEL_TYPES[2]) {
        eCharacter.style.animation = "unset";
        eCharacter.lastChild.classList.remove("d-none");
        setTimeout(() => {
          eCharacter.remove();
        }, 1000);
      } else if (newCharacter.type === MODEL_TYPES[3]) {
        eCharacter.style.animation = "unset";
        eCharacter.firstChild.remove();
        eCharacter.lastChild.classList.remove("d-none");
        setTimeout(() => {
          eCharacter.remove();
        }, 1000);
      } else eCharacter.remove();
    } else {
      setTimeout(() => {
        eCharacter.remove();
        currentGameState.characters = currentGameState.characters.filter(
          (character) => character.id !== newCharacter.id
        );
      }, 500);
    }
  }

  const characterLive = setTimeout(() => {
    removeCharacter();
  }, GAME_LEVELS[currentGameState.level]);

  eCharacter.onclick = () => {
    eCharacter.onclick = null;
    removeCharacter(true);
    changeScore(newCharacter);
    newCharacter.sound.play();
    clearTimeout(characterLive);
  };
};

const finishGame = (aBackgroundMusic) => {
  while (eGameContainer.firstChild) {
    eGameContainer.removeChild(eGameContainer.lastChild);
  }
  clearInterval(currentGameState.charactersBirth);
  currentGameState.characters = [];
  currentGameState.finished = new Date();

  const musicVolumeUp = setInterval(() => {
    aBackgroundMusic.volume += 0.1;
    if (aBackgroundMusic.volume >= 0.35) {
      aBackgroundMusic.volume = 0.35;
      clearInterval(musicVolumeUp);
    }
  }, 100);

  showStatistic(eTopScoreTable, eSendScoreButton, eNameInput);
};

const unMountScene = () => {
  eGameWrapper.classList.add("hide");
  eGameDecor[0].classList.add("hide");
  eStatsWrapper.classList.add("hide");

  return new Promise((resolve) =>
    setTimeout(() => {
      eGameWrapper.classList.add("d-none");
      eGameWrapper.classList.remove("hide");
      eGameDecor[0].classList.add("d-none");
      eGameDecor[0].classList.remove("hide");
      eGameDecor[1].classList.add("d-none");
      eStatsWrapper.classList.add("d-none");
      eStatsWrapper.classList.remove("hide");
      eTopScoreTable.classList.add("d-none");
      eNameInput.classList.add("d-none");
      eSendScoreButton.classList.add("d-none");

      resolve();
    }, 1000)
  );
};

export const prepareScene = () => {
  eGameDecor[0].classList.remove("d-none");
  eGameDecor[1].classList.remove("d-none");
  eGameDecor[1].classList.add("show");
  eGameWrapper.classList.remove("d-none");
  eGameWrapper.classList.add("show");
  eStatsWrapper.classList.remove("d-none");
};

export const startGame = (aBackgroundMusic) => {
  if (currentGameState.started && !currentGameState.finished) finishGame();

  currentGameState.score = 0;
  currentGameState.level = "easy";
  currentGameState.finished = null;
  currentGameState.time = GAME_TIME;

  eGameScore.textContent = currentGameState.score;
  eGameTimer.textContent = GAME_TIME / 1000;

  setTimeout(() => {
    currentGameState.started = new Date();

    currentGameState.charactersBirth = setInterval(() => {
      setNewGameCharacter();
    }, 500);

    setETimerValueUpdateHandler();

    currentGameState.timer = setTimeout(() => {
      finishGame(aBackgroundMusic, eSendScoreButton);
    }, GAME_TIME);
  }, 1000);
};

eSendScoreButton.onclick = () => {
  unMountScene().then(() => {
    openMenu();
  });
  sendScore(currentGameState.score, eNameInput.value);
};
