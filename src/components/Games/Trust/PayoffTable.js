import React from 'react';
import './PayoffTable.css';

const PayoffTable = ({ initialEndowment, multiplier }) => {
  // Investment strategies
  const investments = [0, initialEndowment/2, initialEndowment];
  const investmentLabels = ['No Trust (0)', 'Partial Trust (5)', 'Full Trust (10)'];
  
  // Return strategies (as percentages of multiplied amount)
  const returnStrategies = [0, 0.5, 1];
  const returnLabels = ['Keep All (0%)', 'Split Gains (50%)', 'Return All (100%)'];

  const calculatePayoffs = (investment, returnRatio) => {
    const multipliedAmount = investment * multiplier;
    const returnedAmount = multipliedAmount * returnRatio;
    
    const playerPayoff = initialEndowment - investment + returnedAmount;
    const trusteePayoff = initialEndowment + multipliedAmount - returnedAmount;
    
    return [playerPayoff, trusteePayoff];
  };

  return (
    <div className="payoff-table">
      <h3>Payoff Matrix</h3>
      <div className="matrix-container">
        <table>
          <thead>
            <tr>
              <th rowSpan={2} colSpan={2}>Payoffs<br/>(Player, Trustee)</th>
              <th colSpan={3}>Trustee's Return Strategy</th>
            </tr>
            <tr>
              {returnLabels.map((label, i) => (
                <th key={i}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {investments.map((investment, i) => (
              <tr key={i}>
                {i === 0 && <th rowSpan={3} className="vertical-text">Player's Investment</th>}
                <th>{investmentLabels[i]}</th>
                {returnStrategies.map((returnRatio, j) => {
                  const [playerPayoff, trusteePayoff] = calculatePayoffs(investment, returnRatio);
                  return (
                    <td key={j} className="payoff-cell">
                      <span className={playerPayoff >= initialEndowment ? 'positive' : 'negative'}>
                        {playerPayoff}
                      </span>
                      , 
                      <span className={trusteePayoff >= initialEndowment ? 'positive' : 'negative'}>
                        {trusteePayoff}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="payoff-notes">
        <p>Initial Endowment: {initialEndowment} tokens each</p>
        <p>Investment Multiplier: {multiplier}x</p>
        <p>Player's Payoff = {initialEndowment} - investment + returned amount</p>
        <p>Trustee's Payoff = {initialEndowment} + (investment × {multiplier}) - returned amount</p>
        <p><em>Green numbers indicate profit (above {initialEndowment} initial tokens)</em></p>
      </div>
    </div>
  );
};

export default PayoffTable;
