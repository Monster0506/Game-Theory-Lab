import React from 'react';
import SharedGameInfo from '../../Shared/GameInfo/GameInfo';

const GameInfo = () => {
  return (
    <SharedGameInfo
      title="Rock Paper Scissors"
      description="A classic game of chance and strategy. Choose your move wisely!"
      rules={[
        "Rock crushes Scissors",
        "Scissors cuts Paper",
        "Paper covers Rock",
        "Same moves result in a tie",
        "Win by predicting and countering your opponent's move"
      ]}
    />
  );
};

export default GameInfo;
