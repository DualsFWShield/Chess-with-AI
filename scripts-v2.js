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
let promotionCallback = null;
const capturedWhite = [];
const capturedBlack = [];
const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
let currentPlayer = 'white';
let whiteTime = 600;
let blackTime = 600;
let timerInterval;
let enPassantTarget = null;

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

function showPromotionModal(color, callback) {
    const modal = document.getElementById('promotion-modal');
    const promotionOptions = modal.querySelector('.promotion-options');
    
    // Vider les options existantes
    promotionOptions.innerHTML = '';
    
    // Créer les pièces pour la promotion
    const promotionPieces = ['q', 'r', 'n', 'b'];
    promotionPieces.forEach(pieceType => {
        const pieceDiv = document.createElement('div');
        pieceDiv.className = `promotion-piece ${color}-piece`;
        pieceDiv.dataset.piece = pieceType;
        // Utiliser l'objet pieces pour afficher le bon caractère Unicode
        pieceDiv.textContent = pieces[color === 'white' ? pieceType.toUpperCase() : pieceType];
        
        pieceDiv.onclick = () => {
            callback(pieceType);
            modal.style.display = 'none';
        };
        
        promotionOptions.appendChild(pieceDiv);
    });
    
    modal.style.display = 'block';
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

function updateRatingDisplay() {
    // Pour une partie contre l'IA, le joueur 1 est le joueur humain et le joueur 2 est l'IA.
    // En mode humain vs humain, vous pouvez adapter l'affichage.
    const player1RatingEl = document.querySelector('.player-1-rating');
    const player2RatingEl = document.querySelector('.player-2-rating');
    
    if (gameMode === 'ai') {
        player1RatingEl.textContent = playerRating;
        player2RatingEl.textContent = aiRating;
    } else {
        // Par exemple, pour le mode humain vs humain, on pourrait afficher les ratings initiaux ou les laisser vides.
        player1RatingEl.textContent = playerRating;
        player2RatingEl.textContent = playerRating;
    }
}

function checkAndUpdateKingStatus() {
    if (isKingInCheck('white')) {
        updateGameStatus('Échec au roi blanc !');
    } else if (isKingInCheck('black')) {
        updateGameStatus('Échec au roi noir !');
    } else {
        updateGameStatus('Statut : Pas de quoi s\'inquiéter !');
    }
}

function showGameEndModal(message) {
    const modal = document.getElementById('game-end-modal');
    document.getElementById('game-end-message').textContent = message;
    modal.style.display = 'block';
    
    document.getElementById('play-again').onclick = () => {
        location.reload();
    };
}

function updateGameStatus(statusText) {
    document.getElementById('game-status').textContent = statusText;
}

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
    updateRatingDisplay();
}

