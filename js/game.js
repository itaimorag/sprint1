'use strict'
const WINEMOJI = '😎'
const LOOSEEMOJI = '😥'
const NORAMLEMOJI = '😃'
const BOMB='💣'
const FLAG='🚩'

var gStarterBoard
var gBoard
var gTimesCellClicked=0
var gTimer
var gTimerId
 var gMat
 var gCountedMines=0
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
    // console.log('hello')
    var elStart = document.querySelector('.startBtn')
    elStart.innerText = NORAMLEMOJI
    gMat= buildBoard(4)
     gBoard = updateBoard(gMat)
    renderBoard(gBoard, '.board-container')
    gTimesCellClicked=0
    cancelRightClickPop() 
    gCountedMines=0
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 2,
        secsPassed: 0
    }  
}
function difficulty(elBtn) {
    if (elBtn.innerText === 'easy') {
        console.log(`hello `)
        init()
        gBoard = updateBoard(gEasyLevel.SIZE)
        renderBoard(gBoard, '.board-container')
        console.log(`gBoard = `, gBoard)
    } else if (elBtn.innerText === 'hard') {
        init()
        gBoard = buildBoard(gMediumLevel.SIZE) 
        renderBoard(gBoard, '.board-container') 
        console.log(`gBoard = `, gBoard) 
    } else {
        init()
        gBoard = buildBoard(gExpertLevel.SIZE) 
        renderBoard(gBoard, '.board-container')      
    }
}
function markedOrClicked(event,elCell,iIdx,jIdx){
    if(!gGame.isOn) return
if(event.buttons===1){
    cellClicked(elCell, iIdx, jIdx )
}else if(event.buttons===2)  cellMarked(elCell, iIdx, jIdx )
else console.log('unknown click')
}



