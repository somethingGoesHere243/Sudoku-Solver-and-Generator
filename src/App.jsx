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

// Function to find all the positions in a given square which could contain a given digit (given a list of available digits for each square)
const checkSquare = (squareNumber, digit, availableDigits) => {
  let res = [];
  for (let i=0; i<9; i++) {
    // Check if digit can be placed in this position
    if (availableDigits[9 * squareNumber + i].includes(digit)) {
      res.push(i);
    }
  }
  return res;
}

// Function to find all the positions in a given row of a given board which could contain a given digit (given a list of available digits for each square)
const checkRow = (rowNumber, digit, availableDigits) => {
  let res = [];
  for (let i=0; i<9; i++) {
    // Convert to large and small square indices
    const largeSquareIndex = Math.floor(rowNumber / 3) * 3 + Math.floor(i / 3);
    const smallSquareIndex = (rowNumber % 3) * 3 + (i % 3);
    // Check if digit can be placed in this position
    if(availableDigits[9 * largeSquareIndex + smallSquareIndex].includes(digit)) {
      res.push(i);
    }
  }
  return res;
}

// Function to find all the positions in a given column of a given board which could contain a given digit (given a list of available digits for each square)
const checkCol = (colNumber, digit, availableDigits) => {
  let res = [];
  for (let i=0; i<9; i++) {
    // Convert to large and small square indices
    const largeSquareIndex = Math.floor(i / 3) * 3 + Math.floor(colNumber / 3);
    const smallSquareIndex = (i % 3) * 3 + (colNumber % 3);
    // Check if digit can be placed in this position
    if(availableDigits[9 * largeSquareIndex + smallSquareIndex].includes(digit)) {
      res.push(i);
    }
  }
  return res;
}

function Square({value, handleChange, backgroundColor}) {
  return <input className='small-square' value={value ? value: ''} onChange={handleChange} style={{backgroundColor: backgroundColor}}></input>
}

// Store list of solutions for current board
let solutions;

// Store solution to most recently generated board
let currSolution;

