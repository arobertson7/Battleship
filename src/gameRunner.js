import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import Player from './Player.js';

const gameRunner = (function() {
    // returns random int between 0-9 
    const getRandomCoordinate = function() {
        return Math.floor(Math.random() * 10);
    }

    const initializeBoard = function(board) {
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

    const playGame = function(player1, player2) {
        initializeBoard(player1.playerBoard);
        initializeBoard(player2.playerBoard);


    }

    return { playGame, initializeBoard }
})();

export default gameRunner;