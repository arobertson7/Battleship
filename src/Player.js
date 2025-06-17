import Gameboard from './Gameboard.js'

// an object used for helping the computer track a ship after making a succesful attack
class HitTracker {
    // takes the coordinates of the succesful attack and the target board obj
    constructor(row, col, targetBoard) {
        this.hitLocation = [row, col];
        this.potentialTargets = this.getAdjacentTargets(row, col, targetBoard);
    }

    // takes the coordinates of the succesful attack
    getAdjacentTargets(row, col, targetBoard) {
        let up = [row - 1, col];
        let left = [row, col - 1];
        let down = [row + 1, col];
        let right = [row, col + 1];

        let fourDirectionCoordinates = [up, left, down, right];

        // shuffle the order of directions the computer will attempt going in
        for (let i = 0; i < 10; i++) {
            // get 2 random positions on from the board
            let index1 = Math.floor(Math.random() * 4);
            let index2 = Math.floor(Math.random() * 4);

            // swap them in the array
            let temp = fourDirectionCoordinates[index1];
            fourDirectionCoordinates[index1] = fourDirectionCoordinates[index2];
            fourDirectionCoordinates[index2] = temp;
        }

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
                    if (!targetBoard.board[row][col] || !targetBoard.board[row][col].positionIsHit(row, col)) {
                        validTargets.push(coordinate);
                    }
                } 
            }
        }
        return validTargets.length != 0 ? validTargets : null;
    }
}

class AdvancedHitTracker {
    // takes the coordinates of the succesful attack and the target board obj
    constructor(previousHitLocation, curHitLocation, targetBoard) {
        this.hitLocation = [curHitLocation[0], curHitLocation[1]];
        this.potentialTargets = this.getTargets(previousHitLocation, curHitLocation, targetBoard);
    }

    getTargets(previousHitLocation, curHitLocation, targetBoard) {
        // determine the direction of the new hit in relation to the original hit
        const prevHitRow = previousHitLocation[0]; // 3
        const curHitRow = curHitLocation[0]; // 3
        const prevHitCol = previousHitLocation[1]; // 4
        const curHitCol = curHitLocation[1]; // 1

        let coordinateOnPath = null;
        let coordinateInOppositeDirection = null;

        if (prevHitRow == curHitRow) {
            // ship is horizontal
            if (curHitCol > prevHitCol) {
                // moving right
                coordinateOnPath = this.findNextAttackLocation(targetBoard, curHitRow, curHitCol, 'right');
                coordinateInOppositeDirection = this.findNextAttackLocation(targetBoard, curHitRow, curHitCol, 'left');
            }
            else if (curHitCol < prevHitCol) {
                // moving left
                coordinateOnPath = this.findNextAttackLocation(targetBoard, curHitRow, curHitCol, 'left');
                coordinateInOppositeDirection = this.findNextAttackLocation(targetBoard, curHitRow, curHitCol, 'right');
            }
        }
        else if (prevHitCol == curHitCol) {
            // ship is vertical
            if (curHitRow > prevHitRow) {
                // moving down
                coordinateOnPath = this.findNextAttackLocation(targetBoard, curHitRow, curHitCol, 'down');
                coordinateInOppositeDirection = this.findNextAttackLocation(targetBoard, curHitRow, curHitCol, 'up');
            }
            else if (curHitRow < prevHitRow) {
                // moving up
                coordinateOnPath = this.findNextAttackLocation(targetBoard, curHitRow, curHitCol, 'up');
                coordinateInOppositeDirection = this.findNextAttackLocation(targetBoard, curHitRow, curHitCol, 'down');
            }
        }

        let validTargets = [];
        if (coordinateInOppositeDirection) {
            validTargets.push(coordinateInOppositeDirection);
        }
        if (coordinateOnPath) {
            validTargets.push(coordinateOnPath);
        }
        return validTargets.length != 0 ? validTargets : null;
    }

    // returns [row, col] of next attack location if valid, null otherwise
    findNextAttackLocation(targetBoard, curHitRow, curHitCol, movementDirection) {
        let staticIndex;
        let colPtr = curHitCol;
        let rowPtr = curHitRow;
        let dx;
        switch(true) {
            case movementDirection == 'right':
                staticIndex = 'row';
                colPtr++;
                dx = 1;
                break;
            case movementDirection == 'down':
                staticIndex = 'col';
                rowPtr++;
                dx = 1;
                break;
            case movementDirection == 'left':
                staticIndex = 'row';
                colPtr--;
                dx = -1;
                break;
            case movementDirection == 'up':
                staticIndex = 'col';
                rowPtr--;
                dx = -1;
                break;
        }

        while (rowPtr >= 0 && rowPtr < 9 && colPtr >= 0 && colPtr < 9) {
            // missed attack spot
            if (targetBoard.missedAttacks.has(`${rowPtr}${colPtr}`)) {
                return null;
            }
            // unattempted spot
            else if (targetBoard.board[rowPtr][colPtr] == null) {
                return [rowPtr, colPtr];
            }
            // also unattemped spot
            else if (!targetBoard.board[rowPtr][colPtr].positionIsHit(rowPtr, colPtr)) {
                return [rowPtr, colPtr];
            }
            // else it's an already hit position, keep moving along
            else {
                staticIndex == 'row' ? colPtr += dx : rowPtr += dx;
            }
        }
        return null;
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
        let targetRow;
        let targetCol;

        // if no tracker, then no recent hit. just go for random attack
        if (!this.recentHitTracker) {
            const targetCoordinates = this.playRandomComputerTurn(targetBoard);
            targetRow = targetCoordinates[0];
            targetCol = targetCoordinates[1];
        }
        // hit tracker returned no valid targets, erase it from computerPlayer and play random move
        else if (!this.recentHitTracker.potentialTargets) {
            this.recentHitTracker = null;
            const targetCoordinates = this.playRandomComputerTurn(targetBoard);
            targetRow = targetCoordinates[0];
            targetCol = targetCoordinates[1];
        }
        // else try smart attack
        else {
            const targets = this.recentHitTracker.potentialTargets;
            const chosenTarget = targets[targets.length - 1];
            targets.pop();
            if (targets.length == 0) {
                this.recentHitTracker.potentialTargets = null;
            }
            // hitTracker already vetted for invalid and repeat attacks
            targetBoard.receiveAttack(chosenTarget[0], chosenTarget[1]);

            targetRow = chosenTarget[0];
            targetCol = chosenTarget[1];
        }

        // LOGIC FOR IF THE ATTACK WAS SUCCESSFUL
        if (targetBoard.board[targetRow][targetCol] && targetBoard.board[targetRow][targetCol].positionIsHit(targetRow, targetCol)) {
            // if the ship is sunk, computer doesn't need to keep searching around it
            if (targetBoard.board[targetRow][targetCol].isSunk()) {
                this.recentHitTracker = null;
            }
            // if not sunk and computer is already using a hit tracker when this hit occurs, change it to an advanced hit tracker
            else if (this.recentHitTracker) {
                this.recentHitTracker = new AdvancedHitTracker(this.recentHitTracker.hitLocation, [targetRow, targetCol], targetBoard);
            }
            else {
                this.recentHitTracker = new HitTracker(targetRow, targetCol, targetBoard);
            }
        }

        return [targetRow, targetCol];
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

export { Player, HitTracker, AdvancedHitTracker };