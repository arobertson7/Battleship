class Ship {
    constructor(name, length) {
        this.name = name
        this.length = length;
        this.hitsTaken = 0;
        this.sunk = false;

        // mod
        this.direction = 'horizontal';
    }

    hit() {
        this.hitsTaken++;
        
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
}

export default Ship;