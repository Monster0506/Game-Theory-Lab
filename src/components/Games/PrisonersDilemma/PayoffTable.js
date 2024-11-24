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
              <th>Opponent Cooperates</th>
              <th>Opponent Betrays</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="strategy">You Cooperate</td>
              <td>(3, 3)</td>
              <td>(0, 5)</td>
            </tr>
            <tr>
              <td className="strategy">You Betray</td>
              <td>(5, 0)</td>
              <td>(1, 1)</td>
            </tr>
          </tbody>
        </table>
        <div className="table-legend">
          <p>Format: (Your Points, Opponent Points)</p>
          <p>Higher points are better</p>
        </div>
      </div>
    </div>
  );
};

export default PayoffTable;