// --- Timer functions ---
function startTimer() {
    timerInterval = setInterval(() => {
        if (currentPlayer === 'white') {
            whiteTime--;
            if (whiteTime <= 0) {
                updateGameStatus('Temps écoulé pour les blancs !');
                endGame('black');
                return;
            }
        } else {
            blackTime--;
            if (blackTime <= 0) {
                updateGameStatus('Temps écoulé pour les noirs !');
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

// Ajouter ces variables globales au début du fichier
let playerRating = 1200; // Rating ELO initial du joueur
let aiRating = 1200; // Rating ELO initial de l'IA
const K_FACTOR = 32; // Facteur K pour les ajustements ELO

// Ajouter cette fonction pour calculer le nouveau rating ELO
function updateRatings(playerWon) {
    const expectedScore = 1 / (1 + Math.pow(10, (aiRating - playerRating) / 400));
    const actualScore = playerWon ? 1 : 0;
    
    playerRating = Math.round(playerRating + K_FACTOR * (actualScore - expectedScore));
    aiRating = Math.round(aiRating + K_FACTOR * ((1 - actualScore) - (1 - expectedScore)));
    
    console.log(`Nouveau rating joueur: ${playerRating}, IA: ${aiRating}`);
}

function endGame(winner) {
    gamesPlayed++;
    if (winner === 'white' && gameMode === 'ai') {
        wins++;
        updateRatings(true);
    } else if (winner === 'black' && gameMode === 'ai') {
        losses++;
        updateRatings(false);
    } else {
        draws++;
    }
    updateStatistics();
    clearInterval(timerInterval);
    
    const message = `Partie terminée. ${winner === 'draw' ? 'Match nul !' : 'Victoire des ' + (winner === 'white' ? 'Blancs' : 'Noirs') + ' !'}`;
    showGameEndModal(message);
}

function isCheckmate(color) {
    // Vérifie d'abord si le roi est en échec
    if (!isKingInCheck(color)) return false;

    // Vérifie si un mouvement peut sortir de l'échec
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = initialBoard[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === color) {
                const moves = getPossibleMoves(piece, r, c);
                if (moves.length > 0) return false;
            }
        }
    }
    return true;
}

function isStalemate(color) {
    // Si le roi est en échec, ce n'est pas pat
    if (isKingInCheck(color)) return false;

    // Vérifie s'il reste des mouvements légaux
    let hasLegalMoves = false;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = initialBoard[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === color) {
                const moves = getPossibleMoves(piece, r, c);
                if (moves.length > 0) {
                    hasLegalMoves = true;
                    break;
                }
            }
        }
        if (hasLegalMoves) break;
    }

    if (hasLegalMoves) return false;

    // Vérifie les conditions de matériel insuffisant
    const pieces = initialBoard.flat().filter(p => p !== '');
    
    // Roi contre roi
    if (pieces.length === 2) return true;

    // Roi et fou/cavalier contre roi
    if (pieces.length === 3) {
        const nonKings = pieces.filter(p => p.toLowerCase() !== 'k');
        if (nonKings.length === 1 && 
            (nonKings[0].toLowerCase() === 'b' || nonKings[0].toLowerCase() === 'n')) {
            return true;
        }
    }

    // Si aucun mouvement légal n'est possible mais il y a suffisamment de matériel
    return !hasLegalMoves;
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

// Initialisation de Stockfish dans un worker
let stockfish;
function initStockfish() {
    stockfish = new Worker('stockfish.js');
    stockfish.postMessage('uci');
    stockfish.onmessage = function(event) {
        // Optionnel: console.log("Stockfish:", event.data);
    };
}
initStockfish();

function boardToFEN(board) {
    // La notation FEN attend que la première ligne corresponde à la rangée 8 (board[0])
    let fenRows = [];
    for (let r = 0; r < 8; r++) {
        let rowFen = "";
        let emptyCount = 0;
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (!piece || piece === "") {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    rowFen += emptyCount;
                    emptyCount = 0;
                }
                rowFen += piece;
            }
        }
        if (emptyCount > 0) rowFen += emptyCount;
        fenRows.push(rowFen);
    }
    const piecePlacement = fenRows.join('/');

    // Déterminer le joueur actif (nous utilisons la variable globale currentPlayer)
    const activeColor = currentPlayer === 'white' ? 'w' : 'b';

    // Déduire les droits de roque
    let castling = "";
    // Pour les blancs : le roi doit être sur e1 (board[7][4])
    if (board[7][4] === 'K') {
        if (board[7][7] === 'R') castling += "K"; // roque côté roi
        if (board[7][0] === 'R') castling += "Q"; // roque côté dame
    }
    // Pour les noirs : le roi doit être sur e8 (board[0][4])
    if (board[0][4] === 'k') {
        if (board[0][7] === 'r') castling += "k";
        if (board[0][0] === 'r') castling += "q";
    }
    if (castling === "") castling = "-";

    // Case en passant
    let ep = "-";
    if (enPassantTarget) {
        const files = ['a','b','c','d','e','f','g','h'];
        // enPassantTarget est un tableau [row, col] et le rang correspond à 8 - row.
        ep = files[enPassantTarget[1]] + (8 - enPassantTarget[0]);
    }
    
    // Pour simplifier, nous fixons le compteur de demi-coups et le numéro complet
    const halfmoveClock = 0;
    const fullmoveNumber = 1;  // Vous pouvez ajuster ce nombre selon l'évolution de la partie

    return `${piecePlacement} ${activeColor} ${castling} ${ep} ${halfmoveClock} ${fullmoveNumber}`;
}

