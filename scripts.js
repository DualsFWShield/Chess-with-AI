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
    
    // Ajout d'un bouton "Rejouer"
    const replayButton = document.createElement('button');
    replayButton.textContent = "Rejouer";
    replayButton.id = "replay-button";
    replayButton.style.marginTop = "20px";
    replayButton.addEventListener('click', () => {
        location.reload();
    });
    
    // Ajout du bouton au body (ou dans un autre conteneur si souhaité)
    document.body.appendChild(replayButton);
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

// --- Nouvelles fonctions pour Minimax ---
function cloneBoard(board) {
    return board.map(row => row.slice());
}

function applyMoveOnBoard(board, move) {
    const newBoard = cloneBoard(board);
    newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
    newBoard[move.from.row][move.from.col] = '';
    return newBoard;
}

function evaluateBoard(board) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                const value = pieceValues[piece.toLowerCase()] || 0;
                // Les pièces noires (IA) ajoutent au score, les blanches le soustraient
                score += (piece === piece.toLowerCase() ? value : -value);
            }
        }
    }
    // Pénalise si le roi noir (IA) est en échec et récompense si le roi adverse l'est
    if (isKingInCheckForBoard(board, 'black')) {
        score -= 50;
    }
    if (isKingInCheckForBoard(board, 'white')) {
        score += 50;
    }
    return score;
}

function getAllPossibleMovesForBoard(board, color) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
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

function minimax(board, depth, isMaximizing, alpha, beta) {
    if (depth === 0) {
        return evaluateBoard(board);
    }
    const currentColor = isMaximizing ? 'black' : 'white';
    const possibleMoves = getAllPossibleMovesForBoard(board, currentColor);
    if (possibleMoves.length === 0) {
        return evaluateBoard(board);
    }
    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of possibleMoves) {
            const newBoard = applyMoveOnBoard(board, move);
            const evalScore = minimax(newBoard, depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of possibleMoves) {
            const newBoard = applyMoveOnBoard(board, move);
            const evalScore = minimax(newBoard, depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function isKingInCheckForBoard(board, color) {
    const kingSymbol = color === 'white' ? 'K' : 'k';
    let kingPos = null;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === kingSymbol) {
                kingPos = [r, c];
                break;
            }
        }
        if (kingPos) break;
    }
    if (!kingPos) return true;
    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === opponentColor) {
                const moves = getPossibleMovesForBoard(piece, board, r, c);
                if (moves.some(move => move[0] === kingPos[0] && move[1] === kingPos[1])) {
                    return true;
                }
            }
        }
    }
    return false;
}

// --- AI functions ---
function aiMakeMove() {
    setTimeout(() => {
        const moves = getAllPossibleMoves('black');
        if (moves.length === 0) {
            alert('Match nul ! L’IA ne peut plus jouer.');
            clearInterval(timerInterval);
            return;
        }
        
        // Si un coup permettant de capturer le roi est disponible, le choisir de préférence
        const kingCaptureMoves = moves.filter(m => {
            const target = initialBoard[m.to.row][m.to.col];
            return target === 'K' || target === 'k';
        });
        let chosenMove;
        if (kingCaptureMoves.length > 0) {
            chosenMove = kingCaptureMoves[Math.floor(Math.random() * kingCaptureMoves.length)];
        } else {
            const difficultyLower = aiDifficulty.toLowerCase();
            if (difficultyLower === 'noob') {
                chosenMove = moves[Math.floor(Math.random() * moves.length)];
            } else if (difficultyLower === 'easy') {
                const captureMoves = moves.filter(m => evaluateMove(m) > 0);
                chosenMove = (captureMoves.length > 0 && Math.random() < 0.5)
                             ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
                             : moves[Math.floor(Math.random() * moves.length)];
            } else if (difficultyLower === 'regular') {
                chosenMove = moves[Math.floor(Math.random() * moves.length)];
            } else if (
                difficultyLower === 'hard' ||
                difficultyLower === 'very hard' ||
                difficultyLower === 'super hard' ||
                difficultyLower === 'super duper hard' ||
                difficultyLower === 'super duper hardest' ||
                difficultyLower === 'super duper hardest plus' ||
                difficultyLower === 'magnus carlsen' ||
                difficultyLower === 'unbeatable'
            ) {
                // Recherche Minimax pour renforcer l'IA
                let bestScore = -Infinity;
                let bestMove = null;
                const searchDepth = 3; // Profondeur de recherche améliorant la prise de décision
                for (const move of moves) {
                    const newBoard = applyMoveOnBoard(initialBoard, move);
                    const score = minimax(newBoard, searchDepth - 1, false, -Infinity, Infinity);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = move;
                    }
                }
                chosenMove = bestMove;
            } else {
                chosenMove = moves[Math.floor(Math.random() * moves.length)];
            }
        }

        const fromRow = chosenMove.from.row;
        const fromCol = chosenMove.from.col;
        const toRow = chosenMove.to.row;
        const toCol = chosenMove.to.col;
        
        // Détection de la capture du roi (échec et mat)
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

// Simule un mouvement et vérifie si le roi est en échec
function wouldKingBeInCheck(fromRow, fromCol, toRow, toCol, color, board = initialBoard) {
    const tempBoard = board.map(row => [...row]);
    tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
    tempBoard[fromRow][fromCol] = '';
    
    let kingPos;
    const kingSymbol = color === 'white' ? 'K' : 'k';
    
    // Trouve la position du roi
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (tempBoard[r][c] === kingSymbol) {
                kingPos = [r, c];
                break;
            }
        }
        if (kingPos) break;
    }
    
    return isSquareAttacked(kingPos[0], kingPos[1], color === 'white' ? 'black' : 'white', tempBoard);
}

