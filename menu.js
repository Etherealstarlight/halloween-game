import { aBackgroundMusic } from "./audio.js";
import { prepareScene, startGame } from "./game.js";

const eMainDecor = document.getElementsByClassName("main-decor");
const eStartButton = document.getElementById("startButton");

const closeMenu = () => {
  eMainDecor[0].classList.add("hide");
  eMainDecor[1].classList.add("hide");
  eMainDecor[2].classList.add("hide");
  eStartButton.classList.add("d-none");

  const musicVolumeDown = setInterval(() => {
    aBackgroundMusic.volume -= 0.1;
    if (aBackgroundMusic.volume <= 0.15) {
      aBackgroundMusic.volume = 0.15;
      clearInterval(musicVolumeDown);
    }
  }, 100);

  setTimeout(() => {
    eMainDecor[0].classList.add("d-none");
    eMainDecor[0].classList.remove("hide");
    eMainDecor[1].classList.add("d-none");
    eMainDecor[1].classList.remove("hide");
    eMainDecor[2].classList.add("d-none");
    eMainDecor[2].classList.remove("hide");
  }, 1000);
};

export const openMenu = () => {
  eMainDecor[0].classList.remove("d-none");
  eMainDecor[1].classList.remove("d-none");
  eMainDecor[2].classList.remove("d-none");
  eStartButton.classList.remove("d-none");
};

eStartButton.onclick = () => {
  closeMenu();
  prepareScene();
  startGame(aBackgroundMusic);
};

document.addEventListener("contextmenu", (e) => e.preventDefault());

function ctrlShiftKey(e, keyCode) {
  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
}

document.onkeydown = (e) => {
  // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
  if (
    e.keyCode === 123 ||
    ctrlShiftKey(e, "I") ||
    ctrlShiftKey(e, "J") ||
    ctrlShiftKey(e, "C") ||
    (e.ctrlKey && e.keyCode === "U".charCodeAt(0))
  )
    return false;
};
