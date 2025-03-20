const chessboard = document.getElementById('chessboard');
const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let selectedPiece = null;
const capturedWhite = [];
const capturedBlack = [];
const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
let currentPlayer = 'white';
let whiteTime = 600;
let blackTime = 600;
let timerInterval;

// Game statistics
let gamesPlayed = 0, wins = 0, losses = 0, draws = 0;

// --- Game mode & AI difficulty ---
let gameMode = ''; // "ai" or "human"
let aiDifficulty = '';

// --- Mode selection ---
document.getElementById('mode-ai').addEventListener('click', () => {
    gameMode = 'ai';
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('difficulty-selection').style.display = 'block';
});
document.getElementById('mode-human').addEventListener('click', () => {
    gameMode = 'human';
    document.getElementById('main-menu').style.display = 'none';
    startGame();
});

// --- AI difficulty selection using buttons ---
document.querySelectorAll('#difficulty-selection button').forEach(button => {
    button.addEventListener('click', () => {
        aiDifficulty = button.dataset.difficulty;
        document.getElementById('difficulty-selection').style.display = 'none';
        startGame();
    });
});

function startGame() {
    resetTimer();
    createBoard();
    updateCapturedPieces();
    updateProgressBar();
    startTimer();
}

// --- Timer functions ---
function startTimer() {
    timerInterval = setInterval(() => {
        if (currentPlayer === 'white') {
            whiteTime--;
            if (whiteTime <= 0) {
                alert('Temps écoulé pour les blancs !');
                endGame('black');
                return;
            }
        } else {
            blackTime--;
            if (blackTime <= 0) {
                alert('Temps écoulé pour les noirs !');
                endGame('white');
                return;
            }
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('white-time').textContent = formatTime(whiteTime);
    document.getElementById('black-time').textContent = formatTime(blackTime);
}

function resetTimer() {
    whiteTime = 600;
    blackTime = 600;
    clearInterval(timerInterval);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- Statistics update ---
function updateStatistics() {
    document.getElementById('games-played').textContent = gamesPlayed;
    document.getElementById('wins').textContent = wins;
    document.getElementById('losses').textContent = losses;
    document.getElementById('draws').textContent = draws;
}

function endGame(winner) {
    gamesPlayed++;
    if (winner === 'white') wins++;
    else if (winner === 'black') losses++;
    else draws++;
    updateStatistics();
    clearInterval(timerInterval);
    alert(`Partie terminée. Gagnant: ${winner}`);
    // Optionnel : recharger la page ou permettre de rejouer
}

// --- AI functions ---
function getAllPossibleMoves(color) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = initialBoard[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === color) {
                const possible = getPossibleMoves(piece, r, c);
                possible.forEach(move => {
                    moves.push({
                        from: { row: r, col: c },
                        to: { row: move[0], col: move[1] },
                        piece: piece
                    });
                });
            }
        }
    }
    return moves;
}

function evaluateMove(move) {
    const target = initialBoard[move.to.row][move.to.col];
    return target ? (pieceValues[target.toLowerCase()] || 0) : 0;
}

function aiMakeMove() {
    setTimeout(() => {
        const moves = getAllPossibleMoves('black');
        if (moves.length === 0) {
            alert('Match nul ! L’IA ne peut plus jouer.');
            clearInterval(timerInterval);
            return;
        }
        let chosenMove;
        const difficulty = aiDifficulty.toLowerCase();
        if (difficulty === 'noob') {
            chosenMove = moves[Math.floor(Math.random() * moves.length)];
        } else if (difficulty === 'easy') {
            const captureMoves = moves.filter(m => evaluateMove(m) > 0);
            chosenMove = (captureMoves.length > 0 && Math.random() < 0.5)
                         ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
                         : moves[Math.floor(Math.random() * moves.length)];
        } else if (difficulty === 'regular') {
            chosenMove = moves[Math.floor(Math.random() * moves.length)];
        } else if (difficulty === 'hard' || difficulty === 'magnus carlsen' || difficulty === 'unbeatable') {
            let bestValue = -1, bestMoves = [];
            moves.forEach(m => {
                const val = evaluateMove(m);
                if (val > bestValue) {
                    bestValue = val;
                    bestMoves = [m];
                } else if (val === bestValue) bestMoves.push(m);
            });
            chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        } else {
            chosenMove = moves[Math.floor(Math.random() * moves.length)];
        }

        const fromRow = chosenMove.from.row;
        const fromCol = chosenMove.from.col;
        const toRow = chosenMove.to.row;
        const toCol = chosenMove.to.col;
        
        if (initialBoard[toRow][toCol] === 'K' || initialBoard[toRow][toCol] === 'k') {
            alert('Partie terminée ! Le roi a été capturé par l’IA.');
            endGame('black');
            return;
        }
        if (initialBoard[toRow][toCol]) {
            const capturedPiece = initialBoard[toRow][toCol];
            if (capturedPiece === capturedPiece.toUpperCase())
                capturedBlack.push(capturedPiece.toLowerCase());
            else
                capturedWhite.push(capturedPiece.toUpperCase());
        }
        initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
        initialBoard[fromRow][fromCol] = '';

        if (initialBoard[toRow][toCol].toLowerCase() === 'p' && toRow === 7) {
            initialBoard[toRow][toCol] = 'q';
        }

        createBoard();
        updateCapturedPieces();
        updateProgressBar();
        if (isKingInCheck('white')) alert('Échec au roi blanc !');
        currentPlayer = 'white';
    }, 500);
}

// --- Board creation & game logic ---
function createBoard() {
    chessboard.innerHTML = '';
    initialBoard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = rowIndex;
            square.dataset.col = colIndex;
            if (piece) square.textContent = pieces[piece];
            square.addEventListener('click', handleSquareClick);
            chessboard.appendChild(square);
        });
    });
}

