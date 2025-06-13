import './Ship.js';
import HashMap from './hash-map/hashMap.js';

class Gameboard {
    constructor() {
        this.board = []; // 9x9 matrix
        for (let i = 0; i < 9; i++) {
            this.board.push([]);
            for (let j = 0; j < 9; j++) {
                this.board[i].push(null);
            }
        }

        this.missedAttacks = new HashMap();
        this.lastAttackLocation = null;
    }

    placeShip(ship, startRow, startCol) {
        // check that coordinates are in bounds
        let endRow = startRow;
        let endCol = startCol;
        ship.direction == 'horizontal' ? endCol += ship.length - 1 : endRow += ship.length - 1;
        if (startRow < 0 || endRow >= 9 || startCol < 0 || endCol >= 9) {
            return false;
        }

        // check that the position is available
        let rowPtr = startRow;
        let colPtr = startCol;
        for (let i = 0; i < ship.length; i++) {
            if (this.board[rowPtr][colPtr] != null) {
                return false;
            }
            // move in correct direction
            ship.direction == 'horizontal' ? colPtr++ : rowPtr++;
        }

        // if available, place ship
        rowPtr = startRow;
        colPtr = startCol;
        for (let i = 0; i < ship.length; i++) {
            this.board[rowPtr][colPtr] = ship;
            // move in correct direction
            ship.direction == 'horizontal' ? colPtr++ : rowPtr++;
        }
        return true;
    }

    // returns true if it was a valid attack, hit or miss, false if out of bounds or already successfully attacked position
    receiveAttack(row, col) {
        // position out of bounds
        if (row < 0 || row >= 9 || col < 0 || col >= 9) {
            return false;
        }

        // attack is a miss
        if (!this.board[row][col]) {
            this.missedAttacks.set(`${row}${col}`, true);
            this.lastAttackLocation = [row, col];
            return true;
        }
        // position already hit
        else if (this.board[row][col] == 'hit') {
            return false;
        }
        // attack is a hit
        else {
            const targetedShip = this.board[row][col];
            if (!targetedShip.isSunk()) {
                targetedShip.hit();
                this.board[row][col] = 'hit';
            }
            this.lastAttackLocation = [row, col];
            return true;
        }
    }

    allShipsSunk() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] != null) {
                    if (this.board[i][j] != 'hit') {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}

export default Gameboard;