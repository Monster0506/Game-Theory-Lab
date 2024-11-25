import React from 'react';
import './PayoffTable.css';

const PayoffTable = () => {
  return (
    <div className="payoff-table">
      <h3>Payoff Table</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Partner: Stag</th>
            <th>Partner: Hare</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>You: Stag</td>
            <td>(4, 4)</td>
            <td>(0, 2)</td>
          </tr>
          <tr>
            <td>You: Hare</td>
            <td>(2, 0)</td>
            <td>(2, 2)</td>
          </tr>
        </tbody>
      </table>
      <div className="payoff-notes">
        <p>First number in each cell is your payoff, second is your partner's payoff</p>
        <p>4 points: Successfully hunting stag together</p>
        <p>2 points: Successfully hunting hare</p>
        <p>0 points: Attempting to hunt stag alone</p>
      </div>
    </div>
  );
};

export default PayoffTable;
