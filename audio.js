const eAudioButton = document.getElementById("audioButton");
const eAudioButtonCross = document.getElementById("audioButtonCross");

export const aBackgroundMusic = document.getElementById("backgroundMusic");

aBackgroundMusic.volume = 0.35;

eAudioButton.onclick = () => {
  if (eAudioButtonCross.classList.contains("d-none")) {
    eAudioButtonCross.classList.remove("d-none");
    aBackgroundMusic.pause();
  } else {
    eAudioButtonCross.classList.add("d-none");
    aBackgroundMusic.play();
  }
};
