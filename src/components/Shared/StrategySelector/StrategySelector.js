import React from 'react';
import './StrategySelector.css';

const StrategySelector = ({ 
  strategies,
  currentStrategy, 
  onStrategyChange,
  title = 'Strategy Selection'
}) => {
  return (
    <div className="strategy-selector">
      <h3>{title}</h3>
      <div className="strategy-options">
        {Object.entries(strategies).map(([key, strategy]) => (
          <div 
            key={key}
            className={`strategy-card ${currentStrategy.name === strategy.name ? 'selected' : ''}`}
            onClick={() => onStrategyChange(strategy)}
          >
            <h4>{strategy.name}</h4>
            <p>{strategy.description}</p>
            {currentStrategy.name === strategy.name && (
              <div className="active-indicator">
                Current Strategy
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategySelector;
