import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import Player from './Player.js';
import gameRunner from './gameRunner';
import waveIcon from './wave.svg';
import shipIcon from './ship.svg';
import damagedShipIcon from './damaged-ship.svg';
import enemyDamagedShipIcon from './enemy-damaged-ship.svg';
import cannonBallIcon from './mario-bullet.jpg';

const display = (function() {
    // param 'player' is a string 'player1' or 'player2'
    const displayPlayerBoard = function(gameboardObj, player) {
        const displayBoard = document.getElementById(`${player}`).querySelector('.player-board');

        for (let i = 0; i < gameboardObj.board.length; i++) {
            for (let j = 0; j < gameboardObj.board[i].length; j++) {
                const boardIcon = document.createElement('img');
                displayBoard.appendChild(boardIcon);
                switch(true) {
                    case gameboardObj.missedAttacks.has(`${i}${j}`):
                        boardIcon.src = '';
                        break;
                    case gameboardObj.board[i][j] == null:
                        boardIcon.src = waveIcon;
                        break;
                    case gameboardObj.board[i][j] == 'hit':
                        boardIcon.src = damagedShipIcon;
                        break;
                    default:
                        boardIcon.src = shipIcon;
                        break;
                }
            }
        }
    }

    // param 'player' is a string 'player1' or 'player2'
    const displayEnemyBoard = function(enemyGameboardObj, player, playerUp) {
        const displayBoard = document.getElementById(`${player}`).querySelector('.enemy-board');

        for (let i = 0; i < enemyGameboardObj.board.length; i++) {
            for (let j = 0; j < enemyGameboardObj.board[i].length; j++) {
                const boardIcon = document.createElement('img');
                displayBoard.appendChild(boardIcon);
                // if previous miss
                if (enemyGameboardObj.missedAttacks.has(`${i}${j}`)) {
                    boardIcon.src = '';
                }
                else if (enemyGameboardObj.board[i][j] == 'hit') {
                    boardIcon.src = enemyDamagedShipIcon;
                }
                else {
                    boardIcon.src = waveIcon;
                    if (player == playerUp) {
                        boardIcon.style.border = "0.7px solid rgba(0, 0, 0, 0.62)";
                        boardIcon.addEventListener('click', () => {
                            enemyGameboardObj.receiveAttack(i, j);
                            if (enemyGameboardObj.board[i][j] == null) {
                                animateMissedAttack(player, i, j);
                                setTimeout(() => { // to let the animation finish
                                    gameRunner.nextTurn();
                                }, 2000)
                            }
                            else {
                                gameRunner.nextTurn();
                            }
                        });
                    }
                }
            }
        }
    }

    const animateMissedAttack = function(offensivePlayer, row, col) {
        const defensivePlayer = offensivePlayer == 'player1' ? 'player2' : 'player1';
        
        const attackersBoard = document.getElementById(`${offensivePlayer}`).querySelector('.enemy-board');
        const defendersBoard = document.getElementById(`${defensivePlayer}`).querySelector('.player-board');
        
        const offensivePositionIcon = attackersBoard.querySelectorAll('img')[row * 10 + col];
        offensivePositionIcon.src = '';
        offensivePositionIcon.style.border = "none";
        
        const defensivePositionIcon = defendersBoard.querySelectorAll('img')[row * 10 + col];
        defensivePositionIcon.src = cannonBallIcon;
        defensivePositionIcon.classList.add('cannon-ball-fade');
        setTimeout(() => {
            defensivePositionIcon.style.opacity = "0";
        }, 1000);

    }

    // param 'boardType' is a string 'player' or 'enemy' referring to which of the player's boards to clear
    // remove all img elements from the specified board
    const clearBoard = function(player, boardType) {
        const playersBoards = document.getElementById(`${player}`);
        const boardToClear = boardType == 'player' ? playersBoards.querySelector('.player-board') : playersBoards.querySelector('.enemy-board');
        let imgElements = boardToClear.querySelectorAll('img');
        for (let i = 0; i < imgElements.length; i++) {
            boardToClear.removeChild(imgElements[i]);
        }
    }

    // param 'boardType' is a string 'player' or 'enemy' referring to which of the player's boards to clear
    const refreshBoards = function(playerBoard1, playerBoard2, playerUp) {
        display.clearBoard('player1', 'player');
        display.clearBoard('player1', 'enemy');
        display.clearBoard('player2', 'player');
        display.clearBoard('player2', 'enemy');

        display.displayPlayerBoard(playerBoard1, 'player1');
        display.displayEnemyBoard(playerBoard2, 'player1', playerUp);
        display.displayPlayerBoard(playerBoard2, 'player2');
        display.displayEnemyBoard(playerBoard1, 'player2', playerUp);
    }

    const displayWhichPlayersTurn = function(player) {
        const playerUpsHeader = player == 'player1' ? document.getElementById('player-one-header') : document.getElementById('player-two-header');
        const otherPlayersHeader = player == 'player1' ? document.getElementById('player-two-header') : document.getElementById('player-one-header');

        playerUpsHeader.style.visibility = 'visible';
        otherPlayersHeader.style.visibility = 'hidden';
    }

    const displayWinner = function(winningPlayer) {
        const winningPlayersHeader = winningPlayer == 'player1' ? document.getElementById('player-one-header') : document.getElementById('player-two-header');
        const otherPlayersHeader = winningPlayer == 'player1' ? document.getElementById('player-two-header') : document.getElementById('player-one-header');

        winningPlayersHeader.textContent = `${winningPlayer} wins!`;
        winningPlayersHeader.style.visibility = 'visible';
        otherPlayersHeader.textContent = `${winningPlayer} wins!`;
        otherPlayersHeader.style.visibility = 'visible';
    }

    return { displayPlayerBoard, displayEnemyBoard, clearBoard, refreshBoards, animateMissedAttack, displayWhichPlayersTurn, displayWinner };
})()

export default display;