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
import './BattleOfSexes.css';

const BattleOfSexes = () => {
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

  const choices = [
    { value: 'OPERA', label: 'Opera' },
    { value: 'MOVIE', label: 'Movie' }
  ];

  const gameInfo = {
    title: 'Battle of the Sexes',
    description: 'A coordination game where two players must choose between going to the opera or a movie.',
    rules: [
      'You and your partner must choose between going to the opera or a movie',
      'You prefer the opera (3 points if both choose opera, 1 if both choose movie)',
      'Your partner prefers the movie (1 point if both choose opera, 3 if both choose movie)',
      'If you choose different activities, neither gets any points'
    ],
    objective: 'Try to coordinate with your partner while maximizing your own payoff'
  };

  const getMessage = (result) => {
    if (result.player === 0 && result.opponent === 0) {
      return "No points! You chose different activities.";
    } else if (result.player === 3) {
      return "Great choice! You both went to the opera (your preference).";
    } else {
      return "Good compromise! You both went to the movie (partner's preference).";
    }
  };

  return (
    <div>
      <div className="battle-of-sexes">
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
              opponent: "Partner's choice"
            }}
          />
        )}
        <GameHistory
          history={gameHistory}
          renderRoundContent={round => (
            <div className="round-content">
              <span className="player-choice">You: {round.player}</span>
              <span className="bot-choice">Partner: {round.bot}</span>
              <span className="round-score">
                Score - You: {round.playerScore} | Partner: {round.botScore}
              </span>
            </div>
          )}
          title="Game History"
        />
      </div>
    </div>
  );
};

export default BattleOfSexes;
