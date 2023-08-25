// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Square({value, onSquareClick}){
  return <button className="square" onClick = {onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {

  const nextValue = xIsNext ? 'X' : 'O';
  const winner = calculateWinner(squares);
  const gameStatus = winner ? 'Winner: ' + winner : 'Next player: ' + nextValue;

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
      row.push(<Square key={num} value = {squares[num]} onSquareClick = {() => handleClick(num)} />);
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
    if(historyLength === 0 || move === historyLength - 1){
      description = 'You are at move #' + currentMove;
      return (
        <li key = {move}>
          <div> {description} </div>
        </li>
      );
    }

    
    
    description = move > 0 ? 'Go to move #' + move : 'Go to game start';

    description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key = {move}>
        <button onClick = {() => jumpTo(move)}> {description} </button>
      </li>
    );
  })

  function sortMoves(){
    moves.reverse();
    
    setToggleSort(1 - toggleSort);
  }
  console.log(moves)
  // onClick = {() => sortMoves()}
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
        <button onClick = {() => sortMoves()}>{sortMessage}</button>
      </div>
    </div>
  );
}

function calculateWinner(board){
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
    if(board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export default Game;
