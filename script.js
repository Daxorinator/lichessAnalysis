// Main loop
checkGameStatus()

function checkGameStatus() {
    // For bots we check for the quick analysis button
    document.arrive(".quick-analysis-buttons", () => {
        const analysisButton = document.querySelector(".ui_v5-button-component.ui_v5-button-basic.ui_v5-button-full.quick-analysis-button");
        const isButtonValid = analysisButton?.className === "ui_v5-button-component ui_v5-button-basic ui_v5-button-full quick-analysis-button";
        if (isButtonValid) {
          Arrive.unbindAllArrive();
          injectButton(analysisButton);
          checkGameStatus();
        }
      });

    // For normal games we check for the regular analysis button
    document.arrive(".game-review-buttons-review", () => {
        const analysisButton = document.querySelector(".ui_v5-button-component.ui_v5-button-primary.ui_v5-button-full.game-review-buttons-button")
        if (analysisButton.className == "ui_v5-button-component ui_v5-button-primary ui_v5-button-full game-review-buttons-button"){
            Arrive.unbindAllArrive();
            injectButton(analysisButton);
            checkGameStatus();
        }
    });
}

// Injects a button similar to chess.com's native "Analysis" button 
function injectButton(analysisButton){
    // Duplicate the original button
    const newButton = analysisButton.cloneNode("deep");
    // Style it and link it to the Lichess import function.
    newButton.childNodes[2].innerText = "Lichess Analysis";
    newButton.style.margin = "8px 0px 0px 0px";
    newButton.style.padding = "0px 0px 0px 0px";
    newButton.childNodes[0].classList.remove("icon-font-chess")
    newButton.childNodes[0].classList.add("button-class")
    newButton.classList.add("shine-hope-anim")
    newButton.childNodes[0].style["height"] = "3.805rem";
    newButton.addEventListener('click', () => {
        sendToLichess();
    });
    // Append back into the DOM
    const parentNode = analysisButton.parentNode;
    parentNode.append(newButton);
}

function convertPGNToMoves(pgn) {
    const lines = pgn.split("\n").map((s) => s.trim());

    // Finding index of the empty newline, after that we have our PGN.
    const idx = lines.map(Boolean).indexOf(false);
    const moves = lines.slice(idx + 1).join();

    if (!moves || moves.length === 0) {
      console.error("Invalid PGN input. No moves found.");
      return "";
    }
    return moves
}

// Make request to Lichess through the API (fetch)
function sendToLichess(){
    // 1. Get PGN

    // Get and click download button on chess.com
    const downloadButton = document.getElementsByClassName("icon-font-chess share live-game-buttons-button")[0];
    downloadButton.click();

    // Wait for share tab to pop up
    document.arrive(".share-menu-tab-pgn-textarea", () => {
        Arrive.unbindAllArrive();

        // Get PGN from text Area
        const PGN = document.getElementsByClassName("share-menu-tab-pgn-textarea")[0].value;

        // Exit out of download view (x button)
        document.querySelector("div.icon-font-chess.x.ui_outside-close-icon").click();

        // 2. Open the game in a Lichess analysis tab.
        const importUrl = "https://lichess.org/analysis/pgn"
        window.open(`${importUrl}/${convertPGNToMoves(PGN)}`);
    });
}

// async POST function
async function post(url = '', data = {}) {
    const formBody = [];
    for (const property in data) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody
    });
    return response.json();
}
