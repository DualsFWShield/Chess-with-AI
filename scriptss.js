// --- Premium evaluation: valeurs des pièces et valeurs positionnelles ---
const pieceValuesGlobal = { 'p': 1, 'n': 3, 'b': 3.25, 'r': 5, 'q': 9, 'k': 100 };

const positionValues = {
    'p': [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
        [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
        [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
        [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
        [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
        [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    ],
    'n': [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
        [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
        [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
        [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
        [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
        [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ],
    'b': [
        [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
        [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
        [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
        [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
        [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
        [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
        [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
        [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
    ],
    'r': [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
    ],
    'q': [
        [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
        [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
        [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
        [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
        [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
        [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
        [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
        [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
    ],
    'k': [
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
        [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
        [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
        [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
    ],
    'k_endgame': [
        [-5.0, -4.0, -3.0, -2.0, -2.0, -3.0, -4.0, -5.0],
        [-3.0, -2.0, -1.0, 0.0, 0.0, -1.0, -2.0, -3.0],
        [-3.0, -1.0, 2.0, 3.0, 3.0, 2.0, -1.0, -3.0],
        [-3.0, -1.0, 3.0, 4.0, 4.0, 3.0, -1.0, -3.0],
        [-3.0, -1.0, 3.0, 4.0, 4.0, 3.0, -1.0, -3.0],
        [-3.0, -1.0, 2.0, 3.0, 3.0, 2.0, -1.0, -3.0],
        [-3.0, -3.0, 0.0, 0.0, 0.0, 0.0, -3.0, -3.0],
        [-5.0, -3.0, -3.0, -3.0, -3.0, -3.0, -3.0, -5.0]
    ]
};

// --- Global Elements & Board Initialization ---
const chessboard = document.getElementById('chessboard');
const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

let initialBoard = [
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
// Note: pieceValues used in board evaluation (minimax etc.) uses our premium values below:
const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };

let currentPlayer = 'white';
let whiteTime = 600;
let blackTime = 600;
let timerInterval;

// --- Game Statistics ---
let gamesPlayed = 0, wins = 0, losses = 0, draws = 0;

// --- Game Mode & AI Difficulty ---
let gameMode = ''; // "ai" or "human"
let aiDifficulty = '';

// --- Mode Selection ---
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

// --- AI Difficulty Selection ---
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
    updateStatistics();
    startTimer();
}

function createBoard() {
    chessboard.innerHTML = '';
    initialBoard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = rowIndex;
            square.dataset.col = colIndex;
            if (piece) {
                square.textContent = pieces[piece];
            }
            square.addEventListener('click', handleSquareClick);
            chessboard.appendChild(square);
        });
    });
}

// --- Timer Functions ---
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

// --- Statistics Functions ---
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
    // Optionnel: recharger la page ou permettre de rejouer.
}

// --- Board Evaluation Functions ---
function isEndgame(board) {
    let pieceCount = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] && board[r][c].toLowerCase() !== 'k') {
                pieceCount++;
            }
        }
    }
    return pieceCount <= 10;
}

function evaluateBoard(board, color) {
    let score = 0;
    const endgame = isEndgame(board);
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (!piece) continue;
            const pieceColor = piece === piece.toUpperCase() ? 'white' : 'black';
            const pieceType = piece.toLowerCase();
            const baseValue = pieceValuesGlobal[pieceType] || 0;
            let posValue = 0;
            if (pieceType in positionValues) {
                if (pieceType === 'k' && endgame) {
                    posValue = pieceColor === 'white'
                        ? positionValues['k_endgame'][r][c]
                        : positionValues['k_endgame'][7 - r][c];
                } else {
                    posValue = pieceColor === 'white'
                        ? positionValues[pieceType][r][c]
                        : positionValues[pieceType][7 - r][c];
                }
            }
            const totalValue = baseValue + (posValue * 0.1);
            score += (pieceColor === color ? totalValue : -totalValue);
        }
    }
    return score;
}

// --- Minimax with Alpha-Beta Pruning ---
function minimax(board, depth, alpha, beta, maximizingPlayer, color) {
    const opponent = color === 'white' ? 'black' : 'white';
    if (depth === 0) {
        return evaluateBoard(board, color);
    }
    function cloneBoard(board) {
        return board.map(row => [...row]);
    }
    function makeMove(board, fromRow, fromCol, toRow, toCol) {
        const newBoard = cloneBoard(board);
        newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = '';
        if (newBoard[toRow][toCol].toLowerCase() === 'p' && (toRow === 0 || toRow === 7)) {
            newBoard[toRow][toCol] = maximizingPlayer ? 'q' : 'Q';
        }
        return newBoard;
    }
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        const moves = getAllPossibleMoves(board, color);
        for (const move of moves) {
            const newBoard = makeMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
            const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, color);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        const moves = getAllPossibleMoves(board, opponent);
        for (const move of moves) {
            const newBoard = makeMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
            const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, color);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

// --- Move Generation Functions ---
// Now functions take a board parameter for consistency.
function getAllPossibleMoves(board, color) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === color) {
                const possible = getPossibleMoves(board, piece, r, c);
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

function getPossibleMoves(board, piece, row, col) {
    const moves = [];
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    switch (piece.toLowerCase()) {
        case 'p': {
            const direction = color === 'white' ? -1 : 1;
            const startRow = color === 'white' ? 6 : 1;
            if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
                moves.push([row + direction, col]);
                if (row === startRow && !board[row + 2 * direction][col]) {
                    moves.push([row + 2 * direction, col]);
                }
            }
            if (col > 0 && row + direction >= 0 && row + direction < 8) {
                const leftPiece = board[row + direction][col - 1];
                if (leftPiece && (leftPiece === leftPiece.toUpperCase() ? 'white' : 'black') !== color) {
                    moves.push([row + direction, col - 1]);
                }
            }
            if (col < 7 && row + direction >= 0 && row + direction < 8) {
                const rightPiece = board[row + direction][col + 1];
                if (rightPiece && (rightPiece === rightPiece.toUpperCase() ? 'white' : 'black') !== color) {
                    moves.push([row + direction, col + 1]);
                }
            }
            break;
        }
        case 'r': {
            for (let d of [[-1,0],[1,0],[0,-1],[0,1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row + d[0]*i, c = col + d[1]*i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color)
                            moves.push([r, c]);
                        break;
                    }
                }
            }
            break;
        }
        case 'n': {
            const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
            for (let m of knightMoves) {
                const r = row + m[0], c = col + m[1];
                if (r >= 0 && r < 8 && c >= 0 && c < 8 &&
                    (!board[r][c] || (board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color))
                    moves.push([r, c]);
            }
            break;
        }
        case 'b': {
            for (let d of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row + d[0]*i, c = col + d[1]*i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color)
                            moves.push([r, c]);
                        break;
                    }
                }
            }
            break;
        }
        case 'q': {
            for (let d of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row+d[0]*i, c = col+d[1]*i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color)
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
                        (!board[r][c] || (board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color))
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
        const sq = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
        if (sq) sq.classList.add('highlight');
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
        const moves = getPossibleMoves(initialBoard, initialBoard[fromRow][fromCol], fromRow, fromCol);
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
            if (initialBoard[row][col].toLowerCase() === 'p' && (row === 0 || row === 7)) {
                const promotionChoice = prompt('Promouvoir le pion en: q (reine), r (tour), n (cavalier), b (fou)').toLowerCase();
                const validChoices = ['q','r','n','b'];
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
            if (gameMode === 'ai' && currentPlayer === 'black') {
                aiMakeMove();
            }
            return;
        }
        selectedPiece = null;
        highlightMoves([]);
    } else if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === currentPlayer) {
        selectedPiece = square;
        const moves = getPossibleMoves(initialBoard, piece, row, col);
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
    document.getElementById('white-progress').style.width = `${(whiteScore/totalScore)*100}%`;
    document.getElementById('// filepath: c:\Users\Toyger\OneDrive\Projects51c\Chess with AI\script.js');

// --- Premium evaluation: valeurs des pièces et valeurs positionnelles ---
const pieceValuesGlobal = { 'p': 1, 'n': 3, 'b': 3.25, 'r': 5, 'q': 9, 'k': 100 };

const positionValues = {
    'p': [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
        [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
        [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
        [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
        [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
        [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    ],
    'n': [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
        [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
        [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
        [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
        [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
        [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ],
    'b': [
        [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
        [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
        [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
        [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
        [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
        [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
        [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
        [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
    ],
    'r': [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
        [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
    ],
    'q': [
        [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
        [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
        [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
        [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
        [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
        [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
        [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
        [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
    ],
    'k': [
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
        [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
        [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
        [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
    ],
    'k_endgame': [
        [-5.0, -4.0, -3.0, -2.0, -2.0, -3.0, -4.0, -5.0],
        [-3.0, -2.0, -1.0, 0.0, 0.0, -1.0, -2.0, -3.0],
        [-3.0, -1.0, 2.0, 3.0, 3.0, 2.0, -1.0, -3.0],
        [-3.0, -1.0, 3.0, 4.0, 4.0, 3.0, -1.0, -3.0],
        [-3.0, -1.0, 3.0, 4.0, 4.0, 3.0, -1.0, -3.0],
        [-3.0, -1.0, 2.0, 3.0, 3.0, 2.0, -1.0, -3.0],
        [-3.0, -3.0, 0.0, 0.0, 0.0, 0.0, -3.0, -3.0],
        [-5.0, -3.0, -3.0, -3.0, -3.0, -3.0, -3.0, -5.0]
    ]
};

// --- Global Elements & Board Initialization ---
const chessboard = document.getElementById('chessboard');
const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

let initialBoard = [
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
// Note: pieceValues used in board evaluation (minimax etc.) uses our premium values below:
const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };

let currentPlayer = 'white';
let whiteTime = 600;
let blackTime = 600;
let timerInterval;

// --- Game Statistics ---
let gamesPlayed = 0, wins = 0, losses = 0, draws = 0;

// --- Game Mode & AI Difficulty ---
let gameMode = ''; // "ai" or "human"
let aiDifficulty = '';

// --- Mode Selection ---
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

// --- AI Difficulty Selection ---
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
    updateStatistics();
    startTimer();
}

// --- Timer Functions ---
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

// --- Statistics Functions ---
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
    // Optionnel: recharger la page ou permettre de rejouer.
}

// --- Board Evaluation Functions ---
function isEndgame(board) {
    let pieceCount = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] && board[r][c].toLowerCase() !== 'k') {
                pieceCount++;
            }
        }
    }
    return pieceCount <= 10;
}

function evaluateBoard(board, color) {
    let score = 0;
    const endgame = isEndgame(board);
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (!piece) continue;
            const pieceColor = piece === piece.toUpperCase() ? 'white' : 'black';
            const pieceType = piece.toLowerCase();
            const baseValue = pieceValuesGlobal[pieceType] || 0;
            let posValue = 0;
            if (pieceType in positionValues) {
                if (pieceType === 'k' && endgame) {
                    posValue = pieceColor === 'white'
                        ? positionValues['k_endgame'][r][c]
                        : positionValues['k_endgame'][7 - r][c];
                } else {
                    posValue = pieceColor === 'white'
                        ? positionValues[pieceType][r][c]
                        : positionValues[pieceType][7 - r][c];
                }
            }
            const totalValue = baseValue + (posValue * 0.1);
            score += (pieceColor === color ? totalValue : -totalValue);
        }
    }
    return score;
}

// --- Minimax with Alpha-Beta Pruning ---
function minimax(board, depth, alpha, beta, maximizingPlayer, color) {
    const opponent = color === 'white' ? 'black' : 'white';
    if (depth === 0) {
        return evaluateBoard(board, color);
    }
    function cloneBoard(board) {
        return board.map(row => [...row]);
    }
    function makeMove(board, fromRow, fromCol, toRow, toCol) {
        const newBoard = cloneBoard(board);
        newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = '';
        if (newBoard[toRow][toCol].toLowerCase() === 'p' && (toRow === 0 || toRow === 7)) {
            newBoard[toRow][toCol] = maximizingPlayer ? 'q' : 'Q';
        }
        return newBoard;
    }
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        const moves = getAllPossibleMoves(board, color);
        for (const move of moves) {
            const newBoard = makeMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
            const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, color);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        const moves = getAllPossibleMoves(board, opponent);
        for (const move of moves) {
            const newBoard = makeMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
            const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, color);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

// --- Move Generation Functions ---
// Now functions take a board parameter for consistency.
function getAllPossibleMoves(board, color) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === color) {
                const possible = getPossibleMoves(board, piece, r, c);
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

function getPossibleMoves(board, piece, row, col) {
    const moves = [];
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    switch (piece.toLowerCase()) {
        case 'p': {
            const direction = color === 'white' ? -1 : 1;
            const startRow = color === 'white' ? 6 : 1;
            if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
                moves.push([row + direction, col]);
                if (row === startRow && !board[row + 2 * direction][col]) {
                    moves.push([row + 2 * direction, col]);
                }
            }
            if (col > 0 && row + direction >= 0 && row + direction < 8) {
                const leftPiece = board[row + direction][col - 1];
                if (leftPiece && (leftPiece === leftPiece.toUpperCase() ? 'white' : 'black') !== color) {
                    moves.push([row + direction, col - 1]);
                }
            }
            if (col < 7 && row + direction >= 0 && row + direction < 8) {
                const rightPiece = board[row + direction][col + 1];
                if (rightPiece && (rightPiece === rightPiece.toUpperCase() ? 'white' : 'black') !== color) {
                    moves.push([row + direction, col + 1]);
                }
            }
            break;
        }
        case 'r': {
            for (let d of [[-1,0],[1,0],[0,-1],[0,1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row + d[0]*i, c = col + d[1]*i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color)
                            moves.push([r, c]);
                        break;
                    }
                }
            }
            break;
        }
        case 'n': {
            const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
            for (let m of knightMoves) {
                const r = row + m[0], c = col + m[1];
                if (r >= 0 && r < 8 && c >= 0 && c < 8 &&
                    (!board[r][c] || (board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color))
                    moves.push([r, c]);
            }
            break;
        }
        case 'b': {
            for (let d of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row + d[0]*i, c = col + d[1]*i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color)
                            moves.push([r, c]);
                        break;
                    }
                }
            }
            break;
        }
        case 'q': {
            for (let d of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row+d[0]*i, c = col+d[1]*i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color)
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
                        (!board[r][c] || (board[r][c] === board[r][c].toUpperCase() ? 'white' : 'black') !== color))
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
        const sq = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
        if (sq) sq.classList.add('highlight');
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
        const moves = getPossibleMoves(initialBoard, initialBoard[fromRow][fromCol], fromRow, fromCol);
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
            if (initialBoard[row][col].toLowerCase() === 'p' && (row === 0 || row === 7)) {
                const promotionChoice = prompt('Promouvoir le pion en: q (reine), r (tour), n (cavalier), b (fou)').toLowerCase();
                const validChoices = ['q','r','n','b'];
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
            if (gameMode === 'ai' && currentPlayer === 'black') {
                aiMakeMove();
            }
            return;
        }
        selectedPiece = null;
        highlightMoves([]);
    } else if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === currentPlayer) {
        selectedPiece = square;
        const moves = getPossibleMoves(initialBoard, piece, row, col);
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
        if (kingPos) break;
    }
    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = initialBoard[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === opponentColor) {
                const moves = getPossibleMoves(initialBoard, piece, r, c);
                if (moves.some(([mr, mc]) => kingPos && mr === kingPos[0] && mc === kingPos[1])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function aiMakeMove() {
    setTimeout(() => {
        const moves = getAllPossibleMoves(initialBoard, 'black');
        if (moves.length === 0) {
            alert("L'IA n'a pas de mouvements disponibles !");
            return;
        }
        const move = moves[Math.floor(Math.random() * moves.length)];
        const { row: fromRow, col: fromCol } = move.from;
        const { row: toRow, col: toCol } = move.to;
        
        // If a piece is captured, update captured arrays:
        if (initialBoard[toRow][toCol]) {
            const capturedPiece = initialBoard[toRow][toCol];
            if (capturedPiece === capturedPiece.toUpperCase())
                capturedBlack.push(capturedPiece.toLowerCase());
            else
                capturedWhite.push(capturedPiece.toUpperCase());
        }
        
        initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
        initialBoard[fromRow][fromCol] = '';
        
        // Optional: handle pawn promotion automatically for AI
        if (initialBoard[toRow][toCol].toLowerCase() === 'p' && toRow === 7) {
            initialBoard[toRow][toCol] = 'q';
        }
        
        createBoard();
        updateCapturedPieces();
        updateProgressBar();
        currentPlayer = 'white';
    }, 500);
}}