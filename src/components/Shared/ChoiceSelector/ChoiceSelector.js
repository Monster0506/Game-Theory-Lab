import React from 'react';
import './ChoiceSelector.css';

const ChoiceSelector = ({ 
  choices, 
  onChoice, 
  currentChoice,
  buttonClassName = 'choice-button',
  selectedClassName = 'selected',
  title = "Make Your Choice"
}) => {
  return (
    <div className="choice-selector">
      <h3 className="choice-selector-title">{title}</h3>
      <div className="choice-buttons">
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
    </div>
  );
};

export default ChoiceSelector;
