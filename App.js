import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  // Game states
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0 });
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  // Winning combinations matrix
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Check for a winner
  const checkWinner = (currentBoard) => {
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  // Handle box press
  const handlePress = (index) => {
    // Ignore press if square is filled or match is over
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    
    if (winner) {
      handleRoundEnd(winner, newBoard);
    } else if (!newBoard.includes(null)) {
      handleRoundEnd('Draw', newBoard);
    } else {
      setIsXNext(!isXNext);
    }
  };

  // Manage round conclusion and score tracking
  const handleRoundEnd = (result, finalBoard) => {
    let newScores = { ...scores };

    if (result !== 'Draw') {
      newScores[result.toLowerCase()] += 1;
      setScores(newScores);
    }

    // Check if someone won Best of 3 (Reached 2 points)
    if (newScores.x === 2 || newScores.o === 2) {
      setGameOver(true);
      setTimeout(() => {
        alert(`Match Over! Player ${newScores.x === 2 ? 'X' : 'O'} wins the Series!`);
        resetEntireGame();
      }, 300);
    } else {
      // Advance to next round
      setTimeout(() => {
        alert(result === 'Draw' ? "It's a Draw!" : `Player ${result} Wins Round ${round}!`);
        resetRound(result);
      }, 300);
    }
  };

  // Reset for the next round
  const resetRound = (result) => {
    setBoard(Array(9).fill(null));
    setRound(round + 1);
    if (result !== 'Draw') {
      setIsXNext(result === 'X');
    }
  };

  // Reset the entire score and series
  const resetEntireGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setScores({ x: 0, o: 0 });
    setRound(1);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Tic-Tac-Toe</Text>
      
      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <View style={styles.scoreBox}>
          <Text style={[styles.playerText, { color: '#2ecc71' }]}>Player X</Text>
          <Text style={styles.scoreNumber}>{scores.x}</Text>
        </View>
        <View style={styles.roundBox}>
          <Text style={styles.roundText}>Round</Text>
          <Text style={styles.roundNumber}>{gameOver ? 'End' : round}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={[styles.playerText, { color: '#e74c3c' }]}>Player O</Text>
          <Text style={styles.scoreNumber}>{scores.o}</Text>
        </View>
      </View>

      {/* Current Turn Indicator */}
      {!gameOver && (
        <Text style={styles.turnText}>
          Turn: <Text style={{ color: isXNext ? '#2ecc71' : '#e74c3c' }}>{isXNext ? 'X' : 'O'}</Text>
        </Text>
      )}

      {/* 3x3 Game Board Grid */}
      <View style={styles.grid}>
        {board.map((value, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.square} 
            onPress={() => handlePress(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.squareText, { color: value === 'X' ? '#2ecc71' : '#e74c3c' }]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetEntireGame}>
        <Text style={styles.resetButtonText}>Reset Entire Match</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', alignItems: 'center', justifyContent: 'center', padding: 20 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20 },
  scoreboard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 15, width: '100%', maxWidth: 350, justifyContent: 'space-around', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, marginBottom: 20 },
  scoreBox: { alignItems: 'center' },
  playerText: { fontSize: 16, fontWeight: 'bold' },
  scoreNumber: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginTop: 5 },
  roundBox: { alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#dcdde1', paddingHorizontal: 20 },
  roundText: { fontSize: 12, color: '#7f8c8d' },
  roundNumber: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  turnText: { fontSize: 20, fontWeight: '600', color: '#34495e', marginBottom: 20 },
  grid: { 
    width: 306, 
    height: 306, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    backgroundColor: '#bdc3c7', 
    padding: 6, 
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center'
  },
  square: { 
    width: 94, 
    height: 94, 
    backgroundColor: '#fff', 
    margin: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 5 
  },
  squareText: { fontSize: 44, fontWeight: 'bold' },
  resetButton: { marginTop: 30, backgroundColor: '#34495e', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  resetButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});