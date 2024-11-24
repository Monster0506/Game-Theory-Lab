import React from 'react';
import SharedGameHistory from '../../Shared/GameHistory/GameHistory';

const GameHistory = ({ history }) => {
  const renderRoundContent = (round) => (
    <div className="choices">
      <span className="player-choice">You: {round.player}</span>
      <span className="bot-choice">Bot: {round.bot}</span>
      <span className="round-score">
        {round.result === 0 ? "Tie" : round.result > 0 ? "Win" : "Loss"}
      </span>
    </div>
  );

  return (
    <SharedGameHistory
      history={history}
      renderRoundContent={renderRoundContent}
      title="Rock Paper Scissors History"
    />
  );
};

export default GameHistory;
