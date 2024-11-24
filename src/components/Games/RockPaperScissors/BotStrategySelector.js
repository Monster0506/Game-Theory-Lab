import React from 'react';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import { strategies } from './botStrategies';

const BotStrategySelector = ({ currentStrategy, onStrategyChange }) => {
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
