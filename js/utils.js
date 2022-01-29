'use strict'

const FLAG = '🚩'
const MINE = '💣'
const EMPTY = ' '
const SMILEY_START = '😃'
const SMILEY_WIN = '😎'
const SMILEY_LOSE = '🤯'

// this is the model
function buildBoard() {
  console.log('build board')

  var board = []
  for (let i = 0; i < gLevel.SIZE; i++) {
    var row = []
    for (let j = 0; j < gLevel.SIZE; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
      row.push(cell)
    }
    board.push(row)
  }

  console.table(board)
  return board
}

// place mines manually

function setMinesNegsCount(board) {
  console.log('set mines negs count')

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      var cell = board[i][j]
      var minesNum = countMinesAround(board, i, j)
      cell.countMinesAround = minesNum
    }
  }
}

function countMinesAround(mat, rowIdx, colIdx) {
  var count = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = mat[i][j]
      if (currCell.isMine) {
        count++
      }
    }
  }
  return count
}

function getCellNegs(mat, rowIdx, colIdx) {
  console.log(mat, rowIdx, colIdx)
  var currCell = mat[rowIdx][colIdx]
  if (currCell.minesAroundCount > 0) return
  console.log('more then 0')
  var negsPoses = []
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = mat[i][j]
      if (currCell.isMine) continue

      negsPoses.push({ i: i, j: j })
    }
  }
  console.log(negsPoses)
  return negsPoses
}

function getCellHIntNegs(mat, rowIdx, colIdx) {
  console.log(mat, rowIdx, colIdx)
  var currCell = mat[rowIdx][colIdx]
  if (currCell.minesAroundCount > 0) return
  console.log('more then 0')
  var negsPoses = []
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = mat[i][j]
      if (currCell.isShown) continue

      negsPoses.push({ i: i, j: j })
    }
  }
  console.log(negsPoses)
  return negsPoses
}

function renderBoard(board) {
  console.log('render board')

  console.log('board from render board:', board)
  var strHtml = '<table border="1"><tbody>'

  for (let i = 0; i < board.length; i++) {
    strHtml += `<tr>`
    for (let j = 0; j < board[0].length; j++) {
      var currCell = board[i][j]

      strHtml += `<td class="${!currCell.isShown ? 'hidden' : ''} cell" 
      oncontextmenu="cellMarked( this, event, ${i},${j})" 
      contextmenu="mymenu" 
      onclick="cellClicked(this, ${i},${j} )">
      ${currCellContent(board, i, j) || EMPTY}</td>`
    }
    strHtml += `</tr>`
  }

  var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHtml
}
//  board[i][j].isMine? MINE: board[i][j].countMinesAround

function getMinesLocations(minesNum) {
  console.log('minesNum from mines location:', minesNum)

  var minesPoses = []

  for (let i = 0; i < gLevel.MINES; i++) {
    var pos = {
      i: getRandomInt(0, gLevel.SIZE - 1),
      j: getRandomInt(0, gLevel.SIZE - 1),
    }
    minesPoses.push(pos)
  }
  return minesPoses
}

function placeMinesOnBoard(minesLocations) {
  console.log('mines locations:', minesLocations)
  for (let i = 0; i < minesLocations.length; i++) {
    for (let j = 0; j < minesLocations.length; j++) {
      var mine = minesLocations[i]
      gBoard[mine.i][mine.j].isMine = true
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function currCellContent(board, i, j) {
  var currCell = board[i][j]
  if (currCell.isShown) {
    if (currCell.isMine) return MINE
    else return currCell.countMinesAround
  }

  if (currCell.isMarked) return FLAG
}