function getPossibleMoves(piece, row, col) {
    const moves = [];
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    switch (piece.toLowerCase()) {
        case 'p': {
            const direction = color === 'white' ? -1 : 1;
            const startRow = color === 'white' ? 6 : 1;
            if (row + direction >= 0 && row + direction < 8 && !initialBoard[row + direction][col]) {
                moves.push([row + direction, col]);
                if (row === startRow && !initialBoard[row + 2 * direction][col]) {
                    moves.push([row + 2 * direction, col]);
                }
            }
            if (col > 0 && row + direction >= 0 && row + direction < 8) {
                const leftPiece = initialBoard[row + direction][col - 1];
                if (leftPiece && (leftPiece.toUpperCase() === leftPiece ? 'white' : 'black') !== color) {
                    moves.push([row + direction, col - 1]);
                }
            }
            if (col < 7 && row + direction >= 0 && row + direction < 8) {
                const rightPiece = initialBoard[row + direction][col + 1];
                if (rightPiece && (rightPiece.toUpperCase() === rightPiece ? 'white' : 'black') !== color) {
                    moves.push([row + direction, col + 1]);
                }
            }
            break;
        }
        case 'r': {
            for (let d of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row + d[0] * i, c = col + d[1] * i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!initialBoard[r][c]) moves.push([r, c]);
                    else {
                        if ((initialBoard[r][c].toUpperCase() === initialBoard[r][c] ? 'white' : 'black') !== color) moves.push([r, c]);
                        break;
                    }
                }
            }
            break;
        }
        case 'n': {
            const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
            for (let m of knightMoves) {
                const r = row + m[0], c = col + m[1];
                if (r >= 0 && r < 8 && c >= 0 && c < 8 &&
                    (!initialBoard[r][c] || (initialBoard[r][c].toUpperCase() === initialBoard[r][c] ? 'white' : 'black') !== color))
                    moves.push([r, c]);
            }
            break;
        }
        case 'b': {
            for (let d of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row + d[0] * i, c = col + d[1] * i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!initialBoard[r][c]) moves.push([r, c]);
                    else {
                        if ((initialBoard[r][c].toUpperCase() === initialBoard[r][c] ? 'white' : 'black') !== color)
                            moves.push([r, c]);
                        break;
                    }
                }
            }
            break;
        }
        case 'q': {
            for (let d of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row + d[0] * i, c = col + d[1] * i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!initialBoard[r][c]) moves.push([r, c]);
                    else {
                        if ((initialBoard[r][c].toUpperCase() === initialBoard[r][c] ? 'white' : 'black') !== color)
                            moves.push([r, c]);
                        break;
                    }
                }
            }
            break;
        }
        case 'k': {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const r = row + dr, c = col + dc;
                    if (r >= 0 && r < 8 && c >= 0 && c < 8 &&
                        (!initialBoard[r][c] || (initialBoard[r][c].toUpperCase() === initialBoard[r][c] ? 'white' : 'black') !== color))
                        moves.push([r, c]);
                }
            }
            break;
        }
    }
    return moves;
}