// --- AI functions ---
function aiMakeMove() {
    setTimeout(() => {
        const moves = getAllPossibleMoves('black');
        if (moves.length === 0) {
            updateGameStatus('Match nul ! L\'IA ne peut plus jouer.');
            clearInterval(timerInterval);
            return;
        }

        const difficultyLower = aiDifficulty.toLowerCase();
        let searchDepth;

        // Définir la profondeur de recherche selon le niveau
        if (difficultyLower === 'noob') {
            searchDepth = 1;
        } else if (difficultyLower === 'easy') {
            searchDepth = 2;
        } else if (difficultyLower === 'regular') {
            searchDepth = 3;
        } else if (difficultyLower === 'hard') {
            searchDepth = 4;
        } else if (difficultyLower === 'adaptative') {
            const ratingDiff = aiRating - playerRating;
            if (ratingDiff < -300) {
                searchDepth = 1;
            } else if (ratingDiff < -100) {
                searchDepth = 2;
            } else if (ratingDiff < 100) {
                searchDepth = 3;
            } else if (ratingDiff < 300) {
                searchDepth = 4;
            } else {
                searchDepth = 5;
            }
        }
        // Pour les niveaux très élevés et imbattables,
        // on utilise une profondeur beaucoup plus importante.
        else if (difficultyLower === 'very hard') {
            searchDepth = 6;
        } else if (difficultyLower === 'super hard') {
            searchDepth = 8;
        } else if (difficultyLower === 'magnus carlsen') {
            searchDepth = 12;
        } else if (difficultyLower === 'unbeatable') {
            searchDepth = 15;
        } else {
            // Par défaut, utiliser une profondeur de 2
            searchDepth = 2;
        }
        
        // Conversion du board en FEN et envoi à Stockfish
        const fen = boardToFEN(initialBoard);
        stockfish.postMessage(`position fen ${fen}`);
        stockfish.postMessage(`go depth ${searchDepth}`);
        
        stockfish.onmessage = function(event) {
            if (event.data.startsWith('bestmove')) {
                const bestmove = event.data.split(' ')[1];
                if (bestmove && bestmove !== '(none)') {
                    // Conversion du coup UCI (ex: "e7e5") en indices sur le board
                    const fileToCol = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
                    const fromFile = bestmove[0];
                    const fromRank = bestmove[1];
                    const toFile = bestmove[2];
                    const toRank = bestmove[3];
                    const fromCol = fileToCol[fromFile];
                    const toCol = fileToCol[toFile];
                    const fromRow = 8 - parseInt(fromRank);
                    const toRow = 8 - parseInt(toRank);
                    
                    // Vérification de sécurité : capture du roi
                    if (initialBoard[toRow][toCol] === 'K' || initialBoard[toRow][toCol] === 'k') {
                        updateGameStatus('Partie terminée ! Le roi a été capturé par l\'IA.');
                        endGame('black');
                        return;
                    }
                    
                    // Enregistrer une capture s'il y a une pièce sur la case cible
                    if (initialBoard[toRow][toCol]) {
                        const capturedPiece = initialBoard[toRow][toCol];
                        if (capturedPiece === capturedPiece.toUpperCase())
                            capturedBlack.push(capturedPiece.toLowerCase());
                        else
                            capturedWhite.push(capturedPiece.toUpperCase());
                    }
                    
                    // Appliquer le coup
                    initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
                    initialBoard[fromRow][fromCol] = '';
                    
                    // Promotion automatique pour les pions arrivant en fin de plateau
                    if (initialBoard[toRow][toCol].toLowerCase() === 'p' && toRow === 7) {
                        initialBoard[toRow][toCol] = 'q';
                    }
                    
                    createBoard();
                    updateCapturedPieces();
                    updateProgressBar();
                    checkAndUpdateKingStatus();
                    updateRatingDisplay();
                    
                    if (isCheckmate('white')) {
                        updateGameStatus('Échec et mat ! L\'IA gagne !');
                        endGame('black');
                        return;
                    }
                    if (isStalemate('white')) {
                        updateGameStatus('Pat ! Match nul !');
                        endGame('draw');
                        return;
                    }
                    if (isKingInCheck('white')) {
                        updateGameStatus('Échec au roi blanc !');
                    }
                    
                    currentPlayer = 'white';
                    updateRatingDisplay();
                }
            }
        };
    }, 500);
}

