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
import './StagHunt.css';

const StagHunt = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(getDefaultStrategy());

  const choices = [
    { value: 'STAG', label: 'Hunt Stag' },
    { value: 'HARE', label: 'Hunt Hare' }
  ];

  const handlePlayerChoice = (choice) => {
    const botDecision = currentStrategy.makeChoice(gameHistory);
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
    <div className="stag-hunt">
      <GameInfo 
        title="Stag Hunt"
        description="A game of social cooperation where players choose between a high-risk collective reward or a safe individual gain."
        rules={[
          "Choose between hunting a stag (high reward, requires cooperation) or a hare (low reward, guaranteed)",
          "Hunting stag alone yields nothing",
          "Hunting stag together yields the highest reward (4 points each)",
          "Hunting hare always yields a modest reward (2 points)",
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
          getMessage={(result) => {
            if (playerChoice === 'STAG' && botChoice === 'STAG') {
              return "Great cooperation! You both caught the stag for maximum reward!";
            } else if (playerChoice === 'STAG') {
              return "You tried for the stag but your partner went for the safer hare. No reward this time.";
            } else if (botChoice === 'STAG') {
              return "Your partner tried for the stag while you went for the safer hare.";
            } else {
              return "You both played it safe and caught hares.";
            }
          }}
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

export default StagHunt;