function highlightMoves(moves) {
    document.querySelectorAll('.square').forEach(square => square.classList.remove('highlight'));
    moves.forEach(([r, c]) => {
        document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`).classList.add('highlight');
    });
}

function handleSquareClick(event) {
    const square = event.target;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const piece = initialBoard[row][col];

    if (selectedPiece) {
        const fromRow = parseInt(selectedPiece.dataset.row);
        const fromCol = parseInt(selectedPiece.dataset.col);
        const moves = getPossibleMoves(initialBoard[fromRow][fromCol], fromRow, fromCol);
        if (moves.some(([r, c]) => r === row && c === col)) {
            if (initialBoard[row][col] === 'k' || initialBoard[row][col] === 'K') {
                alert('Partie terminée ! Le roi a été capturé.');
                endGame(currentPlayer === 'white' ? 'white' : 'black');
                return;
            }
            if (initialBoard[row][col]) {
                const capturedPiece = initialBoard[row][col];
                if (capturedPiece === capturedPiece.toUpperCase())
                    capturedBlack.push(capturedPiece.toLowerCase());
                else
                    capturedWhite.push(capturedPiece.toUpperCase());
            }
            initialBoard[row][col] = initialBoard[fromRow][fromCol];
            initialBoard[fromRow][fromCol] = '';

            // Promotion du pion
            if (initialBoard[row][col].toLowerCase() === 'p' && (row === 0 || row === 7)) {
                const promotionChoice = prompt('Promouvoir le pion en : q (reine), r (tour), n (cavalier), b (fou)').toLowerCase();
                const validChoices = ['q', 'r', 'n', 'b'];
                initialBoard[row][col] = validChoices.includes(promotionChoice)
                                            ? (currentPlayer === 'white' ? promotionChoice.toUpperCase() : promotionChoice)
                                            : (currentPlayer === 'white' ? 'Q' : 'q');
            }

            createBoard();
            updateCapturedPieces();
            updateProgressBar();
            if (isKingInCheck('white')) alert('Échec au roi blanc !');
            else if (isKingInCheck('black')) alert('Échec au roi noir !');
            currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
            selectedPiece = null;
            highlightMoves([]);
            // En mode IA, lance le coup de l'IA après le tour blanc.
            if (gameMode === 'ai' && currentPlayer === 'black') {
                aiMakeMove();
            }
            return;
        }
        selectedPiece = null;
        highlightMoves([]);
    } else if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === currentPlayer) {
        selectedPiece = square;
        const moves = getPossibleMoves(piece, row, col);
        highlightMoves(moves);
    }
}

function updateCapturedPieces() {
    document.getElementById('captured-white').innerHTML = capturedWhite.map(piece => pieces[piece.toLowerCase()]).join(' ');
    document.getElementById('captured-black').innerHTML = capturedBlack.map(piece => pieces[piece.toLowerCase()]).join(' ');
}

function updateProgressBar() {
    const whiteScore = capturedBlack.reduce((sum, piece) => sum + (pieceValues[piece] || 0), 0);
    const blackScore = capturedWhite.reduce((sum, piece) => sum + (pieceValues[piece.toLowerCase()] || 0), 0);
    const totalScore = whiteScore + blackScore || 1;
    const whitePercentage = (whiteScore / totalScore) * 100;
    const blackPercentage = (blackScore / totalScore) * 100;
    document.getElementById('white-progress').style.width = `${whitePercentage}%`;
    document.getElementById('black-progress').style.width = `${blackPercentage}%`;
}

function isKingInCheck(color) {
    let kingPos;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (initialBoard[r][c] === (color === 'white' ? 'K' : 'k')) {
                kingPos = [r, c];
                break;
            }
        }
    }
    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = initialBoard[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === opponentColor) {
                const moves = getPossibleMoves(piece, r, c);
                if (moves.some(([mr, mc]) => kingPos && mr === kingPos[0] && mc === kingPos[1])) {
                    return true;
                }
            }
        }
    }
    return false;
}

createBoard();
updateCapturedPieces();
updateProgressBar();
updateStatistics();