function App() {
  // Store current state of board (a 0 implies a blank square)
  const [board, setBoard] = useState([[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]])

  // Store most recently generated board as state
  const [generatedBoard, setGeneratedBoard] = useState([[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]]) 

  // Store state for text to be displayed at top of screen
  const [topText, setTopText] = useState('');

  // Add flag to see if the solver algorithm is taking too long to complete
  let solverTooSlow = false;

  // Function to update a given square of the board
  const updateSquare = (largeSquareIndex, smallSquareIndex, value) => {
    // Check value is valid
    if (/^[1-9]$/.test(value) || value === '') {
      // Check if have a current solution
      if (currSolution) {
        // Check if the given input matches that solution
        if (currSolution[largeSquareIndex][smallSquareIndex] === parseInt(value)) {
          // Create copy of board and edit correct value
          const boardCopy = board.slice();
          const rowCopy = board[largeSquareIndex].slice();
          rowCopy[smallSquareIndex] = parseInt(value) || 0;
          boardCopy[largeSquareIndex] = rowCopy;

          setBoard(boardCopy);
          setTopText(``);
        } else {
          setTopText(`Placing ${value} here is a mistake.`)
        }
      } 
      // If we dont have a current solution check if the input could be placed in the given square
      else if (!currSolution && canPlace(board, largeSquareIndex, smallSquareIndex, parseInt(value))) {
        // Create copy of board and edit correct value
        const boardCopy = board.slice();
        const rowCopy = board[largeSquareIndex].slice();
        rowCopy[smallSquareIndex] = parseInt(value) || 0;
        boardCopy[largeSquareIndex] = rowCopy;

        setBoard(boardCopy);
        setTopText(``);
      } else {
        setTopText(`${value} can not be placed here`);
      }
    }
  }

  // Function to generate a random board with a single unique solution
  const generateBoard = () => {
    // Start with empty board
    let randomBoard = [[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]];

    // Add one of each digit to board in random locations (this will always have a solution)
    for (let digit=1; digit<=9; digit++) {
      // Get random position on board which hasnt been filled yet
      let randomIndex1 = Math.floor(Math.random() * 9);
      let randomIndex2 = Math.floor(Math.random() * 9);
      while (randomBoard[randomIndex1][randomIndex2] !== 0) {
        randomIndex1 = Math.floor(Math.random() * 9);
        randomIndex2 = Math.floor(Math.random() * 9);
      }
      // Set that square to the current digit
      randomBoard[randomIndex1][randomIndex2] = digit;
    }

    // Fill board with 1 random digit at a time ensuring board always has a solution
    let done = false;
    let differingPosition = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
    while (!done) {
      //Find position on board which hasnt been filled yet
      let randomIndex1 = differingPosition[0];
      let randomIndex2 = differingPosition[1];
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
      // Add time limit to make sure algorithm doesnt run too long
      const startTime = new Date();
      solverTooSlow = false;
      solve(randomBoard, 2, startTime);
      if (solverTooSlow) {
        // Restart board generation
        generateBoard();
        return;
      }
      // If have only 1 solution stop adding numbers
      if (solutions.length === 1) {
        done = true;
      } else if (solutions.length === 0) {
        // If no solution remove digit and try again
        randomBoard[randomIndex1][randomIndex2] = 0;
      } else {
        // Find a position on the board at which the 2 solutions differ
        let foundPosition = false;
        for(let i=0; i<63; i+=7) {
          for(let j=0; j<9; j++) {
            if (!foundPosition && solutions[0][j][i % 9] !== solutions[1][j][i % 9]) {
              foundPosition = true;
              differingPosition = [j,i % 9]
            }
          }
        }
      }
    }
    // Display board to screen
    setBoard(randomBoard)
    setGeneratedBoard(randomBoard)
    // Store current solution
    currSolution = solutions[0];
  }

  // Function to solve a given sudoku board and check if there are multiple solutions
  const solve = (currBoard, desiredNumberOfSolutions, startTime = 0) => {
    // Check how much time has passed since solver started
    const currTime = new Date();
    if (currTime - startTime > 1000 && startTime !== 0) {
      // If over a second has passed terminate solver
      solverTooSlow = true;
      return;
    }
    // Check if we have a solution and can finish early
    if (solutions.length <= desiredNumberOfSolutions) {
      // Track which squares we have changed the values of
      const changedSquares = [];
      // Find a list of the digits which could be placed in each square
      const availableDigits = [];
      for (let i=0; i<81; i++) {
        if (currBoard[Math.floor(i / 9)][i % 9] === 0) {
          availableDigits.push([]);
        }
        else {
          availableDigits.push([currBoard[Math.floor(i / 9)][i % 9]])
        }
      }
      for (let i=0; i<9; i++) {
        for (let j=0; j<9; j++) {
          if (currBoard[i][j] === 0) {
            for (let newValue=1; newValue<=9; newValue++) {
              // Check if newValue can be placed in desired position
              if (canPlace(currBoard, i, j, newValue)) {
                availableDigits[9 * i + j].push(newValue);
              }
            }
            // If no number can go in a square then board is invalid
            if (availableDigits[9 * i + j].length === 0) {
              // Unfill all squares we filled in this function call
              changedSquares.forEach(([i,j]) => {
                currBoard[i][j] = 0;
              });

              return
            }
            // If only one number could go in this square then put it there
            if (availableDigits[9 * i + j].length === 1) {
              currBoard[i][j] = availableDigits[9 * i + j][0];
              changedSquares.push([i,j]);
            }
          }
        }
      }

      // Check each large square to see if there is a digit which can only be placed in one location
      for (let squareNumber=0; squareNumber<9; squareNumber++) {
        for (let digit=1; digit<=9; digit++) {
          const availablePositions = checkSquare(squareNumber, digit, availableDigits);
          // If only one available position for this digit then put it there
          if (availablePositions.length === 1) {
            // Check if position has not yet been filled and digit can still be placed here
            if (currBoard[squareNumber][availablePositions[0]] === 0 && canPlace(currBoard, squareNumber, availablePositions[0], digit)) {
              currBoard[squareNumber][availablePositions[0]] = digit;
              changedSquares.push([squareNumber, availablePositions[0]]);
              availableDigits[9 * squareNumber + availablePositions[0]] = [digit];
            } else if (currBoard[squareNumber][availablePositions[0]] !== digit) {
              // In this case we have no valid position to place digit so can return
              // Unfill all squares we filled in this function call
              changedSquares.forEach(([i,j]) => {
                currBoard[i][j] = 0;
              });
              return
            }
          }
        }
      }

      // Check each row to see if there is a digit which can only be placed in one location
      for (let rowNumber=0; rowNumber<9; rowNumber++) {
        for (let digit=1; digit<=9; digit++) {
          const availablePositions = checkRow(rowNumber, digit, availableDigits);
          // If only one available position for this digit then put it there
          if (availablePositions.length === 1) {
            // Convert to usual square indices
            const largeSquareIndex = Math.floor(rowNumber / 3) * 3 + Math.floor(availablePositions[0] / 3);
            const smallSquareIndex = (rowNumber % 3) * 3 + (availablePositions[0] % 3);
            // Check if position has not yet been filled and digit can still be placed here
            if (currBoard[largeSquareIndex][smallSquareIndex] === 0 && canPlace(currBoard, largeSquareIndex, smallSquareIndex, digit)) {
              currBoard[largeSquareIndex][smallSquareIndex] = digit;
              changedSquares.push([largeSquareIndex, smallSquareIndex]);
              availableDigits[9 * largeSquareIndex + smallSquareIndex] = [digit];
            } else if (currBoard[largeSquareIndex][smallSquareIndex] !== digit) {
              // In this case we have no valid position to place digit so can return
              // Unfill all squares we filled in this function call
              changedSquares.forEach(([i,j]) => {
                currBoard[i][j] = 0;
              });
              return
            }
          }
        }
      }

      // Check each column to see if there is a digit which can only be placed in one location
      for (let colNumber=0; colNumber<9; colNumber++) {
        for (let digit=1; digit<=9; digit++) {
          const availablePositions = checkCol(colNumber, digit, availableDigits);
          // If only one available position for this digit then put it there
          if (availablePositions.length === 1) {
            // Convert to usual square indices
            const largeSquareIndex = Math.floor(availablePositions[0] / 3) * 3 + Math.floor(colNumber / 3);
            const smallSquareIndex = (availablePositions[0] % 3) * 3 + (colNumber % 3);
            // Check if position has not yet been filled and digit can still be placed here
            if (currBoard[largeSquareIndex][smallSquareIndex] === 0 && canPlace(currBoard, largeSquareIndex, smallSquareIndex, digit)) {
              currBoard[largeSquareIndex][smallSquareIndex] = digit;
              changedSquares.push([largeSquareIndex, smallSquareIndex]);
              availableDigits[9 * largeSquareIndex + smallSquareIndex] = [digit];
            } else if (currBoard[largeSquareIndex][smallSquareIndex] !== digit) {
              // In this case we have no valid position to place digit so can return
              // Unfill all squares we filled in this function call
              changedSquares.forEach(([i,j]) => {
                currBoard[i][j] = 0;
              });
              return
            }
          }
        }
      }

      // If each position has only one available digit puzzle must be solved
      if (availableDigits.every(arr => arr.length === 1)) {
        let boardCopy = [];
        for (let i=0; i<9; i++) {
          boardCopy.push(currBoard[i].slice());
        }
        solutions.push(boardCopy);
        // Unfill all squares we filled in this function call
        changedSquares.forEach(([i,j]) => {
          currBoard[i][j] = 0;
        });

        return 
      }

      // If a square has been filled re-call function to update availableDigits
      if (changedSquares.length > 0) {
        solve(currBoard, desiredNumberOfSolutions, startTime);
        // Unfill all squares we filled in this function call
        changedSquares.forEach(([i,j]) => {
          currBoard[i][j] = 0;
        });

        return
      }

      // Fill squares starting with those which can be filled with the least possible digits
      let numOfAvailableDigits = 2;
      while (numOfAvailableDigits <= 9) {
        const squareIndex = availableDigits.findIndex(arr => arr.length === numOfAvailableDigits);
        if (squareIndex !== -1) {
          // Convert index in availableDigitsCounts to indices needed to find square in currBoard
          const i = Math.floor(squareIndex / 9);
          const j = squareIndex % 9;
          for (let newValue=1; newValue<=9; newValue++) {
            // Check if newValue can be placed in desired position
            if (canPlace(currBoard, i, j, newValue)) {
              currBoard[i][j] = newValue;
              solve(currBoard , desiredNumberOfSolutions, startTime);
              currBoard[i][j] = 0;
            }
          }
          // Unfill all squares we filled in this function call
          changedSquares.forEach(([i,j]) => {
            currBoard[i][j] = 0;
          });
          return
        } else {
          // If no square with the specified number of possible digits then increment this number
          numOfAvailableDigits += 1;
        }
      }
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
      let backgroundColor = '#ffffff';
      let handleChange = e => {updateSquare(largeSquareIndex, smallSquareIndex, e.target.value)}
      // If a square is part of the most recently generated board give it different background color and prevent it from being updated
      if (generatedBoard[largeSquareIndex][smallSquareIndex] !== 0) {
        backgroundColor = '#d2f8fa';
        handleChange = e => {};
      }
      return <Square key={`Large Square-${largeSquareIndex}, Small Square-${smallSquareIndex}`} value={smallSquare} handleChange={handleChange} backgroundColor={backgroundColor}/>;
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
