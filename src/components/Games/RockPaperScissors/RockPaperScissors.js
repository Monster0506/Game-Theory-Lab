import React, { useState } from 'react';
import GameInfo from './GameInfo';
import ScoreBoard from './ScoreBoard';
import GameChoices from './GameChoices';
import RoundResult from './RoundResult';
import GameHistory from './GameHistory';
import BotStrategySelector from './BotStrategySelector';
import { calculateResult } from './GameLogic';
import { getAllStrategies, getDefaultStrategy } from './botStrategies';
import PayoffTable from './PayoffTable';
import './RockPaperScissors.css';

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, bot: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(getDefaultStrategy());

  const handlePlayerChoice = (choice) => {
    const botDecision = currentStrategy.makeChoice(gameHistory);
    setPlayerChoice(choice);
    setBotChoice(botDecision);

    const roundResult = calculateResult(choice, botDecision);
    setResult(roundResult);

    setScore(prev => ({
      player: prev.player + roundResult.player,
      bot: prev.bot + roundResult.opponent
    }));

    setGameHistory(prev => [...prev, {
      round: prev.length + 1,
      player: choice,
      bot: botDecision,
      playerScore: roundResult.player,
      botScore: roundResult.opponent
    }]);
  };

  const handleStrategyChange = (newStrategy) => {
    setCurrentStrategy(newStrategy);
    setPlayerChoice(null);
    setBotChoice(null);
    setResult(null);
    setScore({ player: 0, bot: 0 });
    setGameHistory([]);
  };

  return (
    <div>
      <div className="rock-paper-scissors">
        <GameInfo />
        <PayoffTable />
        <BotStrategySelector 
          currentStrategy={currentStrategy}
          onStrategyChange={handleStrategyChange}
        />
        <ScoreBoard playerScore={score.player} botScore={score.bot} />
        <GameChoices onChoice={handlePlayerChoice} currentChoice={playerChoice} />
        {result && (
          <RoundResult 
            result={result}
            playerChoice={playerChoice}
            botChoice={botChoice}
          />
        )}
        <GameHistory history={gameHistory} />
      </div>
    </div>
  );
};

export default RockPaperScissors;
