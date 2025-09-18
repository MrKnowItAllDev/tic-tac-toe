'use strict';

/*
*  NOTE, if you're looking at this code, you'll find some unused data/variables, such as
*  player score, and methods such as increment score and get score, and probably a few others,
*  these are all useless.
*
*  You might also notice that I didn't exactly plan out any structure or system,
*   my code is a mess, I kinda just figured stuff out as I was coding, BAD idea
*   DO NOT do that.
* */

const gameBoard = (() => {
    let board = Array(9).fill(null);

    const isTaken = (pos) => board[pos] !== null;
    const getAvailable = () => board.filter((pos) => !pos);
    const getBoard = () => board;
    const placeMove = (mark, pos) => board[pos] = mark;
    const setBoard = () => board = Array(9).fill(null);

    const getWinner = (move) => {
        const wPositions = [
            [0, 1, 2], [0, 4, 8], [0, 3, 6],
            [1, 4, 7], [2, 4, 6], [3, 4, 5], [6, 7, 8], [2, 5, 8]
        ];

        return wPositions.some((arr) => {
            return arr.every((pos) => {
                return board[pos] === move;
            })
        });
    }

    const getTie = () => {
        return board.filter((p) => p === null).length === 1;
    }

    return {
        isTaken, getAvailable, getTie,
        placeMove, getBoard, getWinner,
        setBoard
    };
})();

function Player(name, mark) {
    const pMark = mark;
    let score = 0;

    const getScore = () => score;
    const incScore = () => score++;
    const getMove = () => pMark;
    const setName = (pName) => name = pName;
    const getName = () => name;

    return { getMove, getScore, incScore, getName, setName }
}

function gameController() {
    const board = gameBoard;
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');

    let activePlayer = player1;
    const uiInfo = {};

    const getBoard = () => board.getBoard();
    const getTie = () => board.getTie();

    const switchPlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const getActivePlayer = () => activePlayer;

    const validPos = (pos) => {
        return pos >= 0 && pos < getBoard().length;
    }

    const playGame = (pos) => {
        if (!validPos(pos)) {
            uiInfo['invalid'] = `Please select a valid position`;
            return;
        }
        if (board.isTaken(pos)) uiInfo['isTaken'] = `Position ${pos + 1} is taken`;
        if (!board.getWinner(player1.getMove()) && !board.getWinner(player2.getMove()))
            if (!board.isTaken(pos) && validPos(pos)) {
                board.placeMove(activePlayer.getMove(), pos);
                uiInfo['activePlayer'] = activePlayer;
                switchPlayer();
            }
            else uiInfo['occupiedMsg'] = `This position is occupied`; // Element textContent update
        if (board.getWinner(player1.getMove()) || board.getWinner(player2.getMove())) {
            uiInfo['winner'] = board.getWinner(player1.getMove()) ? player1 : player2;
        }
    }

    return { playGame, getActivePlayer, board, getBoard, getTie, uiInfo, switchPlayer }
}

function displayController() {
    const game = gameController();
    const board = game.getBoard();
    let running = true;

    const grid = document.querySelector('#grid');
    const player1 = document.querySelector('.player-1');
    const player2 = document.querySelector('.player-2');
    const playerOutput = document.querySelector('.announce');

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-item');
        grid.appendChild(cell);
    }

    const reset = () => {
        running = true;
        if (game.getActivePlayer().getMove() === 'O') {
            game.switchPlayer();
        }
        playerOutput.textContent = ``;
        player1.textContent = `Player 1: `;
        player2.textContent = `Player 2: `;
        const cells = document.querySelectorAll('.grid-item');
        cells.forEach((cell, i) => {
            cell.textContent = ``;
            board[i] = null;
        });
        if (game.uiInfo['winner']) {
            Object.keys(game.uiInfo).forEach((key) => {
                game.uiInfo[key] = null;
            });
        }
    }

    const gameRules = (event, pos) => {
        if (!game.uiInfo['winner']) {
            event.target.textContent = game.getActivePlayer().getMove();
            game.playGame(pos);
        }
    }

    const playRound = () => {
        const p1 = document.querySelector('.player-1');
        const p2 = document.querySelector('.player-2');
        const cells = document.querySelectorAll('.grid-item');
        cells.forEach((cell, i) => {
            cell.addEventListener('click', (e) => {
                if(!running) return;
                if (game.board.isTaken(i)) {
                    document.querySelector('.announce').textContent = `Position ${(i + 1)} is taken`;
                    setTimeout(() => {
                        document.querySelector('.announce').textContent = ``;
                    }, 2000);
                } else {
                    gameRules(e, i);
                    let player = game.uiInfo['winner'];
                    if (game.uiInfo['winner']) {
                        document.querySelector('.announce').textContent = `${player.getName()} Wins!`;
                        if (player.getName() === 'Player 1') p1.textContent = `Player 1: ${player.getScore()}`;
                        else p2.textContent = `Player 2: ${player.getScore()}`;
                        running = false;
                    }
                }
            });
        });
        document.querySelector('.btn-reset').addEventListener('click',
            () => {
                reset();
        });
    }
    return { playRound }
}

const main = displayController();
main.playRound();

