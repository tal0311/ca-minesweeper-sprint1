'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '

// this will build mat
function buildMat() {
  var board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }

  return board
}

// this will print mat to html
function renderBoard(mat, selector) {
  var strHTML = `<table border="1"><tbody>`
  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += `<tr>`
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = mat[i][j]
      var className = `hidden cell cell-${i}-${j}`
      strHTML += `<td  data-ismine="${cell.isMine}" class=" ${className}" onclick="clickCell(this, ${i}, ${j})" oncontextmenu="rightClick(event, ${i},${j})" contextmenu="mymenu">  </td>`
    }
    strHTML += `</tr>`
  }
  strHTML += `</tbody></table>`
  var elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}

// nags function will take mat location i j return negs count

function countMinesAround(mat, rowIdx, colIdx) {
  var count = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = mat[i][j]
      gCurrCellNegs.push({ cell: gBoard[i][j], i, j })
      if (currCell.isMine) {
        count++
        gBoard[rowIdx][colIdx].minesAroundCount = count
      }
    }
  }
  console.log(gCurrCellNegs)
  return count
}

function renderCell(location, value) {
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)

  elCell.innerHTML = value
}
function removeClassByLocation(location, value) {
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)

  elCell.classList.remove(value)
}
var gMineposes

function getRandomMinePos(length) {
  gMineposes = []

  for (let i = 0; i < length; i++) {
    var pos = {
      i: getRandomInt(0, gLevel.SIZE - 1),
      j: getRandomInt(0, gLevel.SIZE - 1),
    }
    gMineposes.push(pos)
  }
  console.log(gMineposes.length)
  placeMinesOnBoard(gMineposes)
  gMineposes = []
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function placeMinesOnBoard(minePoses) {
  for (let i = 0; i < minePoses.length; i++) {
    console.log(minePoses[i])
    var mine = minePoses[i]
    gBoard[mine.i][mine.j].isMine = true
  }
}
