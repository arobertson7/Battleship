import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import Player from './Player.js';
import display from './userDisplay.js';

const gameRunner = (function() {
    let player1;
    let player2;
    let turnNumber = 1;

    // returns random int between 0-9 
    const getRandomCoordinate = function() {
        return Math.floor(Math.random() * 10);
    }

    const initializeRandomBoard = function(board) {
        const carrier = new Ship(5);
        const battleship = new Ship(4);
        const cruiser = new Ship(3);
        const submarine = new Ship(3);
        const destroyer = new Ship(2);

        const ships = [carrier, battleship, cruiser, submarine, destroyer];

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

    const playGame = function(playerOne, playerTwo) {
        player1 = playerOne;
        player2 = playerTwo
        initializeRandomBoard(player1.playerBoard);
        initializeRandomBoard(player2.playerBoard);
        
        display.displayPlayerBoard(player1.playerBoard, 'player1');
        display.displayEnemyBoard(player2.playerBoard, 'player1', 'player1');
        display.displayPlayerBoard(player2.playerBoard, 'player2');
        display.displayEnemyBoard(player1.playerBoard, 'player2', 'player1');


    }

    const nextTurn = function() {
        if (player1.playerBoard.allShipsSunk() || player2.playerBoard.allShipsSunk()) {
            const winningPlayer = turnNumber % 2 == 1 ? 'player1' : 'player2';
            display.displayWinner(winningPlayer);
            return;
        }
        turnNumber++;
        const playerUp = turnNumber % 2 == 1 ? 'player1' : 'player2';
        display.displayWhichPlayersTurn(playerUp);

        display.refreshBoards(player1.playerBoard, player2.playerBoard, playerUp);

        // right now, computer is always player2
        if (turnNumber % 2 == 0) {
            setTimeout(() => {
                const computerCoordinates = player2.playComputerTurn(player1.playerBoard);
                const rowChoice = computerCoordinates[0];
                const colChoice = computerCoordinates[1];
                if (player1.playerBoard.board[rowChoice][colChoice] == null) {
                    display.animateMissedAttack('player2', rowChoice, colChoice);
                    setTimeout(() => { // to let the animation finish
                        nextTurn();
                    }, 2000)
                }
                else {
                    nextTurn();
                }
            }, 3000);
        }
    }

    return { playGame, initializeRandomBoard, nextTurn }
})();

export default gameRunner;