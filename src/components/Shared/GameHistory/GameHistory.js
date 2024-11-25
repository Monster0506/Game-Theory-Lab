import React from 'react';
import './GameHistory.css';

const GameHistory = ({ 
  history,
  roundLabel = 'Round',
  renderRoundContent,
  title = 'Game History'
}) => {
  if (!history || history.length === 0) {
    return (
      <div className="game-history">
        <h3>{title}</h3>
        <div className="history-list">
          <div className="no-history">No moves yet</div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-history">
      <h3>{title}</h3>
      <div className="history-list">
        {history.map((round, index) => (
          <div key={round.round || history.length - index} className="history-item">
            <div className="round-number">
              {roundLabel} {round.round || history.length - index}
            </div>
            {renderRoundContent ? (
              renderRoundContent(round)
            ) : (
              <div className="round-content">
                {Object.entries(round)
                  .filter(([key]) => !['round'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="history-entry">
                      <span className="entry-label">{key}:</span>
                      <span className="entry-value">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory;
