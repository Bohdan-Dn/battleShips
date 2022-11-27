const DOM = {
    messageArea: document.getElementById('messageArea'),
    fireButton: document.getElementById('fireButton'),
    gessInput: document.getElementById('guessInput')
}

const view = {
    displayMessage: function (msg) {
        DOM.messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        const cell = document.getElementById(location);
        cell.setAttribute('class', 'board__hit');
    },

    displayMiss: function (location) {
        const cell = document.getElementById(location);
        cell.setAttribute('class', 'board__miss');
    }
};

const model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] }
    ],

    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT');
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed.');
        return false;
    },

    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function () {
        let direction = Math.random(Math.random() * 2);
        let row;
        let col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShepLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShepLocations.push(row + '' + (col + i));
            } else {
                newShepLocations.push((row + i) + '' + col);
            }
        }
        return newShepLocations;
    },

    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

const controller = {
    guesses: 0,

    processGuess: function (guess) {
        const location = parceGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('You sank all my battleships, in ' + this.guesses + " guesses");
            }
        }
    }
};

function parceGuess(guess) {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess === null || guess.length !== 2) {
        console.log(guess);
        alert('Oops, please enter a letter and a number on the board.');
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('OOps, that isn\'t on the board.');
        } else if (row < 0 || row > model.boardSize || column < 0 || column >= model.boardSize) {
            alert('Oops, thet\'s off the board!');
        } else {
            return row + column;
        }
    }
    return null;
};

function init() {
    DOM.fireButton.onclick = handleFireButton;
    DOM.gessInput.onkeydown = handleKeyPress;

    model.generateShipLocations();
};

function handleFireButton() {
    let guess = DOM.gessInput.value;
    controller.processGuess(guess);
    DOM.gessInput.value = '';
};

function handleKeyPress(e) {
    if (e.keyCode === 13) {
        DOM.fireButton.onclick();
        return false;
    }
};

window.onload = init;