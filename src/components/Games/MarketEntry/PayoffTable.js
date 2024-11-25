import React from 'react';
import './PayoffTable.css';

const PayoffTable = ({ marketCapacity, entryProfit, entryCost, stayOutProfit }) => {
  const calculatePayoff = (numEntrants) => {
    if (numEntrants <= marketCapacity) {
      return entryProfit - entryCost;
    }
    return -entryCost;
  };

  return (
    <div className="payoff-table">
      <h3>Market Entry Payoffs</h3>
      <table>
        <thead>
          <tr>
            <th>Number of Entrants</th>
            <th>Entry Profit</th>
            <th>Stay Out Profit</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6].map(numEntrants => (
            <tr key={numEntrants}>
              <td>{numEntrants}</td>
              <td className={calculatePayoff(numEntrants) > 0 ? 'positive' : 'negative'}>
                {calculatePayoff(numEntrants)}
              </td>
              <td className="positive">{stayOutProfit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="payoff-notes">
        <p>Market Capacity: {marketCapacity} firms</p>
        <p>Entry Cost: {entryCost}</p>
        <p>Maximum Profit per Entrant: {entryProfit - entryCost}</p>
        <p>Safe Profit (Stay Out): {stayOutProfit}</p>
        <p>Note: The actual number of entrants includes you, your opponent, and 2-4 other simulated firms.</p>
      </div>
    </div>
  );
};

export default PayoffTable;
