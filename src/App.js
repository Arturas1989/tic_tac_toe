// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Square({className, value, onSquareClick}){
  return <button className={className} onClick = {onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {

  const nextValue = xIsNext ? 'X' : 'O';
  const gameResults = results(squares);
  const winner = gameResults[1];
  const winningSquares = gameResults[0];
  const gameIsDrawn = squares.every(square => square) && !winner;

  let gameStatus;
  gameStatus = winner ? 'Winner: ' + winner : 'Next player: ' + nextValue;
  if(gameIsDrawn) gameStatus = 'Game ended in a draw';

  function handleClick(i){
    if(squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = nextValue;
    onPlay(nextSquares);
  }
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
  return (
    <>
      <div className="status">{gameStatus}</div>
      {allSquares}
    </>
      
  )
 
}

function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [toggleSort, setToggleSort] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  

  const historyLength = history.length;
  const moves = history.map((squares, move) => {
    let description;
    const row = Math.floor(move/3) + 1;
    const col = move % 3 + 1;
    if(historyLength === 0 || move === historyLength - 1){
      description = 'You are at move #' + currentMove;
      return (
        <li key = {move}>
          <div> {description} </div>
        </li>
      );
    }

    description = move > 0 ? 'Go to move #' + move + ` (row = ${row}, col = ${col})` : 'Go to game start';
    return (
      <li key = {move}>
        <button onClick = {() => jumpTo(move)}> {description} </button>
      </li>
    );
  })
  
  const sortMessage = toggleSort ? 'sort moves ascending' : 'sort moves descending';
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext = {xIsNext} squares = {currentSquares} onPlay = {handlePlay} />
      </div>
      <div className="game-info">
        <ol>{ toggleSort ? moves.slice().reverse() : moves}</ol>
      </div>
      <div className="game-info">
        <button onClick = {() => setToggleSort(1 - toggleSort)}>{sortMessage}</button>
      </div>
    </div>
  );
}

function results(squares){
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
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return [lines[i], squares[a]];
  }
  return [null, null];
}

export default Game;
