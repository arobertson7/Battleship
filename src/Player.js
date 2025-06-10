import Gameboard from './Gameboard.js'

class Player {
    constructor(name) {
        this.name = name;
        this.playerBoard = new Gameboard();
        this.enemyBoard = new Gameboard();
    }
}

class computerPlayer extends Player {

}

export default Player;