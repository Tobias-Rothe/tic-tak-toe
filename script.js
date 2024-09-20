let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'cross'; // Startspieler ist "cross" (X)
let gameActive = true; // Variable zum Überprüfen, ob das Spiel noch aktiv ist
let winningCombination = null; // Speichert die Gewinnkombination

function init() {
    render();
}

function render() {
    let tableHTML = "<table>";

    for (let i = 0; i < 3; i++) {
        tableHTML += "<tr>";
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            const value = fields[index];
            const onclick = value === null && gameActive ? `onclick="makeMove(${index})"` : '';
            tableHTML += `<td ${onclick}>${value ? value : ''}</td>`;
        }
        tableHTML += "</tr>";
    }

    tableHTML += "</table>";
    document.getElementById('content').innerHTML = tableHTML;

    if (winningCombination) {
        drawWinningLine(winningCombination);
    }
}

function makeMove(index) {
    if (fields[index] === null && gameActive) {
        fields[index] = currentPlayer;
        const cell = document.querySelector(`td[onclick="makeMove(${index})"]`);
        if (cell) {
            cell.innerHTML = currentPlayer === 'cross' ? generateAnimatedXSVG() : generateAnimatedCircleSVG();
            cell.removeAttribute('onclick');
        }
        const winner = checkWinner();
        if (winner) {
            winningCombination = getWinningCombination();
            endGame(winner);
            if (winningCombination) {
                drawWinningLine(winningCombination); // Richtig aufrufen
            }
        } else if (fields.every(field => field !== null)) {
            endGame(null);
        } else {
            currentPlayer = currentPlayer === 'cross' ? 'circle' : 'cross';
        }
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return fields[a];
        }
    }
    return null;
}

function getWinningCombination() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combo;
        }
    }
    return null;
}

function drawWinningLine(combo) {
    if (!combo) return;

    removeWinningLine();

    const content = document.getElementById('content');
    const table = content.querySelector('table');

    const cells = table.querySelectorAll('td');
    const [a, b, c] = combo;

    function getCellCenter(index) {
        const cell = cells[index];
        const rect = cell.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - content.getBoundingClientRect().left,
            y: rect.top + rect.height / 2 - content.getBoundingClientRect().top
        };
    }

    const start = getCellCenter(a);
    const end = getCellCenter(c);

    const line = document.createElement('div');
    line.className = 'winner-line';
    line.style.position = 'absolute';
    line.style.backgroundColor = 'red';
    line.style.zIndex = '10';

    // Berechnung der Linie
    const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;

    line.style.width = `${length}px`;
    line.style.height = '5px'; // Höhe der Linie auf 5px setzen
    line.style.top = `${Math.min(start.y, end.y)}px`;
    line.style.left = `${Math.min(start.x, end.x)}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = 'top left';

    content.appendChild(line);
}

function removeWinningLine() {
    const existingLine = document.querySelector('.winner-line');
    if (existingLine) {
        existingLine.remove();
    }
}

function endGame(winner) {
    gameActive = false;
    setTimeout(() => {
        const winnerMessage = document.getElementById('winner-message');
        if (winnerMessage) {
            winnerMessage.innerHTML = winner ? `${winner} hat gewonnen!` : "Unentschieden!";
            winnerMessage.innerHTML += '<br><button onclick="restartGame()">Neues Spiel starten</button>';
        }
    }, 200);
}

function restartGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    currentPlayer = 'cross'; // Setze den Startspieler zurück auf "cross"
    gameActive = true; // Aktivere das Spiel wieder
    winningCombination = null; // Setze die Gewinnkombination zurück
    removeWinningLine(); // Entferne eventuell vorhandene Gewinnlinien
    render(); // Render die Tabelle neu
    const winnerMessage = document.getElementById('winner-message');
    if (winnerMessage) {
        winnerMessage.innerHTML = ''; // Leere die Gewinnernachricht
    }
}

function generateAnimatedCircleSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    @keyframes fillAnimation {
                        0% { stroke-dasharray: 0, 188.4; }
                        100% { stroke-dasharray: 188.4, 0; }
                    }
                    .animated-circle {
                        fill: none;
                        stroke: #00B0EF;
                        stroke-width: 5;
                        stroke-dasharray: 188.4;
                        animation: fillAnimation 500ms forwards;
                    }
                </style>
            </defs>
            <circle cx="35" cy="35" r="30" class="animated-circle" />
        </svg>
    `;
}

function generateAnimatedXSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    @keyframes drawLine {
                        0% { stroke-dasharray: 0, 70; }
                        100% { stroke-dasharray: 70, 0; }
                    }
                    .x-line {
                        fill: none;
                        stroke: #FFC000;
                        stroke-width: 5;
                        stroke-dasharray: 70;
                        animation: drawLine 1250ms forwards;
                    }
                    .x-line:nth-of-type(1) { animation-delay: 250ms; }
                </style>
            </defs>
            <line x1="20" y1="20" x2="50" y2="50" class="x-line" />
            <line x1="50" y1="20" x2="20" y2="50" class="x-line" />
        </svg>
    `;
}

document.addEventListener('DOMContentLoaded', init);
