import React, { useState, useCallback } from 'react';
import GameInfo from '../../Shared/GameInfo/GameInfo';
import PayoffTable from './PayoffTable';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';
import GameHistory from '../../Shared/GameHistory/GameHistory';
import GameResult from '../../Shared/GameResult/GameResult';
import ChoiceSelector from '../../Shared/ChoiceSelector/ChoiceSelector';
import { getBotChoice } from './botStrategies';
import './MarketEntry.css';

const MarketEntry = () => {
  // Game constants
  const MARKET_CAPACITY = 3;
  const ENTRY_PROFIT = 50;
  const ENTRY_COST = 30;
  const STAY_OUT_PROFIT = 10;

  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [currentStrategy, setCurrentStrategy] = useState({ name: 'Random', value: 'random' });
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);

  const choices = [
    { value: 'enter', label: 'Enter Market' },
    { value: 'stay', label: 'Stay Out' }
  ];

  const strategies = [
    { name: 'Random', value: 'random', description: 'Makes random choices' },
    { name: 'Cautious', value: 'cautious', description: 'Only enters if market wasn\'t overcrowded recently' },
    { name: 'Aggressive', value: 'aggressive', description: 'Always enters unless lost money recently' },
    { name: 'Adaptive', value: 'adaptive', description: 'Bases decision on recent profitability' },
    { name: 'Cyclic', value: 'cyclic', description: 'Alternates between enter and stay' }
  ];

  const calculatePayoff = (choice, otherChoice, otherFirms) => {
    if (choice === 'stay') return STAY_OUT_PROFIT;
    
    const totalEntrants = (choice === 'enter' ? 1 : 0) + 
                         (otherChoice === 'enter' ? 1 : 0) + 
                         otherFirms;
    
    return choice === 'enter' 
      ? (totalEntrants <= MARKET_CAPACITY ? ENTRY_PROFIT - ENTRY_COST : -ENTRY_COST)
      : 0;
  };

  const getMessage = useCallback((result) => {
    if (!result) return '';
    const { totalEntrants, playerPayoff, botPayoff } = result;
    const message = `Market had ${totalEntrants} total entrants. ${
      playerPayoff > botPayoff ? 'You made more profit!' :
      playerPayoff < botPayoff ? 'Your opponent made more profit!' :
      'Equal profits!'
    }`;
    return message;
  }, []);

  const handleChoice = useCallback((choice) => {
    const newBotChoice = getBotChoice(currentStrategy.value, gameHistory);
    setBotChoice(newBotChoice);
    setPlayerChoice(choice);
    
    const otherFirms = Math.floor(Math.random() * 3) + 2;
    const playerPayoff = calculatePayoff(choice, newBotChoice, otherFirms);
    const botPayoff = calculatePayoff(newBotChoice, choice, otherFirms);
    
    setScores(prev => ({
      player: prev.player + playerPayoff,
      opponent: prev.opponent + botPayoff
    }));
    
    const result = {
      player: playerPayoff,
      opponent: botPayoff,
      totalEntrants: otherFirms + (choice === 'enter' ? 1 : 0) + (newBotChoice === 'enter' ? 1 : 0),
      message: `You ${playerPayoff >= botPayoff ? 'won' : 'lost'}!`
    };
    
    setCurrentResult(result);
    setGameHistory(prev => [...prev, {
      round: prev.length + 1,
      player: choice,
      bot: newBotChoice,
      playerScore: playerPayoff,
      botScore: botPayoff,
      totalEntrants: result.totalEntrants
    }]);
  }, [currentStrategy, gameHistory]);

  const handleStrategyChange = useCallback((strategy) => {
    setCurrentStrategy(strategy);
    setPlayerChoice(null);
    setBotChoice(null);
    setCurrentResult(null);
    setScores({ player: 0, opponent: 0 });
    setGameHistory([]);
  }, []);

  const renderRoundContent = useCallback((round) => (
    <div className="round-content">
      <span className="player-choice">You: {round.player}</span>
      <span className="bot-choice">Partner: {round.bot}</span>
      <span className="round-score">
        Score - You: {round.playerScore} | Partner: {round.botScore}
      </span>
      <span className="market-info">
        Total Entrants: {round.totalEntrants}
      </span>
    </div>
  ), []);

  const gameInfo = {
    title: "Market Entry Game",
    description: "In this game, you decide whether to enter a market or stay out. The market can only support a limited number of firms profitably. Your profits depend on the total number of firms that enter.",
    rules: [
      "Choose whether to Enter Market or Stay Out",
      "Market can support up to 3 firms profitably",
      "Entry Profit: 50 (minus entry cost of 30)",
      "Stay Out Profit: Safe 10 points",
      "If too many firms enter, all entrants lose their entry cost"
    ]
  };

  return (
    <div className="market-entry">
      <GameInfo {...gameInfo} />
      <PayoffTable 
        marketCapacity={MARKET_CAPACITY}
        entryProfit={ENTRY_PROFIT}
        entryCost={ENTRY_COST}
        stayOutProfit={STAY_OUT_PROFIT}
      />
      <StrategySelector
        strategies={strategies}
        currentStrategy={currentStrategy}
        onStrategyChange={handleStrategyChange}
        title="Bot Strategy"
      />
      <ScoreBoard 
        scores={scores}
        labels={{ player: 'Your Score', opponent: 'Bot Score' }}
      />
      <ChoiceSelector
        choices={choices}
        onChoice={handleChoice}
        currentChoice={playerChoice}
        buttonClassName="choice-button"
      />
      {currentResult && (
        <GameResult
          result={currentResult}
          choices={{
            player: playerChoice,
            opponent: botChoice
          }}
          getMessage={getMessage}
          title="Round Result"
          choiceLabels={{
            player: "Your choice",
            opponent: "Bot's choice"
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

export default MarketEntry;
