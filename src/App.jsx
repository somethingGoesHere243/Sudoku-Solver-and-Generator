import { useState } from 'react'

// Function to check if a given number can be placed at a given position on the sudoku grid
const canPlace = (board, largeSquareIndex, smallSquareIndex, num) => {
  const largeSquareRowNumber = Math.floor(largeSquareIndex / 3);
  const smallSquareRowNumber = Math.floor(smallSquareIndex / 3)
  const largeSquareColumnNumber = (largeSquareIndex % 3);
  const smallSquareColumnNumber = (smallSquareIndex % 3);
  // Check if num appears in same large square as position provided
  for (let i=0; i<9; i++) {
    if (board[largeSquareIndex][i] === num) {return false}
  }
  // Check if num appears in same row as position provided
  for (let i=0; i<3; i++) {
    for (let j=0; j<3; j++) {
      if (board[largeSquareRowNumber * 3 + i][smallSquareRowNumber * 3 + j] === num) {return false}
    }
  }
  // Check if num appears in same column as position provided
  for (let i=0; i<9; i += 3) {
    for (let j=0; j<9; j += 3) {
      if (board[largeSquareColumnNumber + i][smallSquareColumnNumber + j] === num) {return false}
    }
  }
  return true
}

function Square({value, handleChange}) {
  return <input className='small-square' value={value ? value: ''} onChange={handleChange}></input>
}

function App() {
  // Store current state of board (a 0 implies a blank square)
  const [board, setBoard] = useState([[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]])

  // Store state for text to be displayed at top of screen
  const [topText, setTopText] = useState('');

  // Store list of solutions for current board
  let solutions = [];

  // Function to update a given square of the board
  const updateSquare = (largeSquareIndex, smallSquareIndex, value) => {
    // Check value is valid
    if (/^[1-9]$/.test(value) || value === '') {
      // Check if value can be placed in desired square
      if (canPlace(board, largeSquareIndex, smallSquareIndex, parseInt(value))) {
        // Create copy of board and edit correct value
        const boardCopy = board.slice();
        const rowCopy = board[largeSquareIndex].slice();
        rowCopy[smallSquareIndex] = parseInt(value) || 0;
        boardCopy[largeSquareIndex] = rowCopy;

        setBoard(boardCopy);
      } else {
        // Display error
        setTopText(`${value} can not be placed here`);
      }
    }
  }

  // Function to generate a random board with a single unique solution
  const generateBoard = () => {
    // Start with empty board
    let randomBoard = [[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]];
    // Fill board with random digits ensuring board always has a solution
    let done = false;
    while (!done) {
      // Get random position on board which hasnt been filled yet
      let randomIndex1 = Math.floor(Math.random() * 9);
      let randomIndex2 = Math.floor(Math.random() * 9);
      while (randomBoard[randomIndex1][randomIndex2] !== 0) {
        randomIndex1 = Math.floor(Math.random() * 9);
        randomIndex2 = Math.floor(Math.random() * 9);
      }
      // Get random number to place in square
      let randomDigit = Math.floor(Math.random() * 9) + 1;
      // Check digit can be placed in requested square
      while (!canPlace(randomBoard, randomIndex1, randomIndex2, randomDigit)) {
        randomDigit = Math.floor(Math.random() * 9) + 1;
      }
      randomBoard[randomIndex1][randomIndex2] = randomDigit;
      // Check board still has a solution
      solutions = [];
      solve(randomBoard, 2)
      // If have only 1 solution stop adding numbers
      if (solutions.length === 1) {
        done = true;
      } else if (solutions.length === 0) {
        // If no solution remove digit and try again
        randomBoard[randomIndex1][randomIndex2] = 0;
      }
    }
    // Display board to screen
    setBoard(randomBoard)
  }

  // Function to solve a given sudoku board and check if there are multiple solutions
  const solve = (currBoard, desiredNumberOfSolutions) => {
    // Check if we have a solution and can finish early
    if (solutions.length <= desiredNumberOfSolutions) {
      // Find the earliest square in board which has not been filled yet
      for (let i=0; i<9; i++) {
        for (let j=0; j<9; j++) {
          if (currBoard[i][j] === 0) {
            for (let newValue=1; newValue<=9; newValue++) {
              // Check if newValue can be placed in desired position
              if (canPlace(currBoard, i, j, newValue)) {
                currBoard[i][j] = newValue;
                solve(currBoard , desiredNumberOfSolutions);
                currBoard[i][j] = 0;
              }
            }
            return
          }
        }
      }
      // If we reach this point then currBoard will be fully solved so create a copy and store it
      let boardCopy = [];
      for (let i=0; i<9; i++) {
        boardCopy.push(currBoard[i].slice());
      }
      solutions.push(boardCopy);
    } 
  }

  // Function to be ran when solve button pressed
  const solveButton = () => {
    // Reset solutions list
    solutions = [];
    // Create a copy of the current board so we can edit it
    let boardCopy=[[],[],[],[],[],[],[],[],[]];
    for (let i=0; i<9; i++) {
      boardCopy[i] = board[i].slice();
    }
    // Find a solution to the given board
    solve(boardCopy, 1);
    // Check if we have a valid solution
    if (solutions.length !== 0) {
      // Display one of the solutions on the screen
      setBoard(solutions[0]); 
      setTopText('Solution Found')
    } else {
      // Display error on page
      setTopText('No Solution Found')
    }
  }

  // Function to undo the last move a user made
  const undo = () => {

  }

  // Function to correctly place a single digit on the current board
  const giveHint = () => {

  }

  // Generate all squares of board
  const largeSquares = board.map((largeSquare, largeSquareIndex) => {
    const smallSquares = largeSquare.map((smallSquare, smallSquareIndex) => {
      return <Square key={`Large Square-${largeSquareIndex}, Small Square-${smallSquareIndex}`} value={smallSquare} handleChange={e => {updateSquare(largeSquareIndex, smallSquareIndex, e.target.value)}}/>;
    })
    return <div key={`Large Square-${largeSquareIndex}`} className='large-square'>{smallSquares}</div> 
  })

  return (
    <><div id='game'>
        <div id='top-text'>
          {topText}
        </div>
        <div id='board'>
          {largeSquares}
        </div>
      </div>
      <div id='controls'>
        <button onClick={generateBoard}>New Board</button>
        <button onClick={solveButton}>Solve</button>
        <button onClick={undo}>Undo</button>
        <button onClick={giveHint}>Hint</button>
      </div>
    </>
  )
}

export default App
