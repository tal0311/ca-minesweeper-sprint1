'use strict'

// TODO:make board size dynamic !use number function

var gLevel = {
  SIZE: 4,
  MINES: 2,
}

//TODO:make random number of mines with function

var gMineCount = gLevel.MINES
var gCurrCellNegs = []
var gStartTime
var gWatchInterval
var gBoard
var gStrikes
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  isFirstMove: true,
}

function init() {
  gStrikes = 0
  resetUi()
  gGame.isOn = true
  gBoard = buildMat()

  console.table(gBoard)
  getRandomMinePos(gLevel.MINES)
  renderBoard(gBoard, '.main')
  startStopWatch()
}

function changeLevel(size, mines) {
  gLevel.SIZE = size
  gLevel.MINES = mines

  init()
}

function clickCell(elCell, i, j) {
  gCurrCellNegs = []

  var currCell = gBoard[i][j]
  currCell.isShown = true

  if (gGame.isFirstMove && currCell.isMine) {
    firstMove(i, j)
    return
  }
  if (elCell.dataset.ismine === 'true') {
    gameOver(elCell, i, j)
    return
  }

  var minesAround = countMinesAround(gBoard, i, j)

  if (minesAround > 0) {
    currCell.isShown = true
    elCell.classList.remove('hidden')
    elCell.textContent = minesAround
    gGame.isFirstMove = false

    return
  }
  if (!minesAround) {
    currCell.isShown = true
    gGame.isFirstMove = false
    elCell.classList.remove('hidden')
    revelNegs({ i, j })
  }
}

// !fix this
function firstMove(i, j) {
  gGame.isFirstMove = false
  init()

  console.log(i, j)
  gBoard[i][j].isMine = false

  gBoard[i][j].isMine = true
  renderCell({ i, j }, MINE)
}

function rightClick(ev, i, j) {
  ev.preventDefault()
  if (gBoard[i][j].isMarked) {
    renderCell({ i, j }, EMPTY)
    gBoard[i][j].isMarked = false
    return
  }
  gBoard[i][j].isMarked = true

  renderCell({ i, j }, FLAG)
  checkVictory()
  gMineCount-- //!make this work
}

function gameOver(elCell, i, j) {
  var elStrikes = document.querySelectorAll('.strikes-container img')
  elStrikes[gStrikes].classList.add('crashed')
  gStrikes++
  console.log(gStrikes, elStrikes)

  console.log(elStrikes)
  elCell.classList.add('mine')
  renderCell({ i, j }, MINE)

  if (gStrikes >= 3) {
    endStopWatch()
    var elH1 = document.querySelector('h1')
    elH1.innerText = 'Mines are bad for you...'
    renderCell({ i, j }, MINE)
    var elCells = document.querySelectorAll('.cell')

    for (let i = 0; i < elCells.length; i++) {
      elCells[i].classList.add('game-over')
    }
    var elBtn = document.querySelector('.restart')
    elBtn.hidden = false
  }

  // TODO: render button for restart
  // TODO:change smiley face
  // TODO: show modal
  // TODO: stop timer

  // TODO: go to localStorage()
}

function localStorage() {
  console.log('this function will put value in local storage')
}

function revelNegs() {
  for (let i = 0; i < gCurrCellNegs.length; i++) {
    gCurrCellNegs[i].isShown = true
    var location = { i: gCurrCellNegs[i].i, j: gCurrCellNegs[i].j }
    removeClassByLocation(location, 'hidden')
  }

  // !maybe find negs of negs
  for (let i = 0; i < gCurrCellNegs.length; i++) {
    var cell = gCurrCellNegs[i]
    console.log('cell:', cell.i, cell.j)
    var currNeg = gCurrCellNegs.splice(i, 1)
    var res = countMinesAround(gBoard, currNeg.i, currNeg.j)
    console.log('res:', res)
  }

  gCurrCellNegs = []
}

function checkVictory() {
  var count = 0
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j]
      if (cell.isMine && cell.isMarked) count++
    }
  }
  if (count === gLevel.MINES) {
    var elh1 = document.querySelector('h1')
    elh1.innerText = 'You are Victorious'
  }
}

function resetUi() {
  var elH1 = document.querySelector('h1')
  elH1.innerText = 'Classic Minesweeper'
  var elBtn = document.querySelector('.restart')
  elBtn.hidden = true

  var elStrikes = document.querySelectorAll('.strikes-container img')
  for (let i = 0; i < elStrikes.length; i++) {
    var strike = elStrikes[i]
    strike.classList.remove('crashed')
  }
}

// timer
// TODO: stop timer at game over
function startStopWatch() {
  gWatchInterval = setInterval(updateWatch, 10)
  gStartTime = Date.now()
}

function updateWatch() {
  var now = Date.now()
  var time = ((now - gStartTime) / 1000).toFixed()
  var elTime = document.querySelector('.timer span')
  elTime.innerText = time
}

function endStopWatch() {
  clearInterval(gWatchInterval)
  gWatchInterval = null
  console.log('stop')
}
