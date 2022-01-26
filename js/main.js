'use strict'

// TODO:make board size dynamic !use number function

var gLevel = {
  SIZE: 4,
  MINES: 2,
}

//TODO:make random number of mines with function

var gMineCount = gLevel.MINES
var gCurrCellNegs = []

var gBoard

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  isFirstMove: true,
}

function init() {
  gGame.isOn = true
  gBoard = buildMat()

  console.table(gBoard)
  getRandomMinePos(gLevel.MINES)
  renderBoard(gBoard, '.main')
}

// !fix level change
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

  gMineCount--
}

function gameOver(elCell, i, j) {
  elCell.classList.add('mine')
  console.log('game over')
  renderCell({ i, j }, MINE)
  var elCells = document.querySelectorAll('.cell [data-ismine="true"]')

  for (let i = 0; i < elCells.length; i++) {
    elCells[i].classList.remove('hidden')
    elCells[i].classList.add('game-over')
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

  gCurrCellNegs = []
}

function checkVictory() {}
// if (currNeg.isMine === false) {
//   currNeg.isShown = true
//   console.log(gBoard[location.i][location.j])
//   var elCell = document.querySelector(
//     `.cell-${location.i}-${location.j},[data-ismine="false"]`
//   )
//   console.log(elCell)
//   // elCell.classList.remove('hidden')
