import { getData, patchData } from "./api.js";

const eTopScoreLoader = document.getElementById("loader");

let scoreStatistic = {};

export const showStatistic = (eTopScoreTable, eSendScoreButton, eNameInput) => {
  eTopScoreLoader.classList.remove("d-none");

  function createDataRow(index, data) {
    return `
            <tr>
              <td>${index}</td>
              <td>${data?.name || "Без имени"}</td>
              <td>${data?.score || 0}</td>
            </tr>
          `;
  }

  getData()
    .then((response) => {
      scoreStatistic = response;
      const sortedScoreStatistic = scoreStatistic.record.scores.sort(
        (a, b) => b.score - a.score
      );

      const eTableBody = eTopScoreTable.getElementsByTagName("tbody")[0];
      while (eTableBody.firstChild) {
        eTableBody.firstChild.remove();
      }
      eTableBody.insertAdjacentHTML(
        "beforeend",
        createDataRow(1, sortedScoreStatistic[0])
      );
      eTableBody.insertAdjacentHTML(
        "beforeend",
        createDataRow(2, sortedScoreStatistic[1])
      );
      eTableBody.insertAdjacentHTML(
        "beforeend",
        createDataRow(3, sortedScoreStatistic[2])
      );

      eTopScoreTable.classList.remove("d-none");
      eNameInput.classList.remove("d-none");
      eSendScoreButton.classList.remove("d-none");
    })
    .catch(() => {
      scoreStatistic = null;
    })
    .finally(() => {
      eTopScoreLoader.classList.add("d-none");
    });
};

export const sendScore = (score, name) => {
  getData().then((response) => {
    scoreStatistic = response;
    if (scoreStatistic) {
      const scoreObject = {
        name: name,
        score: score,
      };

      scoreStatistic.record.scores.push(scoreObject);

      patchData(scoreStatistic.record);
    }
  });
};
