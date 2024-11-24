import React from 'react';
import SharedGameHistory from '../../Shared/GameHistory/GameHistory';

const GameHistory = ({ history }) => {
  const renderRoundContent = (round) => (
    <div className="choices">
      <span className="player-choice">You: {round.player}</span>
      <span className="bot-choice">Bot: {round.bot}</span>
      <span className="round-score">Score: {round.playerScore}</span>
    </div>
  );

  return (
    <SharedGameHistory
      history={history}
      renderRoundContent={renderRoundContent}
      title="Prisoner's Dilemma History"
    />
  );
};

export default GameHistory;
