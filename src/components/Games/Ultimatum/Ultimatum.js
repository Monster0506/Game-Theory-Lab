import React, { useState, useCallback } from 'react';
import GameInfo from '../../Shared/GameInfo/GameInfo';
import PayoffTable from './PayoffTable';
import StrategySelector from '../../Shared/StrategySelector/StrategySelector';
import ScoreBoard from '../../Shared/ScoreBoard/ScoreBoard';
import GameHistory from '../../Shared/GameHistory/GameHistory';
import GameResult from '../../Shared/GameResult/GameResult';
import ChoiceSelector from '../../Shared/ChoiceSelector/ChoiceSelector';
import Slider from '../../Shared/Slider/Slider';
import { getBotChoice } from './botStrategies';
import './Ultimatum.css';

const Ultimatum = () => {
  // Game constants
  const TOTAL_AMOUNT = 10;

  // Game states
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [stage, setStage] = useState('role'); // 'role', 'strategy', 'offer', 'respond'
  const [playerRole, setPlayerRole] = useState(null); // 'proposer' or 'responder'
  const [botStrategy, setBotStrategy] = useState({ name: 'Random', value: 'random' });
  const [offer, setOffer] = useState(null);
  const [response, setResponse] = useState(null);

  const proposerStrategies = [
    { name: 'Random Proposer', value: 'random', description: 'Makes random offers' },
    { name: 'Fair Proposer', value: 'fair', description: 'Offers an even split' },
    { name: 'Greedy Proposer', value: 'greedy', description: 'Makes minimal offers' },
    { name: 'Generous Proposer', value: 'generous', description: 'Makes high offers' },
    { name: 'Adaptive Proposer', value: 'adaptive', description: 'Learns from acceptance history to optimize offers' },
    { name: 'Tit-for-Tat Proposer', value: 'titForTat', description: 'Adjusts offers based on responder\'s acceptance history' },
    { name: 'Gradual Learner', value: 'gradual', description: 'Slowly adjusts offers based on success rate' },
    { name: 'Reactive Proposer', value: 'reactive', description: 'Makes larger adjustments after rejections' }
  ];

  const responderStrategies = [
    { name: 'Random Responder', value: 'random', description: 'Randomly accepts or rejects offers' },
    { name: 'Fair Responder', value: 'fair', description: 'Accepts only fair splits' },
    { name: 'Accepting Responder', value: 'accepting', description: 'Accepts most offers' },
    { name: 'Strict Responder', value: 'strict', description: 'Only accepts generous offers' },
    { name: 'Adaptive Responder', value: 'adaptive', description: 'Adjusts acceptance threshold based on offer history' },
    { name: 'Tit-for-Tat Responder', value: 'titForTat', description: 'Bases decisions on proposer\'s history of fairness' },
    { name: 'Reputation Based', value: 'reputation', description: 'Maintains a fairness score for the proposer' },
    { name: 'Trend Analyzer', value: 'trend', description: 'Analyzes patterns in offer changes' }
  ];

  const getResponseChoices = () => {
    return [
      { value: 'accept', label: 'Accept' },
      { value: 'reject', label: 'Reject' }
    ];
  };

  const getMessage = useCallback((result) => {
    if (!result) return '';
    const { offer, response } = result;
    if (playerRole === 'proposer') {
      return `You offered ${offer}, and your partner ${response === 'accept' ? 'accepted' : 'rejected'} the offer.`;
    } else {
      return `Your partner offered ${offer}, and you ${response === 'accept' ? 'accepted' : 'rejected'} the offer.`;
    }
  }, [playerRole]);

  const handleRoleChoice = (role) => {
    setPlayerRole(role);
    setStage('strategy');
  };

  const handleStrategyChoice = (strategy) => {
    setBotStrategy(strategy);
    if (playerRole === 'proposer') {
      setStage('offer');
    } else {
      // Bot makes offer
      const botOffer = getBotChoice(strategy.value, gameHistory, {
        role: 'proposer',
        totalAmount: TOTAL_AMOUNT
      });
      setOffer(parseInt(botOffer));
      setStage('respond');
    }
  };

  const handleOffer = useCallback((amount) => {
    const offerAmount = parseInt(amount);
    setOffer(offerAmount);
    
    if (playerRole === 'proposer') {
      // Bot decides to accept or reject
      const botResponse = getBotChoice(botStrategy.value, gameHistory, {
        role: 'responder',
        offer: offerAmount,
        totalAmount: TOTAL_AMOUNT
      });
      finishRound(offerAmount, botResponse);
    }
  }, [botStrategy, gameHistory, playerRole]);

  const handleResponse = useCallback((choice) => {
    setResponse(choice);
    finishRound(offer, choice);
  }, [offer]);

  const finishRound = (offerAmount, responseChoice) => {
    let playerProfit, botProfit;
    
    if (responseChoice === 'accept') {
      if (playerRole === 'proposer') {
        playerProfit = TOTAL_AMOUNT - offerAmount;
        botProfit = offerAmount;
      } else {
        playerProfit = offerAmount;
        botProfit = TOTAL_AMOUNT - offerAmount;
      }
    } else {
      playerProfit = 0;
      botProfit = 0;
    }
    
    setScores(prev => ({
      player: prev.player + playerProfit,
      opponent: prev.opponent + botProfit
    }));
    
    const result = {
      offer: offerAmount,
      response: responseChoice,
      player: playerProfit,
      opponent: botProfit
    };
    
    setCurrentResult(result);
    setGameHistory(prev => [...prev, {
      round: prev.length + 1,
      offer: offerAmount,
      response: responseChoice,
      playerProfit,
      botProfit,
      playerRole,
      botStrategy: botStrategy.name
    }]);

    // Reset for next round
    setStage('role');
    setOffer(null);
    setResponse(null);
    setPlayerRole(null);
    setBotStrategy({ name: 'Random', value: 'random' });
  };

  const renderRoundContent = useCallback((round) => (
    <div className="round-content">
      <span className="player-choice">
        {playerRole === 'proposer' ? `You offered: ${round.offer}` : `Partner offered: ${round.offer}`}
      </span>
      <span className="bot-choice">
        {round.response === 'accept' ? 'Accepted' : 'Rejected'}
      </span>
      <span className="round-score">
        Profit - You: {round.playerProfit} | Partner: {round.botProfit}
      </span>
    </div>
  ), [playerRole]);

  const gameInfo = {
    title: "Ultimatum Game",
    description: "A two-player game where one player (Proposer) offers a split of money, and the other player (Responder) decides to accept or reject it. If rejected, both players get nothing.",
    rules: [
      `Total amount to split: ${TOTAL_AMOUNT} tokens`,
      "1. Choose your role: Proposer or Responder",
      "2. Select your opponent's strategy",
      "3. Proposer offers a split",
      "4. Responder accepts or rejects",
      "5. If accepted, both get their share",
      "6. If rejected, both get nothing",
      "7. Roles can change each round"
    ]
  };

  return (
    <div className="ultimatum-game">
      <GameInfo {...gameInfo} />
      <PayoffTable totalAmount={TOTAL_AMOUNT} />
      <ScoreBoard 
        scores={scores}
        labels={{ player: 'Your Tokens', opponent: 'Partner Tokens' }}
      />
      {stage === 'role' && (
        <ChoiceSelector
          choices={[
            { value: 'proposer', label: 'Proposer' },
            { value: 'responder', label: 'Responder' }
          ]}
          onChoice={handleRoleChoice}
          title="Choose Your Role"
          buttonClassName="choice-button"
        />
      )}
      {stage === 'strategy' && (
        <StrategySelector
          strategies={playerRole === 'proposer' ? responderStrategies : proposerStrategies}
          currentStrategy={botStrategy}
          onStrategyChange={(strategy) => {
            setBotStrategy(strategy);
            handleStrategyChoice(strategy);
          }}
          title={`Choose ${playerRole === 'proposer' ? 'Responder' : 'Proposer'} Strategy`}
        />
      )}
      {stage === 'offer' && (
        <Slider
          min={0}
          max={TOTAL_AMOUNT}
          title="Make Your Offer"
          leftLabel="Keep All"
          rightLabel="Give All"
          submitLabel="Make Offer"
          onSubmit={handleOffer}
        />
      )}
      {stage === 'respond' && (
        <ChoiceSelector
          choices={getResponseChoices()}
          onChoice={handleResponse}
          title={`Respond to Offer: ${offer}`}
          buttonClassName="choice-button"
        />
      )}
      {currentResult && (
        <GameResult
          result={currentResult}
          choices={{
            player: playerRole === 'proposer' ? currentResult.offer.toString() : currentResult.response,
            opponent: playerRole === 'proposer' ? currentResult.response : currentResult.offer.toString()
          }}
          getMessage={getMessage}
          title="Round Result"
          choiceLabels={{
            player: playerRole === 'proposer' ? "Your offer" : "Your response",
            opponent: playerRole === 'proposer' ? "Partner's response" : "Partner's offer"
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

export default Ultimatum;
