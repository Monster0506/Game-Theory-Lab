import React from 'react';
import './PayoffTable.css';

const PayoffTable = ({ totalAmount = 10 }) => {
  // Generate offer ranges for the matrix
  const offerRanges = [
    { min: 0, max: 2, label: 'Low (0-2)' },
    { min: 3, max: 4, label: 'Medium-Low (3-4)' },
    { min: 5, max: 5, label: 'Fair (5)' },
    { min: 6, max: 7, label: 'Medium-High (6-7)' },
    { min: 8, max: 10, label: 'High (8-10)' }
  ];

  return (
    <div className="payoff-table">
      <h3>Payoff Matrix</h3>
      <table>
        <thead>
          <tr>
            <th rowSpan="2">Proposer's Offer</th>
            <th colSpan="2">Responder's Decision</th>
          </tr>
          <tr>
            <th>Accept</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {offerRanges.map(range => {
            const avgOffer = Math.ceil((range.min + range.max) / 2);
            return (
              <tr key={range.label}>
                <td>{range.label}</td>
                <td className="accept-cell">
                  <span className="proposer">P: {totalAmount - avgOffer}</span>
                  <span className="responder">R: {avgOffer}</span>
                </td>
                <td className="reject-cell">
                  <span className="proposer">P: 0</span>
                  <span className="responder">R: 0</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="table-notes">
        <p>P = Proposer's payoff, R = Responder's payoff</p>
        <ul>
          <li>If the Responder accepts, both players get their share of the {totalAmount} tokens</li>
          <li>If the Responder rejects, both players get nothing (0 tokens)</li>
          <li>The numbers shown for Accept are based on the average offer in each range</li>
        </ul>
      </div>
    </div>
  );
};

export default PayoffTable;
