import React, { useState, useCallback } from 'react';
import GameInfo from '../../Shared/GameInfo/GameInfo';
import PayoffTable from './PayoffTable';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';
import GameHistory from '../../Shared/GameHistory/GameHistory';
import GameResult from '../../Shared/GameResult/GameResult';
import ChoiceSelector from '../../Shared/ChoiceSelector/ChoiceSelector';
import { getBotChoice } from './botStrategies';
import './Trust.css';

const Trust = () => {
  // Game constants
  const INITIAL_ENDOWMENT = 10;
  const MULTIPLIER = 3;

  const [scores, setScores] = useState({ player: INITIAL_ENDOWMENT, opponent: INITIAL_ENDOWMENT });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [stage, setStage] = useState('role'); // 'role', 'strategy', 'invest', or 'return'
  const [investment, setInvestment] = useState(null);
  const [returnAmount, setReturnAmount] = useState(null);
  const [playerRole, setPlayerRole] = useState(null); // 'investor' or 'trustee'
  const [botStrategy, setBotStrategy] = useState({ name: 'Random', value: 'random' }); // Initialize with default strategy

  const investorStrategies = [
    { name: 'Random Investor', value: 'random', description: 'Makes random investment decisions' },
    { name: 'Fair Investor', value: 'fair', description: 'Consistently invests half the endowment' },
    { name: 'Cautious Investor', value: 'greedy', description: 'Starts small, increases if profitable' },
    { name: 'Adaptive Investor', value: 'proportional', description: 'Invests based on return history' },
    { name: 'Reactive Investor', value: 'tit-for-tat', description: 'Adjusts based on profit ratios' },
    { name: 'Bold Investor', value: 'risk-seeking', description: 'Makes large investments (70-100%)' },
    { name: 'Conservative Investor', value: 'risk-averse', description: 'Small, careful investments' }
  ];

  const trusteeStrategies = [
    { name: 'Random Trustee', value: 'random', description: 'Makes random return decisions' },
    { name: 'Fair Trustee', value: 'fair', description: 'Returns investment plus half of gains' },
    { name: 'Greedy Trustee', value: 'greedy', description: 'Returns minimal amounts' },
    { name: 'History-Based Trustee', value: 'proportional', description: 'Returns based on investment patterns' },
    { name: 'Mimicking Trustee', value: 'tit-for-tat', description: 'Returns proportional to investment ratio' },
    { name: 'Volatile Trustee', value: 'risk-seeking', description: 'High variance returns (all or minimal)' },
    { name: 'Reliable Trustee', value: 'risk-averse', description: 'Consistent, slightly profitable returns' }
  ];

  const getInvestmentChoices = () => {
    const choices = [];
    for (let i = 0; i <= INITIAL_ENDOWMENT; i++) {
      choices.push({ value: i.toString(), label: i.toString() });
    }
    return choices;
  };

  const getReturnChoices = (multipliedAmount) => {
    const choices = [];
    for (let i = 0; i <= multipliedAmount; i++) {
      choices.push({ value: i.toString(), label: i.toString() });
    }
    return choices;
  };

  const getMessage = useCallback((result) => {
    if (!result) return '';
    const { investment, multipliedAmount, returned } = result;
    const playerLabel = playerRole === 'investor' ? 'invested' : 'received investment of';
    const botLabel = playerRole === 'investor' ? 'returned' : 'invested';
    
    return `You ${playerLabel} ${playerRole === 'investor' ? investment : investment}, it grew to ${multipliedAmount}, and ${
      playerRole === 'investor' ? 'received back' : 'you returned'
    } ${returned}.`;
  }, [playerRole]);

  const handleRoleChoice = (role) => {
    setPlayerRole(role);
    setStage('strategy');
  };

  const handleStrategyChoice = (strategy) => {
    setBotStrategy(strategy);
    if (playerRole === 'investor') {
      setStage('invest');
    } else {
      // Bot makes investment decision
      const botInvestment = getBotChoice(strategy.value, gameHistory, {
        role: 'investor',
        initialEndowment: INITIAL_ENDOWMENT,
        multiplier: MULTIPLIER
      });
      setInvestment(parseInt(botInvestment));
      setStage('return');
    }
  };

  const handleInvestment = useCallback((amount) => {
    const investAmount = parseInt(amount);
    setInvestment(investAmount);
    
    if (playerRole === 'investor') {
      // Bot makes return decision
      const multipliedAmount = investAmount * MULTIPLIER;
      const botReturn = getBotChoice(botStrategy.value, gameHistory, { 
        role: 'trustee',
        investment: investAmount,
        multipliedAmount 
      });
      finishRound(investAmount, parseInt(botReturn));
    } else {
      setStage('return');
    }
  }, [botStrategy, gameHistory, playerRole]);

  const handleReturn = useCallback((amount) => {
    const returnAmount = parseInt(amount);
    setReturnAmount(returnAmount);
    finishRound(investment, returnAmount);
  }, [investment]);

  const finishRound = (investAmount, returnAmount) => {
    const multipliedAmount = investAmount * MULTIPLIER;
    
    let playerProfit, botProfit;
    if (playerRole === 'investor') {
      playerProfit = -investAmount + returnAmount;
      botProfit = multipliedAmount - returnAmount;
    } else {
      playerProfit = multipliedAmount - returnAmount;
      botProfit = -investAmount + returnAmount;
    }
    
    setScores(prev => ({
      player: prev.player + playerProfit,
      opponent: prev.opponent + botProfit
    }));
    
    const result = {
      player: playerProfit,
      opponent: botProfit,
      investment: investAmount,
      multipliedAmount,
      returned: returnAmount
    };
    
    setCurrentResult(result);
    setGameHistory(prev => [...prev, {
      round: prev.length + 1,
      investment: investAmount,
      multipliedAmount,
      returned: returnAmount,
      playerProfit,
      botProfit,
      playerRole,
      botStrategy: botStrategy.name
    }]);

    // Reset for next round
    setStage('role');
    setInvestment(null);
    setReturnAmount(null);
    setPlayerRole(null);
    setBotStrategy({ name: 'Random', value: 'random' });
  };

  const renderRoundContent = useCallback((round) => (
    <div className="round-content">
      <span className="role">Your Role: {round.playerRole}</span>
      <span className="bot-strategy">Partner Strategy: {round.botStrategy}</span>
      <span className="investment">Investment: {round.investment}</span>
      <span className="multiplied">Multiplied to: {round.multipliedAmount}</span>
      <span className="returned">Returned: {round.returned}</span>
      <span className="round-score">
        Profit - You: {round.playerProfit} | Partner: {round.botProfit}
      </span>
    </div>
  ), []);

  const gameInfo = {
    title: "Trust Game",
    description: "A sequential game where players take turns as Investor and Trustee. The Investor decides how much to invest, which is multiplied, and the Trustee decides how much to return.",
    rules: [
      `Each player starts with ${INITIAL_ENDOWMENT} tokens`,
      "1. Choose your role: Investor or Trustee",
      "2. Select your opponent's strategy",
      "3. Investor chooses how much to invest",
      `4. Investment is multiplied by ${MULTIPLIER}`,
      "5. Trustee chooses how much to return",
      "6. Both keep their final amounts",
      "7. Roles can change each round"
    ]
  };

  return (
    <div className="trust-game">
      <GameInfo {...gameInfo} />
      <PayoffTable 
        initialEndowment={INITIAL_ENDOWMENT}
        multiplier={MULTIPLIER}
      />
      <ScoreBoard 
        scores={scores}
        labels={{ player: 'Your Tokens', opponent: 'Partner Tokens' }}
      />
      {stage === 'role' && (
        <ChoiceSelector
          choices={[
            { value: 'investor', label: 'Investor' },
            { value: 'trustee', label: 'Trustee' }
          ]}
          onChoice={handleRoleChoice}
          title="Choose Your Role"
          buttonClassName="choice-button"
        />
      )}
      {stage === 'strategy' && (
        <StrategySelector
          strategies={playerRole === 'investor' ? trusteeStrategies : investorStrategies}
          currentStrategy={botStrategy}
          onStrategyChange={(strategy) => {
            setBotStrategy(strategy);
            handleStrategyChoice(strategy);
          }}
          title={`Choose ${playerRole === 'investor' ? 'Trustee' : 'Investor'} Strategy`}
        />
      )}
      {stage === 'invest' && (
        <ChoiceSelector
          choices={getInvestmentChoices()}
          onChoice={handleInvestment}
          title="Choose Investment Amount"
          buttonClassName="choice-button"
        />
      )}
      {stage === 'return' && (
        <ChoiceSelector
          choices={getReturnChoices(investment * MULTIPLIER)}
          onChoice={handleReturn}
          title={`Choose Return Amount (Investment: ${investment}, Multiplied to: ${investment * MULTIPLIER})`}
          buttonClassName="choice-button"
        />
      )}
      {currentResult && (
        <GameResult
          result={currentResult}
          choices={{
            player: playerRole === 'investor' ? currentResult.investment.toString() : currentResult.returned.toString(),
            opponent: playerRole === 'investor' ? currentResult.returned.toString() : currentResult.investment.toString()
          }}
          getMessage={getMessage}
          title="Round Result"
          choiceLabels={{
            player: playerRole === 'investor' ? "Your investment" : "Your return",
            opponent: playerRole === 'investor' ? "Partner's return" : "Partner's investment"
          }}
        />
      )}
      <GameHistory
        history={gameHistory}
        renderRoundContent={renderRoundContent}
        title="Game History"
      />
    </div>
  );
};

export default Trust;
