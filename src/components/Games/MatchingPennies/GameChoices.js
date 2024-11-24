import React from 'react';
import ChoiceSelector from '../../Shared/ChoiceSelector/ChoiceSelector';

const GameChoices = ({ onChoice, currentChoice }) => {
  const choices = [
    { value: 'HEADS', label: 'Heads' },
    { value: 'TAILS', label: 'Tails' }
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
