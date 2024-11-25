import React, { useState } from 'react';
import GameInfo from '../../Shared/GameInfo/GameInfo';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';
import ChoiceSelector from '../../Shared/ChoiceSelector/ChoiceSelector';
import GameResult from '../../Shared/GameResult/GameResult';
import GameHistory from '../../Shared/GameHistory/GameHistory';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import { calculateResult } from './GameLogic';
import { getAllStrategies, getDefaultStrategy } from './botStrategies';
import PayoffTable from './PayoffTable';
import './RockPaperScissors.css';

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(getDefaultStrategy());

  const choices = [
    { value: 'rock', label: 'Rock' },
    { value: 'paper', label: 'Paper' },
    { value: 'scissors', label: 'Scissors' }
  ];

  const handlePlayerChoice = (choice) => {
    const botDecision = currentStrategy.makeChoice(choice);
    setPlayerChoice(choice);
    setBotChoice(botDecision);

    const roundResult = calculateResult(choice, botDecision);
    setResult(roundResult);

    setScore(prev => ({
      player: prev.player + roundResult.player,
      opponent: prev.opponent + roundResult.opponent
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
    setScore({ player: 0, opponent: 0 });
    setGameHistory([]);
  };

  const renderRoundContent = (round) => (
    <div className="round-content">
      <span className="player-choice">You: {round.player}</span>
      <span className="bot-choice">Partner: {round.bot}</span>
      <span className="round-score">
        Score - You: {round.playerScore} | Partner: {round.botScore}
      </span>
    </div>
  );

  return (
    <div className="rock-paper-scissors">
      <GameInfo 
        title="Rock Paper Scissors"
        description="A classic game where rock beats scissors, scissors beats paper, and paper beats rock."
        rules={[
          "Choose between Rock, Paper, or Scissors",
          "Rock crushes Scissors",
          "Scissors cuts Paper",
          "Paper covers Rock",
          "Same choices result in a tie"
        ]}
      />
      <PayoffTable />
      <StrategySelector
        strategies={getAllStrategies()}
        currentStrategy={currentStrategy}
        onStrategyChange={handleStrategyChange}
        title="Partner Strategy"
      />
      <ScoreBoard 
        scores={score}
        labels={{ player: 'Your Score', opponent: 'Partner Score' }}
      />
      <ChoiceSelector
        choices={choices}
        onChoice={handlePlayerChoice}
        currentChoice={playerChoice}
        buttonClassName="choice-button"
      />
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
            player: "Your choice",
            opponent: "Partner's choice"
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

export default RockPaperScissors;
