import React from 'react';
import SharedGameResult from '../../Shared/GameResult/GameResult';
import { getResultMessage } from './GameLogic';

const RoundResult = ({ result, playerChoice, botChoice }) => {
  return (
    <SharedGameResult
      result={result}
      choices={{
        player: playerChoice,
        opponent: botChoice
      }}
      getMessage={getResultMessage}
      title="Round Result"
      choiceLabels={{
        player: 'Your move',
        opponent: "Bot's move"
      }}
    />
  );
};

export default RoundResult;
