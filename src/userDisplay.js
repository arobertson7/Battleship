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
import singleWaveIcon from './single-wave.svg';

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
            const offensivePositionIcon = attackersBoard.querySelectorAll('img')[row * 9 + col];
            offensivePositionIcon.src = '';
            offensivePositionIcon.style.border = "none";
            // offensivePositionIcon.style.outline = "none";
        }
        else if (defensivePlayer == 'player1') {
            const defendersBoard = document.getElementById(`${defensivePlayer}`).querySelector('.player-board');
            const defensivePositionIcon = defendersBoard.querySelectorAll('img')[row * 9 + col];
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
        const losersBoard = winningPlayer == 'player1' ? document.querySelector('.enemy-board') : document.querySelector('.player-board');
        const winnersBoard = winningPlayer == 'player1' ? document.querySelector('.player-board') : document.querySelector('.enemy-board');

        // remove icon borders if player one
        if (winningPlayer == 'player1') {
            const icons = losersBoard.querySelectorAll('img');
            for (let i = 0; i < icons.length; i++) {
                icons[i].style.border = 'none';
            }
        }

        dropBombsOnLosingBoard(losersBoard);

        setTimeout(() => {
            const losingBoardIcons = losersBoard.querySelectorAll('img');
            for (let i = 0; i < losingBoardIcons.length; i++) {
                losingBoardIcons[i].style.opacity = '0';
                setTimeout(() => {
                    losersBoard.removeChild(losingBoardIcons[i]);
                }, 800);
            }
        }, 8200);
        setTimeout(() => {
            const winningMessageContainer = document.createElement('div');
            winningMessageContainer.style.opacity = '0';
            winningMessageContainer.classList.add('game-over-board-fade-2');
            winningMessageContainer.id = 'winning-message-container';
            losersBoard.appendChild(winningMessageContainer);

            const message = document.createElement('h2');
            const playAgainButton = document.createElement('button');
            winningMessageContainer.appendChild(message);
            winningMessageContainer.appendChild(playAgainButton);

            message.textContent = winningPlayer == 'player1' ? 'You won!' : 'Defeated.';
            playAgainButton.textContent = winningPlayer == 'player1' ? 'Play again' : 'Try again';

            losersBoard.classList.add('game-over-board-fade');
            setTimeout(() => {
                winningMessageContainer.style.opacity = '1';
            }, 20)
            losersBoard.style.backgroundColor = winningPlayer == 'player1' ? 'rgb(47, 181, 93)' : 'rgba(167, 24, 72, 0.87)';

            // playAgainButton.addEventListener('click', () => {

            // })
        }, 9050);
    }

    const dropBombsOnLosingBoard = function(board) {
        const allBoardPositions = board.querySelectorAll('img');

        // shuffle and array of indexes 0-99
        const shuffledIndexes = [];
        for (let i = 0; i < allBoardPositions.length; i++) {
            shuffledIndexes.push(i);
        }
        for (let i = 0; i < 100; i++) {
            // get 2 random positions on from the board
            let index1 = Math.floor(Math.random() * allBoardPositions.length);
            let index2 = Math.floor(Math.random() * allBoardPositions.length);

            // swap them in the array
            let temp = shuffledIndexes[index1];
            shuffledIndexes[index1] = shuffledIndexes[index2];
            shuffledIndexes[index2] = temp;
        }

        // now that positions are shuffled
        let timer = 0;
        for (let i = 0; i < shuffledIndexes.length; i++) {
            const randomIndex = shuffledIndexes[i];
            const randomIcon = allBoardPositions[randomIndex];

            dropSingleBomb(randomIcon, timer);
            timer += 50;
        }
    }

    const dropSingleBomb = function(icon, timer) {
        setTimeout(() => {
            setTimeout(() => {
                icon.style.opacity = '0';
                icon.src = cannonBallIcon;
                icon.classList.add('cannon-ball-fade-fast');
                icon.style.opacity = "1";
            }, 50);

            setTimeout(() => {
                icon.classList.remove('cannon-ball-fade-fast');
                icon.classList.add('cannon-ball-fade');
            }, 550)
            setTimeout(() => {
                icon.style.opacity = "0";
            }, 1000)
            setTimeout(() => {
                icon.src = singleWaveIcon;
                icon.style.opacity = '1';
            }, 1800)
        }, timer);
    }

    const showBoardChoices = function(player) {
        const container = document.querySelector('.container');

        const chooseBoardMessage = document.createElement('h2');
        chooseBoardMessage.id = 'chooseBoardMessage';
        chooseBoardMessage.textContent = 'Choose your formation';
        container.appendChild(chooseBoardMessage);

       
        const buttonsContainer = document.querySelector('.options-buttons');

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

        const finger = document.createElement('p');
        finger.textContent = '👆';
        finger.classList.add('finger');
        finger.style.visibility = 'hidden';
        refreshBoardButton.appendChild(finger);
        setTimeout(() => {
            finger.style.visibility = 'visible';
            zoomFinger(finger, -150, -100);
        }, 1500);
        setTimeout(() => {
            const newBoard = new Gameboard();
            gameRunner.initializeRandomBoard(newBoard);
            player.playerBoard = newBoard;
            clearBoard('select-board-display', 'player');
            displayPlayerBoard(newBoard, 'select-board-display');
            refreshBoardButton.style.boxShadow = 'inset 2px 2px 2px 2px rgba(0, 0, 0, 0.381)';
        }, 2600);
        setTimeout(() => {
            refreshBoardButton.removeChild(finger);
            refreshBoardButton.style.boxShadow = null;
        }, 3400)
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
        timer += 1500;
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
        timer += 100;
        setTimeout(() => {
            const finger2 = document.createElement('p');
            finger2.textContent = '👆';
            finger2.classList.add('finger2');
            container.appendChild(finger2);

            zoomFinger(finger2, -20, -10);
        }, timer);
        timer += 1000;
        setTimeout(() => {
            const enemyBoardDiv = document.querySelector('.enemy-board');
            const enemyBoardIcons = enemyBoard.querySelectorAll('img');
            enemyBoardIcons[46].src = cannonBallIcon;
        }, timer);

        timer += 1250;
        setTimeout(() => {
            const finger2 = document.querySelector('.finger2');
            container.removeChild(finger2);
            const enemyBoardDiv = document.querySelector('.enemy-board');
            const enemyBoardIcons = enemyBoard.querySelectorAll('img');
            enemyBoardIcons[46].src = waveIcon;
        }, timer);
    }

    const showRules = async function() {
        const container = document.querySelector('.container');
        const opener = document.getElementById('opener');
        container.removeChild(opener);

        const rulesMessage = document.createElement('h2');
        rulesMessage.id = 'rules-message';
        rulesMessage.textContent = 'How To Play';
        container.appendChild(rulesMessage);

        const selectBoardDisplay = document.createElement('div');
        selectBoardDisplay.id = 'select-board-display';
        const board = document.createElement('div');
        board.classList.add('player-board');
        selectBoardDisplay.appendChild(board);
        container.appendChild(selectBoardDisplay);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('options-buttons');
        selectBoardDisplay.appendChild(buttonsContainer);
        const letsGoButton = document.createElement('button');
        letsGoButton.id = 'lets-go-button';
        letsGoButton.textContent = "Let's Go →";
        buttonsContainer.appendChild(letsGoButton);

        const rulesContainer = document.createElement('div');
        rulesContainer.id = 'rules-container';
        board.appendChild(rulesContainer);
        const rule1 = document.createElement('p');
        rule1.textContent = '• Each player places 5 ships on their board, unseen by their opponent.';
        const rule2 = document.createElement('p');
        rule2.textContent = "• Players take turns trying to find and attack their opponent's ships.";
        const rule3 = document.createElement('p');
        rule3.textContent = "• The first player to sink all of their opponent's ships wins.";
        const rule4 = document.createElement('p');
        rule4.textContent = "• Place your ships strategically!";
        rulesContainer.appendChild(rule1);
        rulesContainer.appendChild(rule2);
        rulesContainer.appendChild(rule3);
        rulesContainer.appendChild(rule4);

        return new Promise((resolve) => {
            letsGoButton.addEventListener('click', () => {
                container.removeChild(rulesMessage);
                buttonsContainer.removeChild(letsGoButton);
                board.removeChild(rulesContainer);
                board.style.backgroundColor = "rgba(255,255,255,0)";
                resolve(true);
            })
        })
    }

    // assumes that the finger element starts at font-sice of 8rem. takes it down to 3rem
    const zoomFinger = function(fingerDOMElement, startTop, startRight) {
        let curSize = 8.00;
        let curTop = startTop;
        let curRight = startRight;
        
        let timer = 0;
        for (let i = 0; i < 500; i++) {
            timer += 2;
            curSize -= .01;
            curSize = curSize.toFixed(2);
            curTop += 0.34;
            curRight += 0.25;
            zoomHelper(fingerDOMElement, curSize, curTop, curRight, timer);
        }
    }

    const zoomHelper = function(fingerDOMElement, newFingerSize, newTop, newRight, timer) {
        setTimeout(() => {
            fingerDOMElement.style.fontSize = `${newFingerSize}rem`;
            fingerDOMElement.style.top = `${newTop}px`;
            fingerDOMElement.style.right = `${newRight}px`;
        }, timer);
    }

    return { displayPlayerBoard, displayEnemyBoard, clearBoard, refreshBoards, animateMissedAttack, displayWhichPlayersTurn, displayWinner, showBoardChoices, setUpGameDisplay, showRules };
})()

export default display;