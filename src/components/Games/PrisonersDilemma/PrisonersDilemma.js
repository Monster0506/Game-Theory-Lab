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
import './PrisonersDilemma.css';

const PrisonersDilemma = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, bot: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(getDefaultStrategy());

  const choices = [
    { value: 'cooperate', label: 'Cooperate' },
    { value: 'betray', label: 'Betray' }
  ];

  const handlePlayerChoice = (choice) => {
    const botDecision = currentStrategy.makeChoice(gameHistory);
    setPlayerChoice(choice);
    setBotChoice(botDecision);

    const roundResult = calculateResult(choice, botDecision);
    setResult(roundResult);

    // Update scores
    setScore(prev => ({
      player: prev.player + roundResult.player,
      bot: prev.bot + roundResult.bot
    }));

    // Add to history
    setGameHistory(prev => [...prev, {
      round: prev.length + 1,
      player: choice,
      bot: botDecision,
      playerScore: roundResult.player,
      botScore: roundResult.bot
    }]);
  };

  const handleStrategyChange = (newStrategy) => {
    setCurrentStrategy(newStrategy);
    // Reset game when strategy changes
    setPlayerChoice(null);
    setBotChoice(null);
    setResult(null);
    setScore({ player: 0, bot: 0 });
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
    <div className="prisoners-dilemma">
      <GameInfo title="Prisoner's Dilemma" 
        description="A classic game theory scenario where two prisoners must decide whether to cooperate or betray each other."
        rules={[
          "Choose to either cooperate with or betray your partner",
          "If both cooperate, you both get a moderate sentence",
          "If both betray, you both get a heavy sentence",
          "If one betrays while other cooperates, betrayer goes free while cooperator gets maximum sentence"
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
      <GameChoices
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

export default PrisonersDilemma;
