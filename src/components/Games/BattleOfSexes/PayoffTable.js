import React from 'react';
import './BattleOfSexes.css';

const PayoffTable = () => {
  return (
    <div className="payoff-table">
      <h3>Payoff Table</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Partner: Opera</th>
            <th>Partner: Movie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>You: Opera</td>
            <td>(3, 1)</td>
            <td>(0, 0)</td>
          </tr>
          <tr>
            <td>You: Movie</td>
            <td>(0, 0)</td>
            <td>(1, 3)</td>
          </tr>
        </tbody>
      </table>
      <p className="payoff-note">
        Format: (Your points, Partner's points)
      </p>
    </div>
  );
};

export default PayoffTable;
