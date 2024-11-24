import React from 'react';
import { findNashEquilibrium } from './GameLogic';

const GameInfo = () => {
  const equilibria = findNashEquilibrium();

  return (
    <div className="game-info">
      <h2>Nash Equilibrium Game</h2>
      <p>
        In this game, you'll explore the concept of Nash Equilibrium through a 3x3 strategic game.
        Each player has three possible strategies, and the payoffs are designed to demonstrate
        strategic decision-making.
      </p>
      <div className="equilibrium-info">
        <h3>Nash Equilibria in this game:</h3>
        <ul>
          {equilibria.map((eq, index) => (
            <li key={index}>
              Strategy Profile: (Player: {eq.playerChoice}, Bot: {eq.botChoice})
              <br />
              Payoffs: (Player: {eq.payoff.player}, Bot: {eq.payoff.bot})
            </li>
          ))}
        </ul>
      </div>
      <div className="strategy-explanation">
        <h3>Your Strategies:</h3>
        <ul>
          <li>Strategy A: Balanced approach with moderate risk and reward</li>
          <li>Strategy B: Aggressive approach with high risk and high reward</li>
          <li>Strategy C: Conservative approach with lower risk and steady rewards</li>
        </ul>
      </div>
    </div>
  );
};

export default GameInfo;
