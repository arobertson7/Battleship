import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import { Player, HitTracker } from './Player.js';
import gameRunner from './gameRunner';
import display from './userDisplay.js';
import './styles.css'
import waveIcon from './wave.svg';

const playGameButton = document.getElementById('play-game-button');
playGameButton.addEventListener('click', () => {
    gameRunner.playGame();
})