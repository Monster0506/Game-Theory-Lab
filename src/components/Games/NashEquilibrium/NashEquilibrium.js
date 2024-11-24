import React, { useState } from 'react';
// import { GameInfo, GameHistory, ChoiceSelector, ScoreBoard, GameResult, StrategySelector } from '../../Shared';
import GameInfo from '../../Shared/GameInfo/GameInfo';
import GameHistory from '../../Shared/GameHistory/GameHistory';
import ChoiceSelector from '../../Shared/ChoiceSelector/ChoiceSelector';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';
import GameResult from '../../Shared/GameResult/GameResult';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import PayoffTable from './PayoffTable';
import { calculateResult, findNashEquilibrium } from './GameLogic';
import { getAllStrategies, getDefaultStrategy } from './botStrategies';
import './NashEquilibrium.css';

const NashEquilibrium = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, bot: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(getDefaultStrategy());

  const equilibria = findNashEquilibrium();
  const gameInfo = {
    title: "Nash Equilibrium",
    description: "In this game, you'll play against an opponent in a 3x3 strategic game. Try to maximize your payoff while considering your opponent's strategy.",
    rules: [
      "Choose one of three strategies: A, B, or C",
      "Your opponent will also choose a strategy: X, Y, or Z",
      "Points are awarded based on the combination of choices",
      "Some strategy combinations form Nash Equilibria",
    ],
    objective: "Find and exploit Nash Equilibrium positions to maximize your score"
  };

  const handleChoice = (choice) => {
    if (!choice) return;

    const botDecision = currentStrategy.makeChoice(gameHistory);
    setPlayerChoice(choice);
    setBotChoice(botDecision);

    const roundResult = calculateResult(choice, botDecision);
    if (!roundResult) return;

    setResult(roundResult);
    setScore(prev => ({
      player: prev.player + (roundResult.player || 0),
      bot: prev.bot + (roundResult.opponent || 0)
    }));

    setGameHistory(prev => [...prev, {
      round: prev.length + 1,
      player: choice,
      bot: botDecision,
      playerScore: roundResult.player || 0,
      botScore: roundResult.opponent || 0,
      message: roundResult.message || 'Round completed'
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

  const renderRoundContent = (round) => (
    <div className="choices">
      <span className="player-choice">You: {round.player}</span>
      <span className="bot-choice">Bot: {round.bot}</span>
      <span className="round-score">
        Score - You: {round.playerScore} | Bot: {round.botScore}
      </span>
      <span className="round-message">{round.message}</span>
    </div>
  );

  return (
    <div>
      <div className="nash-equilibrium">
        <GameInfo {...gameInfo} />
        <PayoffTable />
      </div>
      <div className="game-main">
        <div className="game-controls">
          <ScoreBoard
            scores={score}
            labels={{ player: 'Your Score', bot: 'Bot Score' }}
          />
          <StrategySelector
            strategies={getAllStrategies()}
            currentStrategy={currentStrategy}
            onStrategyChange={handleStrategyChange}
          />
          <ChoiceSelector
            choices={[
              { value: 'A', label: 'Strategy A' },
              { value: 'B', label: 'Strategy B' },
              { value: 'C', label: 'Strategy C' }
            ]}
            onChoice={handleChoice}
            currentChoice={playerChoice}
          />
        </div>
      </div>
      <div className='nash-equilibrium'>
        {result && (
          <GameResult
            result={result}
            choices={{
              player: playerChoice,
              opponent: botChoice
            }}
            getMessage={(result) => result.message}
            title="Round Result"
            choiceLabels={{
              player: 'Your Strategy',
              opponent: 'Opponent Strategy'
            }}
          />
        )}
        <GameHistory
          history={gameHistory}
          renderRoundContent={renderRoundContent}
          title="Nash Equilibrium History"
        />
      </div>
    </div>
  );
};

export default NashEquilibrium;
