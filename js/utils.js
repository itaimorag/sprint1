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
function updateBoard(gBoard) {
     for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
        gCell=gBoard[i][j]
        gCell = {
            minesAroundCount: setMinesNegsCount(gBoard, i, j),
            isShown: false,
            isMine: false,
            isMarked: false
        }
        gBoard[i][j]=gCell
    }
}
}

function renderBoard(mat, selector) {

    var strHTML = '<table border="1" cellpadding="10" id="table"><tbody class="board">'
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
    cancelRightClickPop()
}
function cellMarked(elCell, iIdx, jIdx) {
    var curCell = gBoard[iIdx][jIdx]
    if (curCell.isShown) return
    else if (!curCell.isMarked) {
        curCell.isMarked = true
        gGame.markedCount++
    }
    else {
        curCell.isMarked = false
        gGame.markedCount--
    }
    if (gGame.markedCount === gCountedMines) checkGameOver()
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
    gGame.isOn = false
    clearInterval(gTimerId)
}
function checkGameOver() {
    if ((gBoard.length === 4 && gGame.markedCount === 2 && gGame.shownCount === 14) || (gBoard.length === 8 && gGame.markedCount === 14 && gGame.shownCount === 50) || (gBoard.length === 12 && gGame.markedCount === 32 && gGame.shownCount === 112)) {
        var elVictory = document.querySelector('.startBtn')
        elVictory.innerText = WINEMOJI
        gGame.isOn = false
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
            if (!gBoard[i][j].isShown) {
                gBoard[i][j].minesAroundCount= setMinesNegsCount(gBoard, i, j)
                gBoard[i][j].isShown = true
                gGame.shownCount++
            }
        }
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
function createRandomMines(howManyMines,iIdx, jIdx) {
    for (var i = 0; i < howManyMines; i++) {
        createRandomMine(gBoard,iIdx, jIdx)
        gCountedMines++
    }
    renderBoard(gBoard, '.board-container')
}
function createRandomMine(gBoard,iIdx, jIdx) {
    var randomNum1 = getRandomIntInclusive(0, gBoard.length - 1)
    var randomNum2 = getRandomIntInclusive(0, gBoard.length - 1)
    if (gBoard[randomNum1][randomNum2].isMine||gBoard[randomNum1][randomNum2]===gBoard[iIdx][jIdx]) {
        while (gBoard[randomNum1][randomNum2].isMine||gBoard[randomNum1][randomNum2]===gBoard[iIdx][jIdx]) {
            randomNum1 = getRandomIntInclusive(0, gBoard.length - 1)
            randomNum2 = getRandomIntInclusive(0, gBoard.length - 1)
        }
    }
    gBoard[randomNum1][randomNum2].isMine = true

}

function cellClicked(elCell, iIdx, jIdx) {
   
    var elCell = gBoard[iIdx][jIdx]
    if (gTimesCellClicked === 0&&!elCell.isMine) {
        if (gBoard.length === 4) { createRandomMines(2, iIdx, jIdx) }
        else if (gBoard.length === 8) { createRandomMines(14 ,iIdx, jIdx) }
        else { createRandomMines(32,iIdx, jIdx) }
    }
    gTimesCellClicked++
    if (elCell.isMine) {
        switch (gLIfe) {
            case 3:
                var elHearts = document.querySelector('.hearts')
                elHearts.innerText = 'Hearts Left: ' + LIFE + LIFE 
                gLIfe--
                break;
            case 2:
                var elHearts = document.querySelector('.hearts')
                elHearts.innerText = 'Hearts Left: ' + LIFE 
                gLIfe--
                break;
            case 1:
                var elHearts = document.querySelector('.hearts')
                elHearts.innerText = 'Hearts Left: '
                gLIfe--
                break;
            case 0:
                loose()
                break;
        }
        return
    }   

    if (elCell.isMarked) return
    var minesAroundCell = setMinesNegsCount(gBoard, iIdx, jIdx)
    elCell.minesAroundCount = minesAroundCell   
    if (elCell.minesAroundCount === 0) expandShown(gBoard, elCell, iIdx, jIdx)
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
    if (!gBoard[iIdx][jIdx].isShown) {
        gBoard[iIdx][jIdx].isShown = true
        renderBoard(gBoard, '.board-container')
        gGame.shownCount++
    }
    if (gGame.markedCount === gCountedMines) checkGameOver()
    if (gTimesCellClicked === 1) {
        const startTime = Date.now()
        gTimerId = setInterval(timer, 37, startTime)
    }
  
    renderBoard(gBoard, '.board-container')
}
function timer(time) {
    gTimer = (Date.now() - time) / 1000
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = 'timer:'+ gTimer
    elTimer.style.display = 'block'
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
