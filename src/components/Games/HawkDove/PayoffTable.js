import React from 'react';
import './HawkDove.css';

const PayoffTable = () => {
  return (
    <div className="payoff-table">
      <h3>Payoff Table</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Opponent: Hawk</th>
            <th>Opponent: Dove</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>You: Hawk</td>
            <td>(-25, -25)</td>
            <td>(50, 0)</td>
          </tr>
          <tr>
            <td>You: Dove</td>
            <td>(0, 50)</td>
            <td>(25, 25)</td>
          </tr>
        </tbody>
      </table>
      <div className="payoff-notes">
        <p>Resource Value (V) = 50</p>
        <p>Cost of Conflict (C) = 100</p>
        <p>Format: (Your points, Opponent's points)</p>
      </div>
    </div>
  );
};

export default PayoffTable;
