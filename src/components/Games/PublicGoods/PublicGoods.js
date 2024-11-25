import React, { useState } from 'react';
import GameInfo from '../../Shared/GameInfo/GameInfo';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';
import GameResult from '../../Shared/GameResult/GameResult';
import GameHistory from '../../Shared/GameHistory/GameHistory';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import { calculateResult } from './GameLogic';
import { getAllStrategies, getDefaultStrategy } from './botStrategies';
import PayoffTable from './PayoffTable';
import './PublicGoods.css';

const PublicGoods = () => {
  const [playerContribution, setPlayerContribution] = useState(null);
  const [botContributions, setBotContributions] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 20, opponent: 20 }); // Starting endowment
  const [gameHistory, setGameHistory] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState(getDefaultStrategy());

  const handleContribution = (amount) => {
    if (amount > score.player) return; // Can't contribute more than you have

    const botDecision = currentStrategy.makeChoice(gameHistory, score.opponent);
    setPlayerContribution(amount);
    setBotContributions(botDecision);

    const roundResult = calculateResult(amount, botDecision);
    setResult(roundResult);

    setScore(prev => ({
      player: prev.player - amount + roundResult.player,
      opponent: prev.opponent - botDecision + roundResult.opponent
    }));

    setGameHistory(prev => [...prev, {
      round: prev.length + 1,
      player: amount,
      bot: botDecision,
      playerReturn: roundResult.player,
      botReturn: roundResult.opponent,
      totalPool: amount + botDecision,
      multipliedPool: (amount + botDecision) * 1.5
    }]);
  };

  const handleStrategyChange = (newStrategy) => {
    setCurrentStrategy(newStrategy);
    setPlayerContribution(null);
    setBotContributions(null);
    setResult(null);
    setScore({ player: 20, opponent: 20 });
    setGameHistory([]);
  };

  const renderContributionButtons = () => {
    const possibleContributions = [0, 5, 10, 15, 20];
    return (
      <div className="contribution-selector">
        <h3>Choose Your Contribution</h3>
        <div className="contribution-buttons">
          {possibleContributions.map(amount => (
            <button
              key={amount}
              onClick={() => handleContribution(amount)}
              disabled={amount > score.player}
              className={`contribution-button ${playerContribution === amount ? 'selected' : ''}`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderRoundContent = (round) => (
    <div className="round-content">
      <div className="contribution-info">
        <span>Your contribution: {round.player}</span>
        <span>Partner contribution: {round.bot}</span>
      </div>
      <div className="pool-info">
        <span>Total pool: {round.totalPool}</span>
        <span>Multiplied pool (×1.5): {round.multipliedPool}</span>
      </div>
      <div className="return-info">
        <span>Your return: {round.playerReturn}</span>
        <span>Partner return: {round.botReturn}</span>
      </div>
    </div>
  );

  return (
    <div className="public-goods">
      <GameInfo 
        title="Public Goods Game"
        description="A social dilemma where players decide how much to contribute to a common pool that benefits everyone."
        rules={[
          "Each player starts with 20 tokens",
          "Choose how many tokens (0-20) to contribute to the common pool",
          "Total contributions are multiplied by 1.5",
          "The multiplied amount is divided equally among all players",
          "Maximum group benefit occurs when everyone contributes fully",
          "But individual benefit is maximized by contributing nothing"
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
        labels={{ player: 'Your Tokens', opponent: 'Partner Tokens' }}
      />
      {renderContributionButtons()}
      {result && (
        <GameResult
          result={result}
          choices={{
            player: playerContribution,
            opponent: botContributions
          }}
          getMessage={(result) => {
            const totalPool = playerContribution + botContributions;
            const multipliedPool = totalPool * 1.5;
            return `Pool of ${totalPool} tokens was multiplied to ${multipliedPool} tokens and split equally. You received ${result.player} tokens back.`;
          }}
          title="Round Result"
          choiceLabels={{
            player: "Your contribution",
            opponent: "Partner's contribution"
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

export default PublicGoods;
