import React from 'react';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';

const MatchingPenniesScoreBoard = ({ playerScore, botScore }) => {
  return (
    <ScoreBoard
      playerScore={playerScore}
      botScore={botScore}
      title="Score"
    />
  );
};

export default MatchingPenniesScoreBoard;
