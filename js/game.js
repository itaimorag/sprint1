'use strict'
const WINEMOJI = '😎'
const LOOSEEMOJI = '😥'
const NORAMLEMOJI = '😃'
const BOMB = '💣'
const FLAG = '🚩'
const LIFE = '💗'

var gStarterBoard
var gBoard
var gTimesCellClicked = 0
var gTimer
var gTimerId
var gMat
var gCountedMines = 0
var gLIfe = 3
var gCell
const gEasyLevel = {
    SIZE: 4,
    MINES: 2
};
const gMediumLevel = {
    SIZE: 8,
    MINES: 14
};
const gExpertLevel = {
    SIZE: 12,
    MINES: 32
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() { 
    var elStart = document.querySelector('.startBtn')
    elStart.innerText = NORAMLEMOJI
    gBoard = buildBoard(4)
    renderBoard(gBoard, '.board-container')
    gTimesCellClicked = 0
    gCountedMines = 0
    gLIfe = 3
    var elHearts = document.querySelector('.hearts')
    elHearts.innerText = 'Hearts Left: ' + LIFE + LIFE + LIFE
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }  
}
function cancelRightClickPop() {
    const noContexts =document.querySelectorAll('.cell');
    for (var p = 0; p < noContexts.length; p++) {
        const noContext = noContexts[p]
    noContext.addEventListener('contextmenu', function(disable) {
      disable.preventDefault();
    });
    }
}

function difficulty(elBtn) {
    if (elBtn.innerText === 'easy') {
        init()
        gBoard = buildBoard(gEasyLevel.SIZE)
        renderBoard(gBoard, '.board-container')
    } else if (elBtn.innerText === 'hard') {
        init()
        gBoard = buildBoard(gMediumLevel.SIZE)
        renderBoard(gBoard, '.board-container')
    } else {
        init()
        gBoard = buildBoard(gExpertLevel.SIZE)
        renderBoard(gBoard, '.board-container')
    }
}
function markedOrClicked(event, elCell, iIdx, jIdx) {
    cancelRightClickPop()
    if (!gGame.isOn) return
    if (event.buttons === 1) {
        cellClicked(elCell, iIdx, jIdx)
    } else if (event.buttons === 2) cellMarked(elCell, iIdx, jIdx)
    else console.log('unknown click')
}



