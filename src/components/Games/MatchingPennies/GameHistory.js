import React from 'react';
import GameHistory from '../../Shared/GameHistory/GameHistory';

const MatchingPenniesHistory = ({ history }) => {
  const renderRoundContent = (round) => (
    <div className="round-content">
      <span className="player-choice">You: {round.player}</span>
      <span className="bot-choice">Bot: {round.bot}</span>
      <span className="round-score">
        Score - You: {round.playerScore} | Bot: {round.botScore}
      </span>
    </div>
  );

  return (
    <GameHistory
      history={history}
      renderRoundContent={renderRoundContent}
      title="Game History"
    />
  );
};

export default MatchingPenniesHistory;
