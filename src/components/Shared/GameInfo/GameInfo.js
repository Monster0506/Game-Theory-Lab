import React from 'react';
import './GameInfo.css';

const GameInfo = ({ 
  title,
  description,
  rules = [],
  className = ''
}) => {
  return (
    <div className={`game-info ${className}`}>
      <h1>{title}</h1>
      <p className="description">{description}</p>
      {rules.length > 0 && (
        <div className="rules">
          <h3>Rules</h3>
          <ul>
            {rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GameInfo;