// --- Board creation & game logic ---
function createBoard() {
    chessboard.innerHTML = '';
    const files = ['a','b','c','d','e','f','g','h'];
    initialBoard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = rowIndex;
            square.dataset.col = colIndex;
            // Afficher la pièce (si présente)
            if (piece) {
                square.textContent = pieces[piece];
            }
            // Ajouter un label avec le nom de la case
            const label = document.createElement('span');
            label.className = 'square-label';
            label.textContent = `${files[colIndex]}${8 - rowIndex}`;
            square.appendChild(label);
            
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
            // Forward move
            if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
                moves.push([row + direction, col]);
                if (row === startRow && !board[row + 2 * direction][col]) {
                    moves.push([row + 2 * direction, col]);
                }
            }
            // Regular diagonal captures
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
            // En passant: if enPassantTarget is set and lies exactly one square diagonally forward.
            if (enPassantTarget &&
                enPassantTarget[0] === row + direction &&
                Math.abs(enPassantTarget[1] - col) === 1) {
                moves.push([row + direction, enPassantTarget[1]]);
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
        
        // Si c'est un mouvement du roi, vérifier la nouvelle position
        if (piece.toLowerCase() === 'k') {
            return !isSquareAttacked(toRow, toCol, color === 'white' ? 'black' : 'white', tempBoard);
        }
        
        // Sinon, trouver la position du roi et vérifier
        const kingSymbol = color === 'white' ? 'K' : 'k';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (tempBoard[r][c] === kingSymbol) {
                    return !isSquareAttacked(r, c, color === 'white' ? 'black' : 'white', tempBoard);
                }
            }
        }
        return true;
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

    // Vérifier si le roi est en échec sans utiliser isKingInCheck
    const kingPos = [row, 4];
    if (isSquareAttacked(kingPos[0], kingPos[1], opponentColor, board)) return false;

    if (side === 'kingside') {
        if (board[row][7] !== rook) return false;
        if (board[row][5] !== '' || board[row][6] !== '') return false;
        
        // Vérifie si les cases sont attaquées
        return !isSquareAttacked(row, 5, opponentColor, board) && 
               !isSquareAttacked(row, 6, opponentColor, board);
    } else {
        if (board[row][0] !== rook) return false;
        if (board[row][1] !== '' || board[row][2] !== '' || board[row][3] !== '') return false;
        
        // Vérifie si les cases sont attaquées
        return !isSquareAttacked(row, 3, opponentColor, board) && 
               !isSquareAttacked(row, 2, opponentColor, board);
    }
}

