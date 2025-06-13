import Gameboard from './Gameboard.js'

// an object used for helping the computer track a ship after making a succesful attack
class HitTracker {
    // takes the coordinates of the succesful attack and the target board obj
    constructor(row, col, targetBoard) {
        this.potentialTargets = this.getPossibleTargets(row, col, targetBoard);
    }

    // takes the coordinates of the succesful attack
    getPossibleTargets(row, col, targetBoard) {
        let up = [row - 1, col];
        let left = [row, col - 1];
        let down = [row + 1, col];
        let right = [row, col + 1];

        let fourDirectionCoordinates = [up, left, down, right];

        let validTargets = [];
        for (let i = 0; i < fourDirectionCoordinates.length; i++) {
            const coordinate = fourDirectionCoordinates[i];
            const row = coordinate[0];
            const col = coordinate[1];
            // if in bounds
            if (row >= 0 && row < 9 && col >= 0 && col < 9) {
                // if not already a missed attack
                if (!targetBoard.missedAttacks.has(`${row}${col}`)) {
                    // and if not already a succesful attack
                    if (targetBoard.board[row][col] != 'hit') {
                        validTargets.push(coordinate);
                    }
                } 
            }
        }
        return validTargets.length != 0 ? validTargets : null;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.playerBoard = new Gameboard();
        this.enemyBoard = new Gameboard(); //  in retrospect this isn't necessary to have
        this.isComputer = false;

        // only used by Computer player
        this.recentHitTracker = null;
    }

    playSmartComputerTurn(targetBoard) {
        // if no tracker, then no recent hit. just go for random attack
        if (!this.recentHitTracker) {
            return this.playRandomComputerTurn(targetBoard);
        }
        // hit tracker returned no valid targets, erase it from computerPlayer and play random move
        else if (!this.recentHitTracker.potentialTargets) {
            this.recentHitTracker = null;
            return this.playRandomComputerTurn(targetBoard);
        }
        // else try smart attack
        else {
            const targets = this.recentHitTracker.potentialTargets;
            const chosenTarget = targets[targets.length - 1];
            targets.pop();
            if (targets.length == 0) {
                this.recentHitTracker = null;
            }
            // hitTracker already vetted for invalid and repeat attacks
            targetBoard.receiveAttack(chosenTarget[0], chosenTarget[1]);
            return [chosenTarget[0], chosenTarget[1]];
        }
    }

    // returns an array with the played coordinates: ex: returns [row, col]
    playRandomComputerTurn(targetBoard) {
        if (this.isComputer) {
            // returns random int between 0-9 
            const getRandomCoordinate = function() {
                return Math.floor(Math.random() * 9);
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

export { Player, HitTracker };