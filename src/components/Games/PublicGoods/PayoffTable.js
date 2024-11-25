import React from 'react';
import './PayoffTable.css';

const PayoffTable = () => {
  return (
    <div className="payoff-table">
      <h3>Payoff Matrix (Net Gains/Losses)</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Partner: 20</th>
            <th>Partner: 15</th>
            <th>Partner: 10</th>
            <th>Partner: 5</th>
            <th>Partner: 0</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>You: 20</td>
            <td className="positive">+10, +10</td>
            <td className="neutral">+7.5, +12.5</td>
            <td className="negative">+5, +15</td>
            <td className="negative">+2.5, +17.5</td>
            <td className="negative">-5, +15</td>
          </tr>
          <tr>
            <td>You: 15</td>
            <td className="positive">+12.5, +7.5</td>
            <td className="positive">+10, +10</td>
            <td className="neutral">+7.5, +12.5</td>
            <td className="negative">+5, +15</td>
            <td className="negative">-2.5, +12.5</td>
          </tr>
          <tr>
            <td>You: 10</td>
            <td className="positive">+15, +5</td>
            <td className="positive">+12.5, +7.5</td>
            <td className="positive">+10, +10</td>
            <td className="neutral">+7.5, +12.5</td>
            <td className="neutral">0, +10</td>
          </tr>
          <tr>
            <td>You: 5</td>
            <td className="positive">+17.5, +2.5</td>
            <td className="positive">+15, +5</td>
            <td className="positive">+12.5, +7.5</td>
            <td className="positive">+10, +10</td>
            <td className="positive">+2.5, +7.5</td>
          </tr>
          <tr>
            <td>You: 0</td>
            <td className="positive">+15, -5</td>
            <td className="positive">+12.5, -2.5</td>
            <td className="positive">+10, 0</td>
            <td className="positive">+7.5, +2.5</td>
            <td className="neutral">0, 0</td>
          </tr>
        </tbody>
      </table>
      <div className="payoff-notes">
        <p>Each cell shows: Your net gain/loss, Partner's net gain/loss</p>
        <p>Net = Return from pool - Initial contribution</p>
        <p>Green: Positive return | Yellow: Break-even | Red: Loss</p>
        <p>Social optimum: Both contribute 20 (Both gain +10)</p>
        <p>Individual temptation: Contribute 0 when partner contributes 20 (You gain +15, they lose -5)</p>
      </div>
    </div>
  );
};

export default PayoffTable;
