import React from 'react';
import GameInfo from '../../Shared/GameInfo/GameInfo';

const MatchingPenniesInfo = () => {
  const gameInfo = {
    title: 'Matching Pennies',
    description: 'A zero-sum game where one player tries to match while the other tries to mismatch.',
    rules: [
      'You and the opponent each choose "Heads" or "Tails"',
      'If choices match, you win a point',
      'If choices differ, opponent wins a point',
      'First to reach target score wins'
    ],
    objective: 'Try to be unpredictable while anticipating your opponent\'s strategy'
  };

  return <GameInfo {...gameInfo} />;
};

export default MatchingPenniesInfo;
