import React, { useState, useCallback } from 'react';
import GameInfo from '../../Shared/GameInfo/GameInfo';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';
import GameHistory from '../../Shared/GameHistory/GameHistory';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import { getBotStrategy, getAllStrategies, getDefaultStrategy } from './botStrategies';
import './Blotto.css';

const TOTAL_TROOPS = 100;
const NUM_BATTLEFIELDS = 10;

const Blotto = () => {
  const [playerTroops, setPlayerTroops] = useState(new Array(10).fill(0));
  const [botStrategy, setBotStrategy] = useState(getDefaultStrategy());
  const [gameHistory, setGameHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(false);

  const handleTroopInput = (index, value) => {
    const newValue = Math.max(0, Math.min(TOTAL_TROOPS, parseInt(value) || 0));
    const newTroops = [...playerTroops];
    newTroops[index] = newValue;
    setPlayerTroops(newTroops);
    setTotalAllocated(newTroops.reduce((sum, troops) => sum + troops, 0));
  };

  const calculateWinner = (playerTroops, botTroops) => {
    let playerWins = 0;
    let botWins = 0;
    
    for (let i = 0; i < NUM_BATTLEFIELDS; i++) {
      if (playerTroops[i] > botTroops[i]) {
        playerWins++;
      } else if (botTroops[i] > playerTroops[i]) {
        botWins++;
      }
      // Ties are counted as losses for both
    }
    
    return {
      playerWins,
      botWins,
      battlefieldResults: Array(NUM_BATTLEFIELDS).fill(0).map((_, i) => ({
        playerTroops: playerTroops[i],
        botTroops: botTroops[i],
        winner: playerTroops[i] > botTroops[i] ? 'player' : botTroops[i] > playerTroops[i] ? 'bot' : 'tie'
      }))
    };
  };

  const handleSubmit = () => {
    const totalAllocated = playerTroops.reduce((sum, troops) => sum + troops, 0);
    if (totalAllocated !== TOTAL_TROOPS) {
      alert(`You must allocate exactly ${TOTAL_TROOPS} troops. Currently allocated: ${totalAllocated}`);
      return;
    }

    const botTroops = getBotStrategy(botStrategy.value, gameHistory);
    const { playerWins, botWins, battlefieldResults } = calculateWinner(playerTroops, botTroops);

    // Update scores
    setScores(prev => ({
      player: prev.player + (playerWins > botWins ? 1 : 0),
      opponent: prev.opponent + (botWins > playerWins ? 1 : 0)
    }));

    const roundResult = {
      round: gameHistory.length + 1,
      playerTroops: [...playerTroops],
      botTroops,
      battlefieldResults,
      winner: playerWins > botWins ? 'player' : botWins > playerWins ? 'bot' : 'tie',
      botStrategy: botStrategy.name,
      playerMove: playerTroops.join('-'),
      opponentMove: botTroops.join('-'),
      outcome: playerWins > botWins ? 'player' : botWins > playerWins ? 'bot' : 'tie'
    };

    setCurrentResult(roundResult);
    setGameHistory(prev => [...prev, roundResult]);
    setPlayerTroops(Array(NUM_BATTLEFIELDS).fill(0));
    setTotalAllocated(0);
    setGameInProgress(false);
  };

  const handleStrategyChange = (newStrategy) => {
    setBotStrategy(newStrategy);
    setCurrentResult(null);
  };

  const handleRandomize = () => {
    const newTroops = Array(NUM_BATTLEFIELDS).fill(0);
    let remainingTroops = TOTAL_TROOPS;

    // First pass: distribute troops randomly
    for (let i = 0; i < remainingTroops; i++) {
      const randomIndex = Math.floor(Math.random() * NUM_BATTLEFIELDS);
      newTroops[randomIndex]++;
    }

    setPlayerTroops(newTroops);
    setTotalAllocated(TOTAL_TROOPS);
  };

  const renderRoundContent = useCallback((round) => (
    <div className="round-content">
      <div className="allocations">
        <span className="player-allocation">
          You: {round.playerTroops.join(' - ')}
        </span>
        <span className="bot-allocation">
          Opponent: {round.botTroops.join(' - ')}
        </span>
      </div>
      <span className="round-result">
        Result: {round.winner === 'player' ? 'You won!' : round.winner === 'bot' ? 'Opponent won!' : 'Tie!'}
      </span>
    </div>
  ), []);

  const gameInfo = {
    title: "Colonel Blotto Game",
    description: "A game of strategic resource allocation across multiple battlefields.",
    rules: [
      `Total troops available: ${TOTAL_TROOPS}`,
      `Number of battlefields: ${NUM_BATTLEFIELDS}`,
      "Allocate your troops across all battlefields",
      "Win more battlefields than your opponent to win the round",
      "A battlefield is won by having more troops there",
      "Ties in a battlefield count as losses for both players"
    ]
  };

  return (
    <div className="blotto-game">
      <GameInfo {...gameInfo} />
      
      <StrategySelector
        strategies={getAllStrategies()}
        currentStrategy={botStrategy}
        onStrategyChange={handleStrategyChange}
        title="Opponent Strategy"
      />

      <ScoreBoard
        scores={scores}
        labels={{ player: 'Your Wins', opponent: 'Opponent Wins' }}
      />

      <div className="troop-allocation">
        <div className="troop-controls">
          <h3>Allocate Your Troops</h3>
          <button 
            className="randomize-button"
            onClick={handleRandomize}
            disabled={gameInProgress}
          >
            🎲 Randomize
          </button>
        </div>
        <div className="battlefield-inputs">
          {playerTroops.map((troops, index) => (
            <div key={index} className="battlefield-input">
              <label>Battlefield {index + 1}</label>
              <input
                type="number"
                min="0"
                max={TOTAL_TROOPS}
                value={troops}
                onChange={(e) => handleTroopInput(index, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="troops-info">
          <span>Total Allocated: {totalAllocated}</span>
          <span>Remaining: {TOTAL_TROOPS - totalAllocated}</span>
        </div>
        <button 
          className="submit-button"
          onClick={handleSubmit}
          disabled={totalAllocated !== TOTAL_TROOPS}
        >
          Deploy Troops
        </button>
      </div>

      {currentResult && (
        <div className="round-result">
          <h3>Round Result</h3>
          <p className="result-message">
            {currentResult.winner === 'player' 
              ? "Victory! You won more battlefields!"
              : currentResult.winner === 'bot'
              ? "Defeat! Your opponent won more battlefields."
              : "It's a tie! Both won equal number of battlefields."}
          </p>
          <div className="battlefield-results">
            {currentResult.battlefieldResults.map((bf, i) => (
              <div key={i} className="battlefield-result">
                <h4>Battlefield {i + 1}</h4>
                <p>Your troops: {bf.playerTroops}</p>
                <p>Opponent's troops: {bf.botTroops}</p>
                <p className={`winner ${bf.winner === 'player' ? 'player-win' : bf.winner === 'bot' ? 'opponent-win' : 'tie'}`}>
                  {bf.winner === 'player' 
                    ? "You won!" 
                    : bf.winner === 'bot' 
                    ? "Opponent won!" 
                    : "Tie!"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <GameHistory
        history={gameHistory}
        renderRoundContent={renderRoundContent}
        title="Game History"
      />
    </div>
  );
};

export default Blotto;
