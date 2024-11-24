import React from 'react';
import ChoiceSelector from '../../Shared/ChoiceSelector/ChoiceSelector';

const GameChoices = ({ onChoice, currentChoice }) => {
  const choices = [
    { value: 'cooperate', label: 'Cooperate' },
    { value: 'betray', label: 'Betray' }
  ];

  return (
    <ChoiceSelector
      choices={choices}
      onChoice={onChoice}
      currentChoice={currentChoice}
    />
  );
};

export default GameChoices;
