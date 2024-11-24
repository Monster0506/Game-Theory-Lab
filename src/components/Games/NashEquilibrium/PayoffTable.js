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
              <th>X</th>
              <th>Y</th>
              <th>Z</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="strategy">A</td>
              <td>(3, 3)</td>
              <td>(1, 4)</td>
              <td>(0, 1)</td>
            </tr>
            <tr>
              <td className="strategy">B</td>
              <td>(4, 1)</td>
              <td>(2, 2)</td>
              <td>(1, 3)</td>
            </tr>
            <tr>
              <td className="strategy">C</td>
              <td>(1, 0)</td>
              <td>(3, 1)</td>
              <td>(4, 4)</td>
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
