// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Square({className, value, onSquareClick}){
  // Receives 3 props from the Board component: className, value, onSquareClick.
  // className determines whether a square is highlighted as a part of the winning sequence.
  // onSquareClick is a function passed from Board and triggered by the square's click event.
  // The handleClick function creates a copy of the squares array and invokes onPlay to update the game state.
  return <button className={className} onClick = {onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {
  // Board component with 3 props: xIsNext, squares, onPlay
  // xIsNext is passed from Game component which evalued to true if Game current move is even
  // if even the next is X or O otherwise
  const nextValue = xIsNext ? 'X' : 'O';
  // results function return gameResults which is an array, 
  // where first element is winning square or null if there were no winner,
  // second element is a winner or null if there were no winner
  const gameResults = results(squares);
  const winner = gameResults[1];
  const winningSquares = gameResults[0];
  // gameIsDrawn is a boolean value. It evaluates if every square is filled and there is no winner
  const gameIsDrawn = squares.every(square => square) && !winner;

  // determining game ending
  let gameStatus;
  gameStatus = winner ? 'Winner: ' + winner : 'Next player: ' + nextValue;
  if(gameIsDrawn) gameStatus = 'Game ended in a draw';

  // explained in Square component
  function handleClick(i){
    if(squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = nextValue;
    onPlay(nextSquares);
  }

  // building Squares components together. highlighting winning Squares. 
  // Because it's a list of components there is a need of a key
  let allSquares = [];
  for(let i = 0; i < 3; i++){
    let row = []
    for(let j = 0; j < 3; j++){
      const num = i*3+j;
      const class_name = winner && winningSquares.includes(num) ? 'square highlight' : 'square';
      row.push(<Square key={num} className = {class_name} value = {squares[num]} onSquareClick = {() => handleClick(num)} />);
    }
    const board_row = <div key={i} className="board-row">{row}</div>
    allSquares.push(board_row);
  }
  // returning game ending and Squares components
  return (
    <>
      <div className="status">{gameStatus}</div>
      {allSquares}
    </>
      
  )
 
}

function Game(){
  // The initial history starts with an array of 9 null elements.
  // currentMove keeps track of the current move index.
  // toggleSort is used to switch between ascending and descending move order.
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [toggleSort, setToggleSort] = useState(0);
  const xIsNext = currentMove % 2 === 0;

  // current squares based of a current move
  const currentSquares = history[currentMove];

  // changing history and current move, based of a new move
  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // changes current move when clicked on a button in moves element
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const historyLength = history.length;

  // Constructing the moves list for rendering.
  // If toggleSort is true, the reversed copy of moves is displayed, otherwise regular moves are displayed.
  const moves = history.map((squares, move) => {
    let description;

    // if its a game start or last move description construct a list with a description 
    if(historyLength === 0 || move === historyLength - 1){
      description = 'You are at move #' + currentMove;
      return (
        <li key = {move}>
          <div> {description} </div>
        </li>
      );
    }

    // calculates row and col values
    const row = Math.floor(move/3) + 1;
    const col = move % 3 + 1;

    description = move > 0 ? 'Go to move #' + move + ` (row = ${row}, col = ${col})` : 'Go to game start';
    // Constructing an element with the ability to jump to a desired move.
    return (
      <li key = {move}>
        <button onClick = {() => jumpTo(move)}> {description} </button>
      </li>
    );
  })
  
  // sort message is 'sort moves ascending' if toggleSort is true (not zero) 
  // and  'sort moves descending' otherwise
  const sortMessage = toggleSort ? 'sort moves ascending' : 'sort moves descending';
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext = {xIsNext} squares = {currentSquares} onPlay = {handlePlay} />
      </div>
      <div className="game-info">
        {/* on true value make a moves copy and reverse, otherwise keep regular moves */}
        <ol>{ toggleSort ? moves.slice().reverse() : moves}</ol>
      </div>
      <div className="game-info">
        {/* toggle and set values 0 and 1 */}
        <button onClick = {() => setToggleSort(1 - toggleSort)}>{sortMessage}</button>
      </div>
    </div>
  );
}

function results(squares){
  // winning lines
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i = 0; i < lines.length; i++){
    // javascript destructuring
    const [a, b, c] = lines[i];
    //determining if there is a winner. If so return winning square indexes and a winning square value
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return [lines[i], squares[a]];
  }
  // if no winner were found return null values
  return [null, null];
}

// exports main component Game, which is imported in index.js and rendered in index.html
export default Game;
