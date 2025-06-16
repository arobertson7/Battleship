import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import { Player, HitTracker, AdvancedHitTracker } from './Player.js';
import display from './userDisplay.js';

const gameRunner = (function() {
    let player1;
    let player2;
    let turnNumber = 1;
    let gamesCompleted = 0;

    // returns random int between 0-9 
    const getRandomCoordinate = function() {
        return Math.floor(Math.random() * 10);
    }

    const initializeRandomBoard = function(board) {
        const carrier = new Ship('carrier', 5);
        const battleship = new Ship('battleship', 4);
        // const cruiser = new Ship(3);
        const submarine = new Ship('submarine', 3);
        const destroyer = new Ship('destroyer', 2);

        const ships = [carrier, battleship, submarine, destroyer];

        for (let i = 0; i < ships.length; i++) {
            const curShip = ships[i];
            const directionChoiceCoinFlip = Math.floor(Math.random() * 2);
            if (directionChoiceCoinFlip == 1) { curShip.toggleDirection() };

            let shipPlaced = false;
            do {    
                shipPlaced = board.placeShip(curShip, getRandomCoordinate(), getRandomCoordinate());
            } while (!shipPlaced);
        }
    }

    const playGame = async function() {
        player1 = new Player();
        player2 = new Player();
        player2.isComputer = true;

        initializeRandomBoard(player1.playerBoard);
        initializeRandomBoard(player2.playerBoard);

        if (gamesCompleted == 0) {
            await display.showRules();
        }
        await playerPlaceShips();
        display.setUpGameDisplay(player1.playerBoard, player2.playerBoard);

    }

    const nextTurn = function() {
        if (player1.playerBoard.allShipsSunk() || player2.playerBoard.allShipsSunk()) {
            const winningPlayer = turnNumber % 2 == 1 ? 'player1' : 'player2';
            const losingBoard = winningPlayer == 'player1' ? player2.playerBoard : player1.playerBoard;
            display.displayWinner(winningPlayer, losingBoard);
            return;
        }

        turnNumber++;
        const playerUp = turnNumber % 2 == 1 ? 'player1' : 'player2';
        display.displayWhichPlayersTurn(playerUp);

        display.refreshBoards(player1.playerBoard, player2.playerBoard, playerUp);

        // right now, computer is always player2
        if (turnNumber % 2 == 0) {
            setTimeout(() => {
                const computerCoordinates = player2.playSmartComputerTurn(player1.playerBoard);
                const rowChoice = computerCoordinates[0];
                const colChoice = computerCoordinates[1];
                if (player1.playerBoard.board[rowChoice][colChoice] == null) {
                    display.animateMissedAttack('player2', rowChoice, colChoice);
                    setTimeout(() => { // to let the animation finish
                        nextTurn();
                    }, 2000)
                }
                else if (player1.playerBoard.board[rowChoice][colChoice].positionIsHit(rowChoice, colChoice)) {
                    // if computer is already using a hit tracker when this hit occurs, change it to an advanced hit tracker
                    if (player2.recentHitTracker) {
                        player2.recentHitTracker = new AdvancedHitTracker(player2.recentHitTracker.hitLocation, computerCoordinates, player1.playerBoard);
                        nextTurn();
                    }
                    else {
                        player2.recentHitTracker = new HitTracker(rowChoice, colChoice, player1.playerBoard);
                        nextTurn();
                    }
                }
                else {
                    nextTurn();
                }
            }, 3000);
        }
    }

    const playerPlaceShips = async function() {
        display.showBoardChoices(player1);
        display.displayPlayerBoard(player1.playerBoard, 'select-board-display');

        return new Promise((resolve) => {
            const confirmBoardButton = document.getElementById('confirm-board-button');
            confirmBoardButton.addEventListener('click', () => {
                if (!document.querySelector('.finger')) {
                    resolve(true);
                }
            })
        })
    }

    const startNewGame = function() {
        display.clearLastGameDisplay();
        gamesCompleted++;
        turnNumber = 1;
        playGame();
    }

    return { playGame, initializeRandomBoard, nextTurn, startNewGame }
})();

export default gameRunner;