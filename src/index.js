import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import Player from './Player.js';
import gameRunner from './gameRunner';
import display from './userDisplay.js';
import './styles.css'
import waveIcon from './wave.svg';

const player1 = new Player();
const player2 = new Player();
player2.isComputer = true;

gameRunner.playGame(player1, player2);