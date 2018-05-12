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
    claimedSquares = claimedSquares.concat(array); 
    return;
}
const checkAdjacentSquares = (sqr) => {
    
    const isClaimed = (sqr) => {
        if (claimedSquares.includes(sqr)) return true;
        return false;
    }
    const checkNeighbor = (sqr, stateSqr) => {
        if(Math.abs(sqr[0] - stateSqr[0]) + Math.abs(sqr[1] - stateSqr[1]) == 1) return true;
        return false;
    }
    const searchAdjacentSquares = (sqr, color) => {
        // debugger;
        let stateSqr;
        
        BOARD_STATE.forEach((row, rowInd) => {
            row.forEach((col, colInd) => {
                stateSqr = [rowInd, colInd];
                if(!isClaimed(stateSqr) && checkNeighbor(sqr, stateSqr)) {
                    claimedSquares.push(stateSqr);
                }
            });
        });
        return;
    }
    searchAdjacentSquares(sqr);

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
            currentSquare = document.querySelector("[data-col='" + colInd + "'][data-row='" + rowInd + "']");
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
const toggleButtons = (onOff) => {

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
    toggleButtons(1);

    currentColor = BOARD_STATE[0][0];
    claimedSquares = [[0, 0]];
    checkForNewSquares(); 
    return;       
}
document.addEventListener('DOMContentLoaded', function() {
    initGame();
 }, false);