function getPossibleMovesForBoard(piece, board, row, col) {
    const moves = [];
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    switch (piece.toLowerCase()) {
        case 'p': {
            const direction = color === 'white' ? -1 : 1;
            const startRow = color === 'white' ? 6 : 1;
            // Forward move
            if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
                moves.push([row + direction, col]);
                if (row === startRow && !board[row + 2 * direction][col]) {
                    moves.push([row + 2 * direction, col]);
                }
            }
            // Regular diagonal captures
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
            // En passant: if enPassantTarget is set and lies exactly one square diagonally forward.
            if (enPassantTarget &&
                enPassantTarget[0] === row + direction &&
                Math.abs(enPassantTarget[1] - col) === 1) {
                moves.push([row + direction, enPassantTarget[1]]);
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
    document.querySelectorAll('.square').forEach(square => {
        square.classList.remove('highlight');
        square.classList.remove('capture');
    });
    
    moves.forEach(([r, c]) => {
        const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
        square.classList.add('highlight');
        // Si la case contient déjà une pièce, c'est un mouvement de capture
        if (initialBoard[r][c] !== "") {
            square.classList.add('capture');
        }
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
        const movingPiece = initialBoard[fromRow][fromCol];
        const moves = getPossibleMoves(movingPiece, fromRow, fromCol);

        // Si coup en passant : déplacement diagonal vers une case vide
        if (
            movingPiece.toLowerCase() === 'p' &&
            Math.abs(col - fromCol) === 1 &&
            !initialBoard[row][col]
        ) {
            if (currentPlayer === 'white') {
                // Pour blanc, le pion capturé se trouve à la ligne suivante (row+1)
                capturedBlack.push(initialBoard[row + 1][col].toLowerCase());
                initialBoard[row + 1][col] = '';
            } else {
                capturedWhite.push(initialBoard[row - 1][col].toUpperCase());
                initialBoard[row - 1][col] = '';
            }
        }

        // Vérifier que le mouvement est bien légal avant de modifier le plateau
        if (moves.some(([r, c]) => r === row && c === col)) {

            // Gérer le roque
            if (movingPiece.toLowerCase() === 'k' && Math.abs(col - fromCol) === 2) {
                const isKingside = col > fromCol;
                const rookFromCol = isKingside ? 7 : 0;
                const rookToCol = isKingside ? col - 1 : col + 1;
                initialBoard[row][rookToCol] = initialBoard[row][rookFromCol];
                initialBoard[row][rookFromCol] = '';
            }

            // Vérification de capture du roi (sécurité)
            if (initialBoard[row][col] === 'k' || initialBoard[row][col] === 'K') {
                updateGameStatus('Partie terminée ! Le roi a été capturé.');
                endGame(currentPlayer === 'white' ? 'white' : 'black');
                return;
            }

            // Si le carré de destination contenait une pièce, l'enregistrer comme capture
            if (initialBoard[row][col] && (row !== fromRow || col !== fromCol)) {
                const capturedPiece = initialBoard[row][col];
                if (capturedPiece === capturedPiece.toUpperCase())
                    capturedBlack.push(capturedPiece.toLowerCase());
                else
                    capturedWhite.push(capturedPiece.toUpperCase());
            }

            // Déplacer la pièce
            initialBoard[row][col] = movingPiece;
            initialBoard[fromRow][fromCol] = '';

            // Gérer la promotion du pion
            if (movingPiece.toLowerCase() === 'p' && (row === 0 || row === 7)) {
                showPromotionModal(currentPlayer, (promoPiece) => {
                    initialBoard[row][col] = currentPlayer === 'white'
                        ? promoPiece.toUpperCase()
                        : promoPiece;
                    createBoard();
                    updateCapturedPieces();
                    updateProgressBar();
                    checkAndUpdateKingStatus();
                    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
                    if (gameMode === 'ai' && currentPlayer === 'black') {
                        aiMakeMove();
                    }
                });
                return;
            }

            // Mettre à jour en passant : si le pion a avancé de 2 cases
            if (movingPiece.toLowerCase() === 'p' && Math.abs(row - fromRow) === 2) {
                enPassantTarget = [(row + fromRow) / 2, col];
            } else {
                enPassantTarget = null;
            }

            createBoard();
            updateCapturedPieces();
            updateProgressBar();
            checkAndUpdateKingStatus();

            // Vérifier échec et mat ou pat
            const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
            if (isCheckmate(nextPlayer)) {
                updateGameStatus(`Échec et mat ! Les ${currentPlayer === 'white' ? 'Blancs' : 'Noirs'} gagnent !`);
                endGame(currentPlayer);
                return;
            }
            if (isStalemate(nextPlayer)) {
                updateGameStatus('Pat ! Match nul !');
                endGame('draw');
                return;
            }

            if (isKingInCheck(nextPlayer)) {
                updateGameStatus(`Échec au roi ${nextPlayer === 'white' ? 'blanc' : 'noir'} !`);
            }

            currentPlayer = nextPlayer;
            selectedPiece = null;
            highlightMoves([]);

            if (gameMode === 'ai' && currentPlayer === 'black') {
                aiMakeMove();
            }
        } else {
            selectedPiece = null;
            highlightMoves([]);
        }
    } else if (piece && ((piece === piece.toUpperCase() ? 'white' : 'black') === currentPlayer)) {
        selectedPiece = square;
        const moves = getPossibleMoves(piece, row, col);
        highlightMoves(moves);
    }
    updateProgressBar();
    checkAndUpdateKingStatus();
}

function updateCapturedPieces() {
    document.getElementById('captured-white').innerHTML = capturedWhite.map(piece => pieces[piece.toLowerCase()]).join(' ');
    document.getElementById('captured-black').innerHTML = capturedBlack.map(piece => pieces[piece.toLowerCase()]).join(' ');
}

function updateProgressBar() {
    // capturedWhite holds pieces captured by white (i.e. black pieces)
    const whiteScore = capturedWhite.reduce((sum, piece) => sum + (pieceValues[piece.toLowerCase()] || 0), 0);
    // capturedBlack holds pieces captured by black (i.e. white pieces)
    const blackScore = capturedBlack.reduce((sum, piece) => sum + (pieceValues[piece.toLowerCase()] || 0), 0);
    const totalScore = whiteScore + blackScore || 1;
    const whitePercentage = (whiteScore / totalScore) * 100;
    const blackPercentage = (blackScore / totalScore) * 100;
    
    document.getElementById('white-progress').style.width = `${whitePercentage}%`;
    document.getElementById('black-progress').style.width = `${blackPercentage}%`;
}

function isKingInCheck(color, board = initialBoard) {
    let kingPos;
    const kingSymbol = color === 'white' ? 'K' : 'k';
    
    // Trouver le roi
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

    // Vérifier les attaques
    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && (piece === piece.toUpperCase() ? 'white' : 'black') === opponentColor) {
                const moves = getPossibleMovesWithoutCheck(piece, r, c, board);
                if (moves.some(([mr, mc]) => mr === kingPos[0] && mc === kingPos[1])) {
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
checkAndUpdateKingStatus();