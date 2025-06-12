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
    // const finger = document.createElement('p');
    // finger.classList.add('finger');
    // finger.textContent = '👆';
    // const container = document.querySelector('.container');
    // container.appendChild(finger);
    // zoomFinger(finger, 220.00, 50.00);

})

// assumes that the finger element starts at font-sice of 8rem. takes it down to 3rem
const zoomFinger = function(fingerDOMElement, startTop, startRight) {
    let curSize = 8.00;
    let curTop = startTop;
    let curRight = startRight;
    let timer = 0;
    for (let i = 0; i < 500; i++) {
        timer += 2;
        curSize -= .01;
        curSize = curSize.toFixed(2);
        curTop += 0.2;
        curRight += 0.2;
        zoomHelper(fingerDOMElement, curSize, curTop, curRight, timer);
    }
}

const zoomHelper = function(fingerDOMElement, newFingerSize, newTop, newRight, timer) {
    setTimeout(() => {
        fingerDOMElement.style.fontSize = `${newFingerSize}rem`;
        fingerDOMElement.style.top = `${newTop}px`;
        fingerDOMElement.style.right = `${newRight}px`;
        console.log('done');
    }, timer);
}