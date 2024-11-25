const getRandomChoice = () => {
  return Math.random() < 0.5 ? 'enter' : 'stay';
};

const getCautiousChoice = (gameHistory) => {
  // Only enters if the market wasn't overcrowded in the last 2 rounds
  const recentRounds = gameHistory.slice(-2);
  const wasOvercrowded = recentRounds.some(round => round?.totalEntrants > 3);
  return wasOvercrowded ? 'stay' : 'enter';
};

const getAggressiveChoice = (gameHistory) => {
  // Always enters unless lost money in last 3 rounds
  const recentRounds = gameHistory.slice(-3);
  const recentLosses = recentRounds.filter(round => 
    round?.botChoice === 'enter' && round?.botPayoff < 0
  ).length;
  return recentLosses >= 2 ? 'stay' : 'enter';
};

const getAdaptiveChoice = (gameHistory) => {
  if (gameHistory.length < 3) return getRandomChoice();
  
  // Looks at the last 3 rounds to determine if entry was profitable
  const recentRounds = gameHistory.slice(-3);
  const avgProfit = recentRounds.reduce((sum, round) => {
    if (round?.botChoice === 'enter') {
      return sum + round.botPayoff;
    }
    return sum + 0;
  }, 0) / recentRounds.length;
  
  return avgProfit > 5 ? 'enter' : 'stay';
};

const getCyclicChoice = (gameHistory) => {
  // Cycles between enter and stay every 2 rounds
  return gameHistory.length % 2 === 0 ? 'enter' : 'stay';
};

const getFriendlyChoice = (playerChoice) => {
  // In Market Entry, if player stays out, enter for max profit
  // If player enters, stay out to avoid competition losses
  return playerChoice === 'stay' ? 'enter' : 'stay';
};

export const getBotChoice = (strategy, gameHistory, playerChoice) => {
  switch (strategy) {
    case 'cautious':
      return getCautiousChoice(gameHistory);
    case 'aggressive':
      return getAggressiveChoice(gameHistory);
    case 'adaptive':
      return getAdaptiveChoice(gameHistory);
    case 'cyclic':
      return getCyclicChoice(gameHistory);
    case 'friendly':
      return getFriendlyChoice(playerChoice);
    case 'random':
    default:
      return getRandomChoice();
  }
};
