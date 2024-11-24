export const playerChoices = ['HEADS', 'TAILS'];
export const botChoices = ['HEADS', 'TAILS'];

export const calculateResult = (playerChoice, botChoice) => {
  const isMatch = playerChoice === botChoice;
  
  return {
    player: isMatch ? 1 : 0,
    opponent: isMatch ? 0 : 1,
    message: isMatch 
      ? "Match! You win a point!" 
      : "Mismatch! Opponent wins a point!"
  };
};

export const findEquilibrium = (history) => {
  if (history.length < 10) return null;

  const playerHeads = history.filter(round => round.player === 'HEADS').length;
  const playerTails = history.filter(round => round.player === 'TAILS').length;
  const botHeads = history.filter(round => round.bot === 'HEADS').length;
  const botTails = history.filter(round => round.bot === 'TAILS').length;

  const playerHeadsRatio = playerHeads / history.length;
  const botHeadsRatio = botHeads / history.length;

  const isNearEquilibrium = 
    Math.abs(playerHeadsRatio - 0.5) < 0.1 && 
    Math.abs(botHeadsRatio - 0.5) < 0.1;

  return isNearEquilibrium
    ? "Both players are close to the optimal mixed strategy (50-50)!"
    : null;
};
