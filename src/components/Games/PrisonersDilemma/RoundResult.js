import React from 'react';
import SharedGameResult from '../../Shared/GameResult/GameResult';

const RoundResult = ({ result, playerChoice, botChoice }) => {
  const getResultMessage = (result, choices) => {
    const messages = {
      bothCooperate: "Both cooperated! You each serve 1 year.",
      bothBetray: "Both betrayed! You each serve 2 years.",
      playerBetrayed: "You betrayed while they cooperated! You go free, they serve 3 years.",
      botBetrayed: "They betrayed while you cooperated! You serve 3 years, they go free."
    };

    if (choices.player === 'cooperate' && choices.opponent === 'cooperate') return messages.bothCooperate;
    if (choices.player === 'betray' && choices.opponent === 'betray') return messages.bothBetray;
    if (choices.player === 'betray' && choices.opponent === 'cooperate') return messages.playerBetrayed;
    return messages.botBetrayed;
  };

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
        player: 'Your choice',
        opponent: "Bot's choice"
      }}
    />
  );
};

export default RoundResult;
