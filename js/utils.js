'use strict'


function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 2,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    return board
}
function updateBoard(gMat){
    for (var i = 0; i < gMat.length; i++) {
        for (var j = 0; j < gMat[0].length; j++) {
            var cell = {
                minesAroundCount: setMinesNegsCount(gMat, i, j),
                isShown: false,
                isMine: false,
                isMarked: false
            }
            gMat[i][j] = cell
        }
    }
    return gMat
}

function renderBoard(mat, selector) {

    var strHTML = '<table border="1" cellpadding="10"><tbody class="board">'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '\n<tr>\n'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j]
            if (cell.isMarked) { cell = FLAG }
            else if (cell.isShown) {
                if (cell.isMine)
                    cell = BOMB
                else cell = cell.minesAroundCount
            } else cell = ' '
            const className = 'cell cell-' + i + '-' + j
            strHTML += `\t<td class="${className}" onmousedown="markedOrClicked(event,this,${i},${j})">${cell}</td>\n`
        }
        strHTML += '\n</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML

}
function cellMarked(elCell, iIdx, jIdx) {
    var curCell = gBoard[iIdx][jIdx]
    if(curCell.isShown) return
    else if (!curCell.isMarked) {
        curCell.isMarked = true
        gGame.markedCount++
    }
    else{
        curCell.isMarked = false
        gGame.markedCount--
    } 
    if(gGame.markedCount===gCountedMines) checkGameOver()
    // var elCell = document.querySelector('.cell-'+iIdx+ '-' + jIdx)
    // elCell.innerText = FLAG
    renderBoard(gBoard, '.board-container')
}
function loose() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var curCell = gBoard[i][j]
            if (curCell.isMine) {
                curCell.isShown = true
            }
        }
    }
    gGame.isOn=false
    clearInterval(gTimerId)
}
function checkGameOver() {
    console.log(`hello `)
    console.log(`gGame.shownCount = `, gGame.shownCount)
    console.log(`gBoard.length = `, gBoard.length)
    console.log(`gGame.markedCount = `, gGame.markedCount)
    if ((gBoard.length === 4 && gGame.markedCount === 2 && gGame.shownCount === 14) || (gBoard.length === 8 && gGame.markedCount === 14 && gGame.shownCount === 50) || (gBoard.length === 12 && gGame.markedCount === 32 && gGame.shownCount === 112)) {
        var elVictory = document.querySelector('.startBtn')
        elVictory.innerText = WINEMOJI
        gGame.isOn=false
        clearInterval(gTimerId)
    }
}
//When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === rowIdx && j === colIdx) continue
            if(!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true
                gGame.shownCount++
            }
            }
        }
    }

// hides the context menu on right click
function cancelRightClickPop() {
    const elNoRightClicks = document.querySelectorAll('.cell')
    for (var p = 0; p < elNoRightClicks.length; p++) {
        const noRightClick = elNoRightClicks[p]
        noRightClick.addEventListener("contextmenu", e => e.preventDefault());
    }
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var minesAroundCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isMine) minesAroundCount++
        }
    }
    return minesAroundCount
}
function createRandomMines(difficulty) {
    for (var i = 0; i < difficulty; i++) {
        createRandomMine(gBoard)
        gCountedMines++
    }
    renderBoard(gBoard, '.board-container')
}
function createRandomMine(gBoard) {
    var randomNum1 = getRandomIntInclusive(0, gBoard.length - 1)
    var randomNum2 = getRandomIntInclusive(0, gBoard.length - 1)
    if (gBoard[randomNum1][randomNum2].isMine) {
        while (gBoard[randomNum1][randomNum2].isMine) {
            randomNum1 = getRandomIntInclusive(0, gBoard.length - 1)
            randomNum2 = getRandomIntInclusive(0, gBoard.length - 1)
        }
    }
    gBoard[randomNum1][randomNum2].isMine = true
    gBoard[randomNum1][randomNum2].isShown = true

}

function cellClicked(elCell, iIdx, jIdx) {
    if(gTimesCellClicked===0){
        if(gBoard.length===4){ createRandomMines(2)}
            else if(gBoard.length===8) { createRandomMines(14)}
            else{createRandomMines(32) }
    }
    gTimesCellClicked++
    var elCell = gBoard[iIdx][jIdx]
    if (elCell.isMine) loose()
    if (elCell.isMarked) return
    var minesAroundCell = setMinesNegsCount(gBoard, iIdx, jIdx)
    elCell.minesAroundCount = minesAroundCell
    if(elCell.minesAroundCount===0) expandShown(gBoard, elCell, iIdx, jIdx)
    // var elCell=document.querySelector('.cell-'+iIdx+ '-' + jIdx)
    // switch (minesAroundCell) {
        //     case 1:
        //         console.log(`elCell = `, elCell)
        //          elCell.style.color='red'           
        //         break;
        //     case 'ArrowDown':
        //         nextLocation.i++;
        //         break;
        //     case 'ArrowLeft':
        //         nextLocation.j--;
        //         break;
        //     case 'ArrowRight':
        //         nextLocation.j++;
        //         break;          
        // }
        if(!gBoard[iIdx][jIdx].isShown) {
            gBoard[iIdx][jIdx].isShown = true
            renderBoard(gBoard, '.board-container')
            gGame.shownCount++
        }
        if(gGame.markedCount===gCountedMines) checkGameOver()
        if (gTimesCellClicked === 1) {
        const startTime = Date.now()
        gTimerId = setInterval(timer, 37, startTime)
    }
        renderBoard(gBoard, '.board-container')
}

function timer(time) {
    gTimer = (Date.now() - time) / 1000
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = gTimer
    elTimer.style.display = 'block'
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}




// function renderStarterBoard(mat, selector) {
//     var strHTML = '<table border="1" cellpadding="10"><tbody class="starterBoard">'
//     for (var i = 0; i < 4; i++) {
//         strHTML += '\n<tr>\n'
//         for (var j = 0; j < 4; j++) {
//             const cell = mat[i][j]
//             const className = 'cell cell-' + i + '-' + j
//             strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})">${cell}</td>`
//         }
//         strHTML += '\n</tr>'
//     }
//     const elContainer = document.querySelector(selector)
//     elContainer.innerHTML = strHTML

// }