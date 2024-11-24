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
              <th>Heads</th>
              <th>Tails</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="strategy">Heads</td>
              <td>(1, 0)</td>
              <td>(0, 1)</td>
            </tr>
            <tr>
              <td className="strategy">Tails</td>
              <td>(0, 1)</td>
              <td>(1, 0)</td>
            </tr>
          </tbody>
        </table>
        <div className="table-legend">
          <p>Format: (Your Points, Opponent Points)</p>
        </div>
      </div>
    </div>
  );
};

export default PayoffTable;
