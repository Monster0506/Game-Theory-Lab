import React from 'react';
import SharedScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';

const ScoreBoard = ({ playerScore, botScore }) => {
  return (
    <SharedScoreBoard
      scores={{
        player: playerScore,
        opponent: botScore
      }}
      labels={{
        player: 'Your Score',
        opponent: 'Bot Score'
      }}
    />
  );
};

export default ScoreBoard;