function getPossibleMovesWithoutCheck(piece, row, col, board = initialBoard) {
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
                if (leftPiece && (leftPiece.toUpperCase() === leftPiece ? 'white' : 'black') !== color) {
                    moves.push([row + direction, col - 1]);
                }
            }
            if (col < 7 && row + direction >= 0 && row + direction < 8) {
                const rightPiece = board[row + direction][col + 1];
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
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color) moves.push([r, c]);
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
                    (!board[r][c] || (board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color))
                    moves.push([r, c]);
            }
            break;
        }
        case 'b': {
            for (let d of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row + d[0] * i, c = col + d[1] * i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color)
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
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color)
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
                        (!board[r][c] || (board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color))
                        moves.push([r, c]);
                }
            }
            break;
        }
    }
    return moves;
}

// Modifier isSquareAttacked pour éviter la récursion
function isSquareAttacked(row, col, attackingColor, board = initialBoard) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === attackingColor) {
                const moves = getPossibleMovesWithoutCheck(piece, r, c, board);
                if (moves.some(([mr, mc]) => mr === row && mc === col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Modifier getPossibleMoves pour utiliser la nouvelle logique
function getPossibleMoves(piece, row, col, board = initialBoard) {
    const moves = [];
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    const isInitialPosition = (row === (color === 'white' ? 7 : 0));

    // Obtenir les mouvements de base
    const basicMoves = getPossibleMovesWithoutCheck(piece, row, col, board);

    // Filtrer les mouvements qui mettraient le roi en échec
    const legalMoves = basicMoves.filter(([toRow, toCol]) => {
        const tempBoard = board.map(row => [...row]);
        tempBoard[toRow][toCol] = tempBoard[row][col];
        tempBoard[row][col] = '';
        
        // Trouver la position du roi
        let kingRow = row, kingCol = col;
        if (piece.toLowerCase() !== 'k') {
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (tempBoard[r][c] === (color === 'white' ? 'K' : 'k')) {
                        kingRow = r;
                        kingCol = c;
                        break;
                    }
                }
            }
        } else {
            kingRow = toRow;
            kingCol = toCol;
        }
        
        return !isSquareAttacked(kingRow, kingCol, color === 'white' ? 'black' : 'white', tempBoard);
    });

    // Ajouter les mouvements de roque si possible
    if (piece.toLowerCase() === 'k' && isInitialPosition) {
        if (canCastle(color, 'kingside', board)) {
            moves.push([row, col + 2]);
        }
        if (canCastle(color, 'queenside', board)) {
            moves.push([row, col - 2]);
        }
    }

    return [...legalMoves, ...moves];
}

function canCastle(color, side, board = initialBoard) {
    const row = color === 'white' ? 7 : 0;
    const king = color === 'white' ? 'K' : 'k';
    const rook = color === 'white' ? 'R' : 'r';
    const opponentColor = color === 'white' ? 'black' : 'white';

    // Vérifie la position initiale du roi
    if (board[row][4] !== king) return false;

    if (side === 'kingside') {
        if (board[row][7] !== rook) return false;
        if (board[row][5] !== '' || board[row][6] !== '') return false;
        
        // Vérifie si les cases sont attaquées
        if (isSquareAttacked(row, 4, opponentColor, board) ||
            isSquareAttacked(row, 5, opponentColor, board) ||
            isSquareAttacked(row, 6, opponentColor, board)) {
            return false;
        }
    } else {
        if (board[row][0] !== rook) return false;
        if (board[row][1] !== '' || board[row][2] !== '' || board[row][3] !== '') return false;
        
        // Vérifie si les cases sont attaquées
        if (isSquareAttacked(row, 4, opponentColor, board) ||
            isSquareAttacked(row, 3, opponentColor, board) ||
            isSquareAttacked(row, 2, opponentColor, board)) {
            return false;
        }
    }
    
    return true;
}

function getPossibleMovesForBoard(piece, board, row, col) {
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
                if (leftPiece && (leftPiece.toUpperCase() === leftPiece ? 'white' : 'black') !== color) {
                    moves.push([row + direction, col - 1]);
                }
            }
            if (col < 7 && row + direction >= 0 && row + direction < 8) {
                const rightPiece = board[row + direction][col + 1];
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
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color)
                            moves.push([r, c]);
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
                    (!board[r][c] || (board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color))
                    moves.push([r, c]);
            }
            break;
        }
        case 'b': {
            for (let d of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                for (let i = 1; i < 8; i++) {
                    const r = row + d[0] * i, c = col + d[1] * i;
                    if (r < 0 || r > 7 || c < 0 || c > 7) break;
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color)
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
                    if (!board[r][c]) moves.push([r, c]);
                    else {
                        if ((board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color)
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
                        (!board[r][c] || (board[r][c].toUpperCase() === board[r][c] ? 'white' : 'black') !== color))
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
            if (piece.toLowerCase() === 'k' && Math.abs(col - fromCol) === 2) {
                // Petit roque
                if (col > fromCol) {
                    initialBoard[fromRow][col - 1] = initialBoard[fromRow][7];
                    initialBoard[fromRow][7] = '';
                }
                // Grand roque
                else {
                    initialBoard[fromRow][col + 1] = initialBoard[fromRow][0];
                    initialBoard[fromRow][0] = '';
                }
            }
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