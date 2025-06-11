import Ship from './Ship';
import Gameboard from './Gameboard';
import Player from './Player';
import gameRunner from './gameRunner';

// -----
// Ship
// -----

// ship()
test('ship constructor', () => {
    const ship = new Ship(5);
    expect(ship).toEqual({length: 5, hitsTaken: 0, sunk: false, direction: 'horizontal'});
})

// ship.hit()
test('1 hit taken', () => {
    const ship = new Ship(5);
    ship.hit();
    expect(ship.hitsTaken).toEqual(1);
})

// ship.hit()
test('3 hits taken', () => {
    const ship = new Ship(5);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.hitsTaken).toEqual(3);
})

// ship.isSunk()
test('not sunk', () => {
    const ship = new Ship(6);
    expect(ship.isSunk()).toBe(false);
})

// ship.isSunk()
test('not sunk', () => {
    const ship = new Ship(3);
    expect(ship.isSunk()).toBe(false);
})

// ship.isSunk()
test('not sunk', () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})

// ship.isSunk()
test('not sunk', () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})

// ship direction
test('horizontal', () => {
    const ship = new Ship(3);
    expect(ship.direction).toBe('horizontal');
})

// ship direction
test('vertical', () => {
    const ship = new Ship(3);
    ship.toggleDirection();
    expect(ship.direction).toBe('vertical');
})

// ----------
// Gameboard
// ----------

// Gameboard()
test('10x10 matrix with "nulls"', () => {
    const newBoard = new Gameboard();
    expect(newBoard.board).toEqual([[null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null]])
})

// Gameboard.placeShip()
test('ship placement', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(4);

    expect(newBoard.placeShip(ship, 0, 0)).toBe(true);

    expect(newBoard.board).toEqual([[ship, ship, ship, ship, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null]])
})

test('start row out of bounds', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(4);

    expect(newBoard.placeShip(ship, 10, 0)).toBe(false);

    expect(newBoard.board).toEqual([[null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null]])
})

test('end col out of bounds', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(8);

    expect(newBoard.placeShip(ship, 0, 3)).toBe(false);

    expect(newBoard.board).toEqual([[null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null]])
})

test('stretches whole row', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    expect(newBoard.placeShip(ship, 3, 0)).toBe(true);

    expect(newBoard.board).toEqual([[null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null]])
})

test('ship in the way of placement', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    newBoard.placeShip(ship, 3, 0);
    // board after that placement
    [[null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]];

    const ship2 = new Ship(3);

    expect(newBoard.placeShip(ship2, 3, 2)).toBe(false);
    expect(newBoard.board).toEqual([[null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null]]);
})

test('ship in the way of placement', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    newBoard.placeShip(ship, 3, 0);
    // board after that placement
    [[null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]];

    const ship2 = new Ship(3);
    ship2.toggleDirection();

    expect(newBoard.placeShip(ship2, 1, 0)).toBe(false);
    expect(newBoard.board).toEqual([[null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null]]);
})

test('ship not in the way of placement', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    newBoard.placeShip(ship, 3, 0);
    // board after that placement
    [[null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]];

    const ship2 = new Ship(3);

    expect(newBoard.placeShip(ship2, 4, 2)).toBe(true);
    expect(newBoard.board).toEqual([[null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
                        [null, null, ship2, ship2, ship2, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null, null]]);
})

// Gameboard.receiveAttack()
test('missed attack', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    newBoard.placeShip(ship, 3, 0);
    // board after that placement
    // [[null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null]];

    expect(newBoard.receiveAttack(0, 0)).toBe(false);
    expect(ship.hitsTaken).toBe(0);
    expect(newBoard.missedAttacks).toEqual([[0, 0]]);
})

test('position out of bounds', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    newBoard.placeShip(ship, 3, 0);
    // board after that placement
    // [[null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null]];

    expect(newBoard.receiveAttack(10, 0)).toBe(false);
    expect(ship.hitsTaken).toBe(0);
    expect(newBoard.missedAttacks).toEqual([]);
})

test('succesful attack (1st hit of 10)', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    newBoard.placeShip(ship, 3, 0);
    // board after that placement
    // [[null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null]];

    expect(newBoard.receiveAttack(3, 7)).toBe(true);
    expect(ship.hitsTaken).toBe(1);
    expect(ship.isSunk()).toBe(false);
    expect(newBoard.missedAttacks).toEqual([]);
})

test('succesful attack (sink ship) (1st hit of 1)', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(1);

    newBoard.placeShip(ship, 3, 4);
    // board after that placement
    // [[null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, SHIP, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null]];

    expect(newBoard.receiveAttack(3, 4)).toBe(true);
    expect(ship.hitsTaken).toBe(1);
    expect(ship.isSunk()).toBe(true);
    expect(newBoard.missedAttacks).toEqual([]);
})

// Gameboard.allShipsSunk()
test('not all ships sunk', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(1);

    newBoard.placeShip(ship, 3, 4);
    // board after that placement
    // [[null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, SHIP, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null]];

    expect(newBoard.allShipsSunk()).toBe(false);
})

test('all ships sunk', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    newBoard.placeShip(ship, 3, 0);
    // board after that placement
    // [[null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null]];

    for (let i = 0; i < 10; i++) {
        newBoard.receiveAttack(3, i);
    }
    expect(newBoard.allShipsSunk()).toBe(true);
})

test('not all ships sunk', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    newBoard.placeShip(ship, 3, 0);
    // board after that placement
    // [[null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null]];

    for (let i = 0; i < 9; i++) {
        newBoard.receiveAttack(3, i);
    }
    expect(newBoard.allShipsSunk()).toBe(false);
})

test('10 hits on same location, not sunk', () => {
    const newBoard = new Gameboard();
    const ship = new Ship(10);

    newBoard.placeShip(ship, 3, 0);
    // board after that placement
    // [[null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [ship, ship, ship, ship, ship, ship, ship, ship, ship, ship],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null],
    // [null, null, null, null, null, null, null, null, null, null]];

    for (let i = 0; i < 10; i++) {
        newBoard.receiveAttack(3, 3);
    }
    expect(newBoard.allShipsSunk()).toBe(false);
})

// ----------
// GameRunner
// ----------

// gameRunner.initializeRandomBoard
test('initialize random board', () => {
    const board = new Gameboard();
    gameRunner.initializeRandomBoard(board);

    let positionsFilled = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (board.board[i][j] != null) {
                positionsFilled++;
            }
        }
    }

    expect(positionsFilled).toBe(17);
})