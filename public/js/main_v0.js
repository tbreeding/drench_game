const COLORS = ["#3066BE", "#119DA4", "#D6FFF6", "#F55D3E", "#ED217C", "#F1C40F"];
const SQUARES = document.querySelectorAll(".square");

const COLOR_BTNS = document.querySelectorAll(".colorBtn");
const TOTAL_MOVES_DIV = document.getElementById("totalMovesThisTurn");

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
let claimedSquares;    
let currentColor;

const addNewSquares = (array) => {
    // console.log(array)
    claimedSquares = claimedSquares.concat(array); 
    return;
}
const checkAdjacentSquares = (sqr) => {
    
    const isOnEdge = (adjSqr) => {
        if(adjSqr[0] < 0 || adjSqr[0] >= Math.sqrt(SQUARES) || adjSqr[1] < 0 || adjSqr[1] >= Math.sqrt(SQUARES)) return true
        return false;
    } 
    const searchAdjacentSquares = (sqr, stepRow, stepCol, color) => {
        // debugger;
        let curRow = sqr[0] + stepRow;
        let curCol = sqr[1] + stepCol;
        let endWhileLoop = false;
        let newSquares = [];
        while(!endWhileLoop) {

            if(!isOnEdge([curRow, curCol])) {

                if(!claimedSquares.includes([curRow, curCol]) && BOARD_STATE[curRow][curCol] === color) {
                    newSquares.push([curRow, curCol]);

                    curRow += stepRow;
                    curCol += stepCol;
                } else {
                    endWhileLoop = true;
                }
            } else {
                endWhileLoop = true;
            }
        }

        if(newSquares.length > 0) {
            addNewSquares(newSquares);
            // newSquares.forEach(sqr => {
            //     checkAdjacentSquares(sqr);
            // });
        };


        return;
    }
    searchAdjacentSquares(sqr, 0, -1, currentColor); //left
    searchAdjacentSquares(sqr, 0, 1, currentColor); //right
    searchAdjacentSquares(sqr, -1, 0, currentColor); //up
    searchAdjacentSquares(sqr, 1, 0, currentColor); //down

    return;
}
const checkForNewSquares = (color) => {
    claimedSquares.forEach(sqr => {
        checkAdjacentSquares(sqr);
    });
    paintBoard(); 
}
const paintBoard = () => {
    let currentSquare;
    BOARD_STATE.forEach((row, rowInd) => {
        row.forEach((col, colInd) => {
            currentSquare = document.querySelector("[data-col='" + colInd + "'][data-row='" + rowInd + "']")
            currentSquare.style.backgroundColor = COLORS[BOARD_STATE[rowInd][colInd]];   
        });
    });
    return;
}
const changeClaimedColors = (color) => {
    claimedSquares.forEach(sqr => {
        BOARD_STATE[sqr[0]][sqr[1]] = color;
    });
    checkForNewSquares(color);
    paintBoard();
    return;
}
const activateColorButtons = () => {
    COLOR_BTNS.forEach((btn, ind) => {
        btn.style.backgroundColor = COLORS[ind];
        btn.dataset.color = ind;
    });
    return;
}
const updateTotalMoves = () => {
    TOTAL_MOVES_DIV.innerText = totalMoves;
}
const randomizeBoard = (pallette) => {
    BOARD_STATE.forEach((row, rowInd) => {
        row.forEach((col, colInd) => {
            BOARD_STATE[rowInd][colInd] = Math.floor(Math.random() * pallette.length);   
        });
    });
    return;
};
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
}
const colorBtnClickHandler = (e) => {
    // debugger;
    currentColor = parseInt(e.target.dataset.color);
    changeClaimedColors(currentColor);
    return;
}
const initButtons = (onOff) => {

    if(!!onOff) {
        COLOR_BTNS.forEach(btn => {
            btn.addEventListener("click", colorBtnClickHandler, false);
        });
    } else {
        COLOR_BTNS.forEach(btn => {
            btn.removeEventListener("click", colorBtnClickHandler, false);
        });
    }
    return;
}
const initGame = () => {
    activateColorButtons();
    totalMoves = 30;
    updateTotalMoves();

    randomizeBoard(COLORS);
    loadCoordinates();
    initButtons(1);

    currentColor = BOARD_STATE[0][0];
    claimedSquares = [[0, 0]];
    checkForNewSquares(); 
    return;       
}
document.addEventListener('DOMContentLoaded', function() {
    initGame();
 }, false);