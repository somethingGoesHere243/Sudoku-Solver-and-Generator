import { useState } from 'react'

// Function to check if a given sudoku board is valid
const boardIsValid = (board) => {
  // Check if there are any duplicates in each large square
  for (const largeSquare of board) {
    let seenNums = [];
    for (const num of largeSquare) {
      if (seenNums.includes(num)) {
        return false;
      } else if (num !== 0) {
        seenNums += [num];
      }
    }
  }
  // Check if there are any duplicates in each column
  for (let columnNumber = 0; columnNumber < 9; columnNumber++) {
    let seenNums = [];
    for (let rowNumber = 0; rowNumber < 9; rowNumber++) {
      const currSquareValue =  board[3 * Math.floor(rowNumber / 3) + Math.floor(columnNumber / 3)][3 * (rowNumber % 3) + (columnNumber % 3)];
      if (seenNums.includes(currSquareValue)) {
        return false;
      } else if (currSquareValue !== 0) {
        seenNums += [currSquareValue];
      }
    } 
  }
  // Check if there are any duplicates in each row
  for (let rowNumber = 0; rowNumber < 9; rowNumber++) {
    let seenNums = [];
    for (let columnNumber = 0; columnNumber < 9; columnNumber++) {
      const currSquareValue =  board[3 * Math.floor(rowNumber / 3) + Math.floor(columnNumber / 3)][3 * (rowNumber % 3) + (columnNumber % 3)];
      if (seenNums.includes(currSquareValue)) {
        return false;
      } else if (currSquareValue !== 0) {
        seenNums += [currSquareValue];
      }
    }
  }
  return true;
}

function Square({value, handleChange}) {
  return <input className='small-square' value={value ? value: ''} onChange={handleChange}></input>
}

function App() {
  // Store current state of board (a 0 implies a blank square)
  const [board, setBoard] = useState([[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]])

  // Function to update a given square of the board
  const updateSquare = (largeSquareIndex, smallSquareIndex, value) => {
    // Check value is valid
    if (/^[1-9]$/.test(value) || value === '') {
      // Create copy of board and edit correct value
      const boardCopy = board.slice();
      const rowCopy = board[largeSquareIndex].slice();
      rowCopy[smallSquareIndex] = parseInt(value) || 0;
      boardCopy[largeSquareIndex] = rowCopy;

      setBoard(boardCopy);
    }
  }

  // Function to generate a random board with a single unique solution
  const generateBoard = () => {

  }

  // // Function to solve a given sudoku board and check if there are multiple solutions
  // const solve = (currBoard) => {
  //   // If currBoard is invalid return immediately
  //   if (!boardIsValid(currBoard)) {
  //     return
  //   }
  //   // Find the earliest square in board which has not been filled yet
  //   for (let i=0; i<9; i++) {
  //     for (let j=0; j<9; j++) {
  //       if (board[i][j] === 0) {
  //         for (let newValue=1; newValue<=9; newValue++) {
  //           const boardCopy = board.slice();
  //           const rowCopy = board[i].slice();
  //           rowCopy[j] = newValue;
  //           boardCopy[i] = rowCopy;
  //           solve(boardCopy);
  //         }
  //       }
  //     }
  //   }
  //   console.log(currBoard);
  //   return currBoard;
  // }

  const solve = () => {
    // Track number of squares on board which have been filled
    let filledSquares = 0;

    const boardCopy = [[],[],[],[],[],[],[],[],[]];
    let secondBoardCopy = [[],[],[],[],[],[],[],[],[]];
    for (let i=0; i<9; i++) {
      boardCopy[i] = board[i].slice();
      secondBoardCopy[i] = board[i].slice();
      for(let j=0; j<9; j++) {
        if (boardCopy[i][j] !==0) {
          filledSquares += 1;
        }
      }
    }

    // Keep list of most recently filled squares
    let lastFilledSquares = [];
    
    // Loop until board is completely filled
    while (filledSquares < 81) {
      // Find first unfilled square
      let foundSquare = false;
      for (let i=0; i<9; i++) {
        for (let j=0; j<9; j++) {
          if (!foundSquare && boardCopy[i][j] === 0){
            foundSquare = true;
            filledSquares += 1;
            lastFilledSquares.unshift([i,j]);
          }
        }
      }
      let lastFilledSquare = lastFilledSquares[0];
      let newValue = 0;
      // Find a value which can be placed in this square whilst keeping board valid
      for (let num=1; num<=9; num++) {
        if (newValue === 0) {
          boardCopy[lastFilledSquare[0]][lastFilledSquare[1]] = num;
            if (boardIsValid(boardCopy)) {
              newValue = num;
            }
          }
        }
        // If we havent found a value that works we remove last filled squares until we find a square which we can increase its value by one
        while (newValue === 0 && !boardIsValid(boardCopy)) {
          lastFilledSquare = lastFilledSquares[0];
          // Check if value in this square can be incremented
          if (boardCopy[lastFilledSquare[0]][lastFilledSquare[1]] < 9) {
            boardCopy[lastFilledSquare[0]][lastFilledSquare[1]] += 1;
          } 
          // If not empty square and remove from list of filled squares
          else {
            while (boardCopy[lastFilledSquares[0][0]][lastFilledSquares[0][1]] === 9) {
              filledSquares -= 1;
              boardCopy[lastFilledSquares[0][0]][lastFilledSquares[0][1]] = 0;
              lastFilledSquares.shift();
            }
            boardCopy[lastFilledSquares[0][0]][lastFilledSquares[0][1]] += 1;
          }
        }
    }
    setBoard(boardCopy);
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
    <>
      <div id='board'>
        {largeSquares}
      </div>
      <div id='controls'>
        <button onClick={generateBoard}>New Board</button>
        <button onClick={() => solve(board)}>Solve</button>
        <button onClick={undo}>Undo</button>
        <button onClick={giveHint}>Hint</button>
      </div>
    </>
  )
}

export default App
