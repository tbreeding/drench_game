const COLORS = ["#3066BE", "#119DA4", "#D6FFF6", "#F55D3E", "#ED217C", "#F1C40F"];
const SQUARES = document.querySelectorAll(".square");
const COLOR_BTNS = document.querySelectorAll(".colorBtn");
const TOTAL_MOVES_DIV = document.getElementById("totalMovesThisTurn");
const MOVES_REMAINING = document.getElementById("currMovesLeft");
const RESET_BTNS = document.querySelectorAll(".resetBtn");
const END_GAME_MODAL = document.getElementById("endGameModal");
const GAME_WON = document.getElementById("gameWon");
const GAME_LOST = document.getElementById("gameLost");
const CONTINUE_GAME = document.getElementById("continueGame");

const BOARD_STATE = [
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null] 
];

let totalMoves;
let movesRemaining;
let claimedSquares;    
let currentColor;

//Shows Win Window
const showWin = () => {
    END_GAME_MODAL.style.display = "flex";
    GAME_WON.style.display = "flex";
}

//Shows Loss Window
const showLoss = () => {
    END_GAME_MODAL.style.display = "flex";
    GAME_LOST.style.display = "flex";
}

//Checks for End of Game state
const checkWinLoss = () => {
    setTimeout(() => {
        if(claimedSquares.length == 196) {
            showWin();
        } else if(movesRemaining === 0) {
            showLoss();
        }   
    }, 100);
    
    return;
}

//Checks squares next to each indiviual claimed square for color matches
//and checks to see if already in Claimed Squares array
//adds to array if found
const checkAdjacentSquares = (sqr) => {
    
    const isOffEdge = (adjSqr) => {
        if(adjSqr[0] < 0 || adjSqr[0] >= Math.sqrt(SQUARES.length) || adjSqr[1] < 0 || adjSqr[1] >= Math.sqrt(SQUARES.length)) return true
        return false;
    } 
    const isClaimed = (sqr) => {

        if (claimedSquares.indexOf(sqr) >= 0) {
            return true;
        } else {
        return false;
        }
    }
    const checkNeighbor = (sqr, stateSqr) => {
        if(Math.abs(sqr[0] - stateSqr[0]) + Math.abs(sqr[1] - stateSqr[1]) == 1) return true;
        return false;
    }
    const searchAdjacentSquares = (sqr, stepRow, stepCol, color) => {
        let curRow = parseInt(sqr.split(',')[0]) + stepRow;
        let curCol = parseInt(sqr.split(',')[1]) + stepCol;
        let endWhileLoop = false;

        while(!endWhileLoop) {

            if(!isOffEdge([curRow, curCol])) {

                if(BOARD_STATE[curRow][curCol] === color && isClaimed(`${curRow},${curCol}`) === false) {
                    claimedSquares.push(`${curRow},${curCol}`);    

                    curRow += stepRow;
                    curCol += stepCol;
                } else {
                    endWhileLoop = true;
                }
            } else {
                endWhileLoop = true;
            }
        }
        return;
    }
    searchAdjacentSquares(sqr, 0, -1, currentColor); //left
    searchAdjacentSquares(sqr, 0, 1, currentColor); //right
    searchAdjacentSquares(sqr, -1, 0, currentColor); //up
    searchAdjacentSquares(sqr, 1, 0, currentColor); //down

    return;
}

//Loops through the Claimed Squares for adjacent with like color
const checkForNewSquares = (color) => {
    let counter = -1;
    let endLoop = false;

    while(endLoop == false) {
        counter++;
        if(claimedSquares.length > counter) {
            
            checkAdjacentSquares(claimedSquares[counter], color);
            
        } else {
            endLoop = true;
        }
    }
}

//updates the DOM background-colors to current BOARD_STATE
const paintBoard = () => {
    let currentSquare;
    BOARD_STATE.forEach((row, rowInd) => {
        row.forEach((col, colInd) => {
            currentSquare = document.querySelector("[data-col='" + colInd + "'][data-row='" + rowInd + "']");
            currentSquare.style.backgroundColor = COLORS[BOARD_STATE[rowInd][colInd]];   
        });
    });
    checkWinLoss();
};

//Changes the Board State to clicked color based on claimed colors array
const changeClaimedColors = (color) => {
    claimedSquares.forEach(sqr => {
        BOARD_STATE[parseInt(sqr.split(',')[0])][parseInt(sqr.split(',')[1])] = color;
    });
    checkForNewSquares(color);
    paintBoard();
    return;
};

//loads the background colors into the Gameplay buttons in UI
const activateColorButtons = () => {
    COLOR_BTNS.forEach((btn, ind) => {
        btn.style.backgroundColor = COLORS[ind];
        btn.dataset.color = ind;
    });
    return;
};

//Pushes total moves for the level to the UI
const updateTotalMoves = () => {
    TOTAL_MOVES_DIV.innerText = totalMoves;
};

//Sets the randomized colors for Board State
const randomizeBoard = (pallette) => {
    BOARD_STATE.forEach((row, rowInd) => {
        row.forEach((col, colInd) => {
            BOARD_STATE[rowInd][colInd] = Math.floor(Math.random() * pallette.length);   
        });
    });
    return;
};

//Pushes Row/Column datasets to DIVs
const loadCoordinates = () => {
    let counter = 0;
    for(let i = 0; i < Math.sqrt(SQUARES.length); i++) {
        for(let j = 0; j < Math.sqrt(SQUARES.length); j++) {
            SQUARES[counter].dataset.row = i;
            SQUARES[counter].dataset.col = j;
            counter++;
        }
    }
    return;
};

//Update remaining moves and push to UI
const setMovesRemaining = (step) => {
    movesRemaining += step;
    MOVES_REMAINING.innerText = movesRemaining;
};

//Turn Buttons on/off as needed
const toggleButtons = (onOff) => {

    if(onOff) {
        COLOR_BTNS.forEach(btn => {
            btn.addEventListener("click", colorBtnClickHandler, false);
        });
        RESET_BTNS.forEach(btn => {
            btn.addEventListener("click", resetBtnClickHandler, false);
        });
        CONTINUE_GAME.addEventListener("click", continueGameClickHandler, false);
    } else {
        COLOR_BTNS.forEach(btn => {
            btn.removeEventListener("click", colorBtnClickHandler, false);
        });
        RESET_BTNS.forEach(btn => {
            btn.removeEventListener("click", resetBtnClickHandler, false);
        });
        CONTINUE_GAME.removeEventListener("click", continueGameClickHandler, false);
    }
    return;
};

//click handlers
const colorBtnClickHandler = (e) => {
    currentColor = parseInt(e.target.dataset.color);
    setMovesRemaining(-1);
    changeClaimedColors(currentColor);
    return;
};

const resetBtnClickHandler = () => {
    END_GAME_MODAL.style.display = "none";
    GAME_LOST.style.display = "none";
    initGame(30);
};

const continueGameClickHandler = () => {
    END_GAME_MODAL.style.display = "none";
    GAME_WON.style.display = "none";
    totalMoves--;
    initGame(totalMoves);
}

//Initializes a new game
const initGame = (moves) => {

    activateColorButtons();
    totalMoves = moves;
    movesRemaining = totalMoves;
    setMovesRemaining(0);
    updateTotalMoves();

    randomizeBoard(COLORS);
    loadCoordinates();
    toggleButtons(1);

    currentColor = BOARD_STATE[0][0];
    claimedSquares = ["0,0"];
    changeClaimedColors(currentColor);
    return;       
};

document.addEventListener('DOMContentLoaded', function() {
    initGame(30);
 }, false);