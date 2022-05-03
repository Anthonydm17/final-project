
// Starts when HTML doc loads ~ target is document (HTML)
document.addEventListener('DOMContentLoaded', () => {

const grid = document.querySelector('.grid');
let timerId;
let nextrandom = 0;
let score = 0
const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
];

const audio = document.querySelector("#audio");

// creates an Array out of divs

let square = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.querySelector('#score')
const startButton = document.querySelector('#start-button')

const width = 10


// tetris pieces


// "L" shape

const piece1 = [
    [1, width+1, width* 2 + 1, 2],
    [width, width +1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
]
// "Z" shape
const piece2 = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]
// "T" shape
  const piece3 = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]
// block shape
  const piece4 = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]
// "I" shape
  const piece5 = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

// testing div creation
// console.log(square)

const gamePieces = [piece1,piece2,piece3,piece4,piece5];

let currentPosition = 4;
let currentRotation = 0;

// select piece randomly

let randomPiece = Math.floor(Math.random()*gamePieces.length);
let current = gamePieces[randomPiece][currentRotation];

console.log(randomPiece)

// function to draw game piece 

draw = () => {
    current.forEach(index => {
        square[currentPosition + index].classList.add('piece')
        square[currentPosition + index].style.backgroundColor = colors[randomPiece];
    })
}

undraw = () => {
    current.forEach(index => {
        square[currentPosition + index].classList.remove('piece')
        square[currentPosition + index].style.backgroundColor = ''
    })
}



// Movement 


// move down 
moveDown = () => {
    undraw();
    currentPosition += width;
    draw();
    bottomLimit();
    youLose();
}


// timerId = setInterval(moveDown, 1000);


// If key is pressed, will run function

control = (e) => {
    if(e.keyCode === 37) {
        moveLeft();
    }else if (e.keyCode === 38) {
// rotate piece
        rotate();
    }else if (e.keyCode === 39) {
// move right
        moveRight();
    }else if (e.keyCode === 40) {
        moveDown(); 
    }
    
}
document.addEventListener('keyup', control)





// stop at bottom of grid

bottomLimit = () => {
    // checks square under to see if it matches id given

    if(current.some(index => square[currentPosition + index + width].classList.contains('stopHere'))) {
        // adds the "stop" block
        current.forEach(index => square[currentPosition + index].classList.add('stopHere'));
        // que next piece
        randomPiece = Math.floor(Math.random() * gamePieces.length);
        current = gamePieces[randomPiece][currentRotation];
        currentPosition = 4;
        draw();
        addScore();
    }
}

// moving to the left - with limits

moveLeft = () => {
    undraw();
    const isAtLEdge = current.some(index => (currentPosition + index) % width === 0);
    // will only move if not at left edge
    if(!isAtLEdge) currentPosition -=1;

    // if space is taken it will not move
    if(current.some(index => square [currentPosition + index].classList.contains('stopHere'))) {    currentPosition += 1;
}

draw()

}

// move to right with limits - same logic as left

moveRight = () => {
    undraw();

    const isAtREdge = current.some(index => (currentPosition + index) % width === width-1);

    if(!isAtREdge) currentPosition += 1;
    if(current.some(index => square[currentPosition +index].classList.contains('stopHere'))) {
        currentPosition -=1;
    }
draw();
}

// rotating pieces by cycling through arrays

rotate = () => {
    undraw();
    // will run through all rotations
    currentRotation++;
    // if you cycle through all rotations it will start at beginning of array
    if(currentRotation === current.length) {
        currentRotation = 0;
    }
        current = gamePieces[randomPiece][currentRotation];
        checkRotatedPosition();
        draw();
}






    // start/pause button

startButton.addEventListener('click', () => {
    if(timerId) {
        clearInterval(timerId);
        timerId = null;
        document.getElementById("my_audio").pause();
        
    }else {
        draw();
        timerId = setInterval (moveDown, 300);
        nextrandom = Math.floor(Math.random()*gamePieces.length)
        document.getElementById("my_audio").play();
    }
   
})

// adding score

addScore = () => {
    // checks if row is full
    for(let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        // checks if every div in the row is taken by a piece
        if(row.every(index => square[index].classList.contains('stopHere'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                square[index].classList.remove('stopHere');
                square[index].classList.remove('piece');
                square[index].style.backgroundColor = ''
            })
            const squareRemoved = square.splice(i, width);
            square.forEach(cell => grid.appendChild(cell))
        }

    }
}

youLose = () => {
    if(current.some(index => square[currentPosition + index].classList.contains('stopHere'))) {
        scoreDisplay.innerHTML = 'GAME OVER';
        clearInterval(timerId);
    }
}




// fix rotating pieces breaking game 

// check if there is space on right

function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
// checking for space on left 

  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

})





