import React, { useState } from 'react';
import GameInfo from '../../Shared/GameInfo/GameInfo';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';
import GameChoices from '../../Shared/ChoiceSelector/ChoiceSelector';
import GameResult from '../../Shared/GameResult/GameResult';
import GameHistory from '../../Shared/GameHistory/GameHistory';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import { calculateResult } from './GameLogic';
import { getAllStrategies, getDefaultStrategy } from './botStrategies';
import PayoffTable from './PayoffTable';
import './MatchingPennies.css';

const MatchingPennies = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, bot: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(getDefaultStrategy());

  const handlePlayerChoice = (choice) => {
    const botDecision = currentStrategy.makeChoice(gameHistory, choice);
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

  const choices = [
    { value: 'HEADS', label: 'Heads' },
    { value: 'TAILS', label: 'Tails' }
  ];

  const gameInfo = {
    title: 'Matching Pennies',
    description: 'A zero-sum game where one player tries to match while the other tries to mismatch.',
    rules: [
      'You and the opponent each choose "Heads" or "Tails"',
      'If choices match, you win a point',
      'If choices differ, opponent wins a point',
      'First to reach target score wins'
    ],
    objective: 'Try to be unpredictable while anticipating your opponent\'s strategy'
  };

  const getMessage = (result) => {
    if (result.player === result.opponent) {
      return "You win! The coins matched!";
    } else {
      return "Bot wins! The coins didn't match.";
    }
  };

  return (
    <div>
      <div className="matching-pennies">
        <GameInfo {...gameInfo} />
        <PayoffTable />
        <StrategySelector
          strategies={getAllStrategies()}
          currentStrategy={currentStrategy}
          onStrategyChange={handleStrategyChange}
          title="Bot Strategy"
        />
        <ScoreBoard
          scores={{
            player: score.player,
            opponent: score.bot
          }}
          title="Score"
        />
        <GameChoices
          choices={choices}
          onChoice={handlePlayerChoice}
          currentChoice={playerChoice}
        />
        {result && (
          <GameResult
            result={result}
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
          renderRoundContent={round => (
            <div className="round-content">
              <div className="history-entry">
                <span className="player-choice">You: {String(round.player)}</span>
                <span className="bot-choice">Bot: {String(round.bot)}</span>
                <span className="round-score">
                  Score - You: {String(round.playerScore)} | Bot: {String(round.botScore)}
                </span>
              </div>
            </div>
          )}
          title="Game History"
        />
      </div>
    </div>
  );
};

export default MatchingPennies;
