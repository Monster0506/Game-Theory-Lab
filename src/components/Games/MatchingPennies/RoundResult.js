import React from 'react';
import GameResult from '../../Shared/GameResult/GameResult';

const MatchingPenniesResult = ({ result, playerChoice, botChoice }) => {
  const resultData = {
    playerChoice,
    botChoice,
    result: {
      message: result.message,
      points: {
        player: result.player,
        bot: result.bot
      }
    }
  };

  return <GameResult {...resultData} />;
};

export default MatchingPenniesResult;
