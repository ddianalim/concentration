function generateHTMLForBoardSquares() {
  const numberOfSquares = 16;
  let squaresHTML = '';

  for (let i = 0; i < numberOfSquares; i++) {
    squaresHTML +=
      // add .flipped class to <div> element
      '<div class="col-3 board-square">\n' +
      '<div class="face-container">\n' +
      '<div class="facedown"></div>\n' +
      '<div class="faceup"></div>\n' +
      '</div>\n' +
      '</div>\n';
  }

// insert squares HTML in DOM
const boardElement = document.getElementById('gameboard');
boardElement.innerHTML = squaresHTML;

}

class BoardSquare {

  constructor(element, color) {
    this.element = element;
    this.element.addEventListener("click", this, false);

    this.isFaceUp = false;
    this.isMatched = false;
    this.setColor(color);
  }

  handleEvent(event) {
    switch (event.type) {
      case "click":
        if(this.isFaceUp || this.isMatched) {
          return;
        } else if(!this.isFaceUp && !this.isMatched) {
          this.isFaceUp = true;
          this.element.classList.add('flipped');
          squareFlipped(this);
        }
    }
  }

  reset() {
    this.isFaceUp = false;
    this.isMatched = false;
    this.element.classList.remove('flipped');
  }

  matchFound() {
    this.isFaceUp = true;
    this.isMatched = true;
  }

  setColor(color) {
    const faceUpElement = this.element.getElementsByClassName('faceup')[0];

    faceUpElement.classList.remove(this.color);

    this.color = color;
    faceUpElement.classList.add(color);
  }
}

const colorPairs = [];

function generateColorPairs() {
  if (colorPairs.length > 0) {
    return colorPairs;
  } else {
    for (let i = 0; i < 8; i++) {
      colorPairs.push('color-' + i);
      colorPairs.push('color-' + i);
    }

    return colorPairs;
  }
}

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffleColors() {
  const colorPairs = generateColorPairs()
  return shuffle(colorPairs);
}

const boardSquares = [];

function setupGame() {
  generateHTMLForBoardSquares();

  const randomColorPairs = shuffleColors();
  const squareElements = document.getElementsByClassName("board-square");
  for (let i = 0; i < squareElements.length; i++) {
    const element = squareElements[i];
    const color = randomColorPairs[i];
    const square = new BoardSquare(element, color)
    boardSquares.push(square);
  }
}

setupGame();

let firstFaceUpSquare = null;

function squareFlipped(square) {
  if (firstFaceUpSquare === null) {
    firstFaceUpSquare = square;
    return;
  }

  if (firstFaceUpSquare.color === square.color) {
    firstFaceUpSquare.matchFound();
    square.matchFound();

    firstFaceUpSquare = null;
  } else {
    const a = firstFaceUpSquare;
    const b = square;

    firstFaceUpSquare = null;

    setTimeout(function() {
      a.reset();
      b.reset();
    }, 400)
  }
}

const  resetButton = document.getElementById("reset-button");
resetButton.addEventListener('click', () => {
  resetGame();
});

function resetGame() {
  firstFaceUpSquare = null;
  boardSquares.forEach((square) => {
    square.reset()
  });

  setTimeout(() => {
    const randomColorPairs = shuffleColors();
    for (let i = 0; i < boardSquares.length; i++) {
      const newColor = randomColorPairs[i];
      const square = boardSquares[i];

      square.setColor(newColor);
    }
  }, 500);

}
