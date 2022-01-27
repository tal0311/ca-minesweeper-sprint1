'use strict'

var gLevel = {
  SIZE: 4,
  MINES: 2,
}

var gMineCount
var gCurrCellNegs = []
var gStartTime
var gWatchInterval
var gBoard
var gStrikes

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0, //!delete this
  secsPassed: 0, // TODO: MAKE THIS WORK
  isFirstMove: true,
}

function init() {
  gGame.isOn = true
  resetUi()
  gBoard = buildMat()
  getRandomMinePos(gLevel.MINES)
  renderBoard(gBoard, '.main')
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
  if (gGame.isFirstMove) {
    startStopWatch()
  }

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
    var hidden = remainderHiddenCells()
    if (hidden < 0) checkVictory()
    return
  }
  if (!minesAround) {
    currCell.isShown = true
    gGame.isFirstMove = false
    elCell.classList.remove('hidden')
    revelNegs({ i, j })
    var hidden = remainderHiddenCells()
    if (hidden < 0) checkVictory()
  }
}

function firstMove(i, j) {
  gGame.isFirstMove = false
  init()
  gBoard[i][j].isMine = false
  gBoard[i][j].isMine = true
  renderCell({ i, j }, EMPTY)
}

function rightClick(ev, i, j) {
  ev.preventDefault()
  if (gBoard[i][j].isMarked) {
    renderCell({ i, j }, EMPTY)
    gBoard[i][j].isMarked = false
    gMineCount++
    updateCountUi()
    checkVictory()
    return
  }
  gBoard[i][j].isMarked = true
  renderCell({ i, j }, FLAG)
  checkVictory()
  gMineCount--
  updateCountUi()
}

function updateCountUi() {
  var elSpan = document.querySelector('.mines-counter span')
  elSpan.innerText = gMineCount
}
function gameOver(elCell, i, j) {
  updateStrike(elCell, i, j)
}

function localStorage() {
  console.log('this function will put value in local storage')
}

var gElstrikes = document.querySelectorAll('.strikes-container img')
function updateStrike(elCell, i, j) {
  var strike = gElstrikes[gStrikes]
  strike.classList.add('crashed')
  gStrikes++

  elCell.classList.add('mine')
  renderCell({ i, j }, MINE)
  if (gStrikes > 2) endGame(i, j)
  return
}

function endGame(i, j) {
  renderSmiley('lose')
  endStopWatch()
  var elH1 = document.querySelector('h1')
  elH1.style.color = 'rgb(223, 87, 114)'
  elH1.innerText = 'Mines are bad for you...'
  renderCell({ i, j }, MINE)
  var elCells = document.querySelectorAll('.cell')
  for (let i = 0; i < elCells.length; i++) {
    elCells[i].classList.add('game-over')
  }
  var minesPos = getAllMines()
  showAllMines(minesPos)
  var elBtn = document.querySelector('.restart')
  elBtn.hidden = false
}

function showAllMines(locations) {
  for (let i = 0; i < locations.length; i++) {
    var location = locations[i]
    renderCell(location, MINE)
  }
}

function revelNegs() {
  for (let i = 0; i < gCurrCellNegs.length; i++) {
    gCurrCellNegs[i].isShown = true
    var location = { i: gCurrCellNegs[i].i, j: gCurrCellNegs[i].j }
    removeClassByLocation(location, 'hidden')
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

  var hidden = remainderHiddenCells()

  if (count === gLevel.MINES && hidden < 0) {
    var elH1 = document.querySelector('h1')

    elH1.style.backgroundColor = 'rgb(223, 87, 114)'
    elH1.innerText = 'You are Victorious'
    renderSmiley('win')
    endStopWatch()
  }
}

function remainderHiddenCells() {
  var hiddenCells = getHiddenMines()
  var length = hiddenCells.length

  return length - 1
}

function resetUi() {
  //!move ui reset to another file
  gStrikes = 0
  gMineCount = gLevel.MINES
  renderSmiley('start')
  updateCountUi()
  var elH1 = document.querySelector('h1')
  elH1.style.backgroundColor = '#333'
  elH1.style.color = 'antiquewhite'
  elH1.innerText = 'Classic Minesweeper'
  var elBtn = document.querySelector('.restart')
  elBtn.hidden = true
  var elTime = document.querySelector('.timer span')
  elTime.innerText = 0
  var elStrikes = document.querySelectorAll('.strikes-container img')
  for (let i = 0; i < elStrikes.length; i++) {
    var strike = elStrikes[i]
    strike.classList.remove('crashed')
  }

  var elHints = document.querySelectorAll('.hint')
  for (let i = 0; i < elHints.length; i++) {
    var elHint = elHints[i]
    elHint.classList.remove('hide-hint')
  }
}

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
}

function renderSmiley(gameStatus) {
  var smiley = document.querySelector('.smiley')

  switch (gameStatus) {
    case 'win':
      smiley.innerText = SMILEY_WIN
      break
    case 'lose':
      smiley.innerText = SMILEY_LOSE
      break
    case 'start':
      smiley.innerText = SMILEY_START
  }
}

var ghiddencells
var gHintInTimeout
function useHint(elHint) {
  elHint.classList.add('hide-hint') //revers on ui reset

  activateHint()
}

function activateHint() {
  ghiddencells = getHiddenMines()

  var showCells = ghiddencells.slice()

  for (let i = 0; i < showCells.length; i++) {
    var elCell = showCells[i]
    elCell.classList.remove('hidden')
  }

  setTimeout(function () {
    for (let i = 0; i < showCells.length; i++) {
      var elCell = showCells[i]
      elCell.classList.add('hidden')
    }
  }, 1500)
}
