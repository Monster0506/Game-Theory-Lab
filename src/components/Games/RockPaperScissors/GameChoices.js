import React from 'react';
import ChoiceSelector from '../../Shared/ChoiceSelector/ChoiceSelector';

const GameChoices = ({ onChoice, currentChoice }) => {
  const choices = [
    { value: 'rock', label: '🪨 Rock' },
    { value: 'paper', label: '📄 Paper' },
    { value: 'scissors', label: '✂️ Scissors' }
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
