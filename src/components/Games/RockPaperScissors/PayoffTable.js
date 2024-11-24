import React from 'react';
import './PayoffTable.css';

const PayoffTable = () => {
  return (
    <div className="payoff-table-container">
      <h3>Payoff Table</h3>
      <div className="payoff-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Opponent Rock</th>
              <th>Opponent Paper</th>
              <th>Opponent Scissors</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="strategy">Your Rock</td>
              <td>(0, 0)</td>
              <td>(0, 1)</td>
              <td>(1, 0)</td>
            </tr>
            <tr>
              <td className="strategy">Your Paper</td>
              <td>(1, 0)</td>
              <td>(0, 0)</td>
              <td>(0, 1)</td>
            </tr>
            <tr>
              <td className="strategy">Your Scissors</td>
              <td>(0, 1)</td>
              <td>(1, 0)</td>
              <td>(0, 0)</td>
            </tr>
          </tbody>
        </table>
        <div className="table-legend">
          <p>Format: (Your Points, Opponent Points)</p>
          <p>1 point for winning, 0 for draw or loss</p>
          <ul className="winning-rules">
            <li>Rock crushes Scissors</li>
            <li>Scissors cuts Paper</li>
            <li>Paper covers Rock</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PayoffTable;
