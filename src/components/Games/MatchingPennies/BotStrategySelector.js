import React from 'react';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import { getAllStrategies } from './botStrategies';

const BotStrategySelector = ({ currentStrategy, onStrategyChange }) => {
  const strategies = getAllStrategies();
  
  return (
    <StrategySelector
      strategies={strategies}
      currentStrategy={currentStrategy}
      onStrategyChange={onStrategyChange}
      title="Bot Strategy"
    />
  );
};

export default BotStrategySelector;
