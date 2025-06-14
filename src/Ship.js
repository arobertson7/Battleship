import HashMap from "./hash-map/hashMap.js";

class Ship {
    constructor(name, length) {
        this.name = name
        this.length = length;
        this.hitsTaken = 0;
        this.sunk = false;

        // mod
        this.direction = 'horizontal';
        this.hitPositions = new HashMap();
    }

    hit(row, col) {
        this.hitsTaken++;
        this.markPositionHit(row, col);

        if (this.hitsTaken >= this.length) {
            this.sunk = true;
        }
    }

    isSunk() {
        this.hitsTaken >= this.length ? this.sunk = true : this.sunk = false;
        return this.sunk;
    }

    // mod
    toggleDirection() {
        this.direction == 'horizontal' ? this.direction = 'vertical' : this.direction = 'horizontal';
    }

    // mod
    positionIsHit(row, col) {
        return this.hitPositions.has(`${row}${col}`);
    }

    markPositionHit(row, col) {
        this.hitPositions.set(`${row}${col}`, true);
    }
}

export default Ship;