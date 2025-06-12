import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import { Player, HitTracker } from './Player.js';
import gameRunner from './gameRunner';
import waveIcon from './big-waves.svg';
import shipIcon from './ship.svg';
import damagedShipIcon from './damaged-ship.svg';
import enemyDamagedShipIcon from './enemy-damaged-ship.svg';
import cannonBallIcon from './cannon-ball.png';
import refreshIcon from './refresh.svg';

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
                        boardIcon.style.border = "0.7px solid rgba(0, 0, 0, 0.37)";
                        boardIcon.addEventListener('click', () => {
                            enemyGameboardObj.receiveAttack(i, j);
                                gameRunner.nextTurn();
                        });
                    }
                }
            }
        }
    }

    const animateMissedAttack = function(offensivePlayer, row, col) {
        const defensivePlayer = offensivePlayer == 'player1' ? 'player2' : 'player1';
                
        if (offensivePlayer == 'player1') {
            const attackersBoard = document.getElementById(`${offensivePlayer}`).querySelector('.enemy-board');
            const offensivePositionIcon = attackersBoard.querySelectorAll('img')[row * 10 + col];
            offensivePositionIcon.src = '';
            offensivePositionIcon.style.border = "none";
            // offensivePositionIcon.style.outline = "none";
        }
        else if (defensivePlayer == 'player1') {
            const defendersBoard = document.getElementById(`${defensivePlayer}`).querySelector('.player-board');
            const defensivePositionIcon = defendersBoard.querySelectorAll('img')[row * 10 + col];
            defensivePositionIcon.src = cannonBallIcon;
            defensivePositionIcon.style.opacity = "0";
        
            setTimeout(() => {
                defensivePositionIcon.classList.add('cannon-ball-fade-fast');
                defensivePositionIcon.style.opacity = "1";
            }, 50);

            setTimeout(() => {
                defensivePositionIcon.classList.remove('cannon-ball-fade-fast');
                defensivePositionIcon.classList.add('cannon-ball-fade');
            }, 550)
            setTimeout(() => {
                defensivePositionIcon.style.opacity = "0";
            }, 1000)

        }    
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

        display.displayPlayerBoard(playerBoard1, 'player1');
        display.displayEnemyBoard(playerBoard2, 'player1', playerUp);
    }

    const displayWhichPlayersTurn = function(player) {
        // 'Your turn!' : "Computer's Turn";
    }

    const displayWinner = function(winningPlayer) {
        const winningPlayersHeader = winningPlayer == 'player1' ? document.getElementById('player-one-header') : document.getElementById('player-two-header');
        const otherPlayersHeader = winningPlayer == 'player1' ? document.getElementById('player-two-header') : document.getElementById('player-one-header');

        winningPlayersHeader.textContent = `${winningPlayer} wins!`;
        winningPlayersHeader.style.visibility = 'visible';
        otherPlayersHeader.textContent = `${winningPlayer} wins!`;
        otherPlayersHeader.style.visibility = 'visible';
    }

    const showBoardChoices = function(player) {
        const container = document.querySelector('.container');
        const opener = document.getElementById('opener');
        container.removeChild(opener);

        const chooseBoardMessage = document.createElement('h2');
        chooseBoardMessage.id = 'chooseBoardMessage';
        chooseBoardMessage.textContent = 'Choose a formation';
        container.appendChild(chooseBoardMessage);

        const selectBoardDisplay = document.createElement('div');
        selectBoardDisplay.id = 'select-board-display';
        const board = document.createElement('div');
        board.classList.add('player-board');
        selectBoardDisplay.appendChild(board);
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('options-buttons');
        selectBoardDisplay.appendChild(buttonsContainer);
        const refreshBoardButton = document.createElement('button');
        refreshBoardButton.textContent = 'Generate';
        const refreshSVG = document.createElement('img');
        refreshSVG.id = 'refresh-icon';
        refreshSVG.src = refreshIcon;
        refreshBoardButton.appendChild(refreshSVG);
        refreshBoardButton.addEventListener('click', () => {
            const newBoard = new Gameboard();
            gameRunner.initializeRandomBoard(newBoard);
            player.playerBoard = newBoard;
            clearBoard('select-board-display', 'player');
            displayPlayerBoard(newBoard, 'select-board-display');
        })

        refreshBoardButton.id = 'refresh-board-button';
        const confirmBoardButton = document.createElement('button');
        confirmBoardButton.textContent = "Confirm";
        confirmBoardButton.id = 'confirm-board-button';

        buttonsContainer.appendChild(refreshBoardButton);
        buttonsContainer.appendChild(confirmBoardButton);
        container.appendChild(selectBoardDisplay);
    }

    const setUpGameDisplay = function(playerBoardObj, enemyBoardObj) {
        // clear container
        const container = document.querySelector('.container');
        for (let i = container.childNodes.length - 1; i >= 0; i--) {
            container.removeChild(container.childNodes[i]);
        }

        // set up game display
        const game = document.createElement('div');
        game.id = 'game';
        container.appendChild(game);

        const player1 = document.createElement('div');
        player1.id = 'player1';
        game.appendChild(player1);

        const enemyBoard = document.createElement('div');
        player1.appendChild(enemyBoard);
        enemyBoard.classList.add('enemy-board');
        displayEnemyBoard(enemyBoardObj, 'player1', 'player1');
        enemyBoard.style.opacity = '0';
        enemyBoard.classList.add('temp-message-fade');

        const playerBoard = document.createElement('div');
        player1.appendChild(playerBoard);
        playerBoard.classList.add('player-board');
        displayPlayerBoard(playerBoardObj, 'player1');
        playerBoard.style.opacity = '0';
        playerBoard.classList.add('temp-message-fade');

        // explain the board layout
        const tempDivider = document.createElement('div');
        tempDivider.classList.add('temp-divider');
        game.appendChild(tempDivider);
        const playerSideMessageContainer = document.createElement('div');
        const playerSideMessage = document.createElement('h3');
        playerSideMessage.textContent = 'Your fleet is here ↓';
        playerSideMessageContainer.appendChild(playerSideMessage);
        playerSideMessageContainer.style.opacity = '0';
        playerSideMessageContainer.classList.add('temp-message-container');
        playerSideMessageContainer.classList.add('temp-message-fade');
        const enemySideMessageContainer = document.createElement('div');
        enemySideMessageContainer.style.opacity = '0';
        const enemySideMessage = document.createElement('h3');
        enemySideMessage.textContent = 'The enemy is here👀';
        enemySideMessageContainer.appendChild(enemySideMessage);
        enemySideMessageContainer.classList.add('temp-message-container');
        enemySideMessageContainer.classList.add('temp-message-container-enemy');
        enemySideMessageContainer.classList.add('temp-message-fade');
        game.appendChild(playerSideMessageContainer);
        game.appendChild(enemySideMessageContainer);

        let timer = 500;
        setTimeout(() => {
            playerSideMessageContainer.style.opacity = "1";
        }, timer);
        timer += 2000;
        setTimeout(() => {
            playerSideMessageContainer.style.opacity = "0";
        }, timer);
        timer += 1000;
        setTimeout(() => {
            playerBoard.style.opacity = '1';
        }, timer);
        timer += 1500;
        setTimeout(() => {
            enemySideMessageContainer.style.opacity = "1"
        }, timer);
        timer += 2000;
        setTimeout(() => {
            enemySideMessageContainer.style.opacity = "0";
        }, timer);
        timer += 1000;
        setTimeout(() => {
            enemySideMessageContainer.classList.remove('temp-message-fade');
            enemySideMessage.textContent = 'Attack!';
            enemySideMessageContainer.style.opacity = "1";
        }, timer);
        timer += 1000;
        setTimeout(() => {
            enemySideMessageContainer.classList.add('temp-message-fade-fast');
            enemySideMessageContainer.style.opacity = "0";
            enemyBoard.style.opacity = '1';
        }, timer);
        timer += 1000;
        setTimeout(() => {
            playerBoard.classList.remove('temp-message-fade');
            enemyBoard.classList.remove('temp-message-fade');
            game.removeChild(tempDivider);
            game.removeChild(playerSideMessageContainer);
            game.removeChild(enemySideMessageContainer);
        }, timer);
        
    }

    return { displayPlayerBoard, displayEnemyBoard, clearBoard, refreshBoards, animateMissedAttack, displayWhichPlayersTurn, displayWinner, showBoardChoices, setUpGameDisplay };
})()

export default display;