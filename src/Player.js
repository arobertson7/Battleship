import Gameboard from './Gameboard.js'

class Player {
    constructor(name) {
        this.name = name;
        this.playerBoard = new Gameboard();
        this.enemyBoard = new Gameboard();
        this.isComputer = false;
    }

    // returns an array with the played coordinates: ex: returns [row, col]
    playComputerTurn(targetBoard) {
        if (this.isComputer) {
            // returns random int between 0-9 
            const getRandomCoordinate = function() {
                return Math.floor(Math.random() * 10);
            }

            let moveMade = false;
            let row;
            let col;
            do {
                do {
                    row = getRandomCoordinate();
                    col = getRandomCoordinate();
                } while (targetBoard.missedAttacks.has(`${row}${col}`));

                moveMade = targetBoard.receiveAttack(row, col);
            } while (!moveMade);
            return [row, col];
        }
    }
}

export default Player;