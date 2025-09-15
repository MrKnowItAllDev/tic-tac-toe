'use strict';

function gameBoard() {
    const board = [];
    for (let i = 0; i < 3 * 3; i++) {
        board.push([]);
    }
    return board;
}

function Player(player, mark) {
    this.player = player;
    this.mark = mark;
}

function displayController() {

}