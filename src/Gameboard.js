class Gameboard {
    constructor() {
        this.board = []; // 10x10 matrix
        for (let i = 0; i < 10; i++) {
            this.board.push([]);
            for (let j = 0; j < 10; j++) {
                this.board[i].push(null);
            }
        }

        this.missedAttacks = [];
    }

    placeShip(ship, startRow, startCol) {
        // check that coordinates are in bounds
        let endRow = startRow;
        let endCol = startCol;
        ship.direction == 'horizontal' ? endCol += ship.length - 1 : endRow += ship.length - 1;
        if (startRow < 0 || endRow >= 10 || startCol < 0 || endCol >= 10) {
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

    receiveAttack(row, col) {
        // position out of bounds
        if (row < 0 || row >= 10 || col < 0 || col >= 10) {
            return false;
        }

        // attack is a miss
        if (!this.board[row][col]) {
            this.missedAttacks.push([row, col]);
            return false;
        }
        // attack is a hit
        else {
            const targetedShip = this.board[row][col];
            if (!targetedShip.isSunk()) {
                targetedShip.hit();
            }
            return true;
        }
    }

    allShipsSunk() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] != null) {
                    const ship = this.board[i][j];
                    if (!ship.isSunk()) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}

export default Gameboard;