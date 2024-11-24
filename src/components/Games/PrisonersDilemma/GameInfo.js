import React from 'react';
import SharedGameInfo from '../../Shared/GameInfo/GameInfo';

const GameInfo = () => {
  return (
    <SharedGameInfo
      title="Prisoner's Dilemma"
      description="You and your accomplice have been caught and are being interrogated separately. Will you cooperate with your accomplice or betray them?"
      rules={[
        "If both players cooperate, each serves 1 year",
        "If both players betray, each serves 2 years",
        "If one betrays and one cooperates, the betrayer goes free while the cooperator serves 3 years"
      ]}
    />
  );
};

export default GameInfo;
