import React, { useState, useCallback } from 'react';
import { calculateResult, playerChoices, findEquilibrium } from './GameLogic';
import { getAllStrategies, getDefaultStrategy } from './botStrategies';
import PayoffTable from './PayoffTable';
import GameInfo from '../../Shared/GameInfo/GameInfo';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';
import GameResult from '../../Shared/GameResult/GameResult';
import GameHistory from '../../Shared/GameHistory/GameHistory';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import ChoiceSelector from '../../Shared/ChoiceSelector/ChoiceSelector';
import './HawkDove.css';

const HawkDove = () => {
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [currentStrategy, setCurrentStrategy] = useState(getDefaultStrategy());
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);

  const choices = [
    { value: 'HAWK', label: 'Hawk' },
    { value: 'DOVE', label: 'Dove' }
  ];

  const getMessage = (result) => {
    return result.message;
  };

  const handleChoice = useCallback((choice) => {
    setPlayerChoice(choice);
    const newBotChoice = currentStrategy.makeChoice(gameHistory);
    setBotChoice(newBotChoice);
    
    const result = calculateResult(choice, newBotChoice);
    
    setScores(prev => ({
      player: prev.player + result.player,
      opponent: prev.opponent + result.opponent
    }));
    
    const roundResult = {
      round: gameHistory.length + 1,
      player: choice,
      bot: newBotChoice,
      playerScore: result.player,
      botScore: result.opponent,
      message: result.message
    };
    
    setGameHistory(prev => [...prev, roundResult]);
    setCurrentResult(result);

    // Check for equilibrium
    const equilibriumMessage = findEquilibrium([...gameHistory, roundResult]);
    if (equilibriumMessage) {
      setCurrentResult(prev => ({
        ...prev,
        equilibriumMessage
      }));
    }
  }, [currentStrategy, gameHistory]);

  const handleStrategyChange = useCallback((strategy) => {
    setCurrentStrategy(strategy);
    setPlayerChoice(null);
    setBotChoice(null);
    setCurrentResult(null);
    setScores({ player: 0, opponent: 0 });
    setGameHistory([]);
  }, []);

  const renderRoundContent = useCallback((round) => (
    <div className="round-content">
      <span className="player-choice">You: {round.player}</span>
      <span className="bot-choice">Partner: {round.bot}</span>
      <span className="round-score">
        Score - You: {round.playerScore} | Partner: {round.botScore}
      </span>
    </div>
  ), []);

  const gameInfo = {
    title: "Hawk-Dove Game",
    description: "In this game, players choose between aggressive (Hawk) and peaceful (Dove) strategies. Hawks fight for resources, risking injury, while Doves share or retreat. This models conflict and cooperation in nature and society.",
    rules: [
      "Choose between Hawk (aggressive) or Dove (peaceful) strategy",
      "Hawk vs Hawk: Both fight and risk injury (-25 points each)",
      "Hawk vs Dove: Hawk takes all resources (50 vs 0)",
      "Dove vs Dove: Peaceful sharing of resources (25 each)"
    ]
  };

  return (
    <div className="hawk-dove">
      <GameInfo {...gameInfo} />
      <PayoffTable />
      <StrategySelector
        strategies={getAllStrategies()}
        currentStrategy={currentStrategy}
        onStrategyChange={handleStrategyChange}
        title="Bot Strategy"
      />
      <ScoreBoard 
        scores={scores}
        labels={{ player: 'Your Score', opponent: 'Bot Score' }}
      />
      <ChoiceSelector
        choices={choices}
        onChoice={handleChoice}
        currentChoice={playerChoice}
        buttonClassName="choice-button"
      />
      {currentResult && (
        <GameResult
          result={currentResult}
          choices={{
            player: playerChoice,
            opponent: botChoice
          }}
          getMessage={getMessage}
          title="Round Result"
          choiceLabels={{
            player: "Your choice",
            opponent: "Bot's choice"
          }}
        />
      )}
      <GameHistory
        history={gameHistory}
        renderRoundContent={renderRoundContent}
        title="Game History"
      />
    </div>
  );
};

export default HawkDove;
