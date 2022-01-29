'use strict'

var gBoard

var gLevel = {
  SIZE: 4,
  MINES: 2,
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 1,
  isFirstClick: true,
  lives: 2,
  isHintMode: false,
}

function initGame() {
  gGame.isOn = true
  gGame.isFirstClick = true
  gGame.lives = 3
  gGame.markedCount = 0

  resetUi()

  gBoard = buildBoard()
  renderBoard(gBoard)
  startTimer()
}

function resetUi() {
  gGame.secsPassed = 0
  gGame.markedCount = 0
  stopTimer()
  elLivesSpan = document.querySelectorAll('.lives-container span')
  elLivesSpan.innerText = gGame.markedCount
  var elMinesLeft = document.querySelector('.mines')
  elMinesLeft.innerText = gLevel.MINES
  var elSmiley = document.querySelector('.smiley')
  var elHints = document.querySelectorAll('.hint')
  gGame.markedCount = 0

  for (let i = 0; i < elHints.length; i++) {
    var elHint = elHints[i]
    elHint.classList.remove('hide-hint')
  }

  elSmiley.innerText = SMILEY_START
  var elLivesSpan = document.querySelectorAll('.lives-container span')

  for (let i = 0; i < elLivesSpan.length; i++) {
    var live = elLivesSpan[i]
    live.classList.remove('crashed')
  }

  var elH1 = document.querySelector('h1')
  elH1.innerHTML = 'classic minesweeper'
}

function changeLevel(size, mines) {
  gLevel.SIZE = size
  gLevel.MINES = mines

  initGame()
}
function cellClicked(elCell, i, j) {
  if (!gGame.isOn) return

  var elLivesSpan = document.querySelectorAll('.lives-container span')
  var currCell = gBoard[i][j]
  if (gGame.isFirstClick) {
    renderBoard(gBoard)
    var minesLocations = getMinesLocations(gLevel.MINES)
    placeMinesOnBoard(minesLocations)
    setMinesNegsCount(gBoard)
    gGame.isFirstClick = false
  }
  if (gGame.isHintMode) {
    checkHintCell(i, j)
    return
  }

  if (currCell.isMarked) return
  if (currCell.isShown) return

  if (currCell.isMine && gGame.lives > 1) {
    currCell.isShown = true
    renderBoard(gBoard)
    gGame.lives--
    checkGameOver()
    elLivesSpan[gGame.lives].classList.add('crashed')
    return
  }
  if (currCell.isMine) {
    gGame.lives--

    elLivesSpan[gGame.lives].classList.add('crashed')
    showAllMInes()
    renderBoard(gBoard)
    gameLost()
    return
  }

  gBoard[i][j].isShown = true
  gGame.shownCount++

  expandShown(gBoard, elCell, i, j)

  checkGameOver()
  renderBoard(gBoard)
}

function cellMarked(elCell, ev, i, j) {
  if (!gGame.isOn) return

  ev.preventDefault()
  var elMarked = document.querySelector('.marked')

  if (gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false
    gGame.markedCount--
    elMarked.innerText = gGame.markedCount
    checkGameOver()
    renderBoard(gBoard)
    return
  }

  gBoard[i][j].isMarked = true
  gGame.markedCount++
  elMarked.innerText = gGame.markedCount

  checkGameOver()
  renderBoard(gBoard)
}

function checkGameOver() {
  
  if (isAllMInesMarked() && isAllCellsShown()) {
    stopTimer()
    var elH1 = document.querySelector('h1')
    elH1.innerText = 'You are Victorias'

    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = SMILEY_WIN
    stopTimer()
    return
  }
}
function isAllMInesMarked() {
  var markedMines = 0
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j]

      if ((cell.isMine && cell.isShown) || (cell.isMine && cell.isMarked))
        markedMines++
    }
  }
  
  return markedMines === gLevel.MINES ? true : false
}

function expandShown(board, elCell, i, j) {
  var negsPoses = getCellNegs(board, i, j)

  for (let i = 0; i < negsPoses.length; i++) {
    var negPos = negsPoses[i]

    gBoard[negPos.i][negPos.j].isShown = true
  }
}
var gTimer
function startTimer() {
  gTimer = setInterval(showTime, 1000)
}

function showTime() {
  var elTimerSpan = document.querySelector('.timer')
  elTimerSpan.innerText = gGame.secsPassed++
}

function stopTimer() {
  clearInterval(gTimer)
  gTimer = null
}

function gameLost() {
  stopTimer()
  var elH1 = document.querySelector('h1')
  elH1.innerText = 'mines are bad for you'
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = SMILEY_LOSE
  gGame.isOn = false

  return
}

function showAllMInes() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j]
      if (!cell.isMine) continue
      if (!cell.isShown) cell.isShown = true
    }
  }
}

function isAllCellsShown() {
  var shownCells = 0
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j]
      if (!cell.isShown) continue
      shownCells++
    }
  }
  
  return shownCells >= gLevel.SIZE ** 2 - gLevel.MINES ? true : false
}

function hideHint(elHint) {
  elHint.classList.add('hide-hint')
  gGame.isHintMode = true
}

function checkHintCell(i, j) {
  var currCell = gBoard[i][j]

  var negsPoses = getCellHIntNegs(gBoard, i, j)
  var negsCopy = negsPoses.slice()

  for (let i = 0; i < negsPoses.length; i++) {
    var negPos = negsPoses[i]

    gBoard[negPos.i][negPos.j].isShown = true
  }
  currCell.isShown = true

  renderBoard(gBoard)

  setTimeout(function () {
    resetHint(negsCopy, i, j)
  }, 2000)
}

function resetHint(negsCopy, i, j) {
  var currCell = gBoard[i][j]
  for (let i = 0; i < negsCopy.length; i++) {
    var negPos = negsCopy[i]

    gBoard[negPos.i][negPos.j].isShown = false
  }
  currCell.isShown = false

  gGame.isHintMode = false
  renderBoard(gBoard)
}
