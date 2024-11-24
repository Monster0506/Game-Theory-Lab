import React from 'react';
import './ChoiceSelector.css';

const ChoiceSelector = ({ 
  choices, 
  onChoice, 
  currentChoice,
  buttonClassName = 'choice-button',
  selectedClassName = 'selected'
}) => {
  return (
    <div className="choice-selector">
      {choices.map((choice) => (
        <button 
          key={choice.value}
          className={`${buttonClassName} ${currentChoice === choice.value ? selectedClassName : ''}`}
          onClick={() => onChoice(choice.value)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
};

export default ChoiceSelector;
