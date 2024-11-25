export const playerChoices = ['HAWK', 'DOVE'];
export const botChoices = ['HAWK', 'DOVE'];

// Payoff values
const V = 50; // Resource value
const C = 100; // Cost of conflict

export const calculateResult = (playerChoice, botChoice) => {
  // Hawk vs Hawk: Both pay cost of conflict and split resource
  if (playerChoice === 'HAWK' && botChoice === 'HAWK') {
    return {
      player: (V/2) - C,
      opponent: (V/2) - C,
      message: "Both chose aggressive strategies! High cost of conflict."
    };
  }
  
  // Hawk vs Dove: Hawk takes all, Dove retreats
  if (playerChoice === 'HAWK' && botChoice === 'DOVE') {
    return {
      player: V,
      opponent: 0,
      message: "You were aggressive and took all resources!"
    };
  }
  
  // Dove vs Hawk: Hawk takes all, Dove retreats
  if (playerChoice === 'DOVE' && botChoice === 'HAWK') {
    return {
      player: 0,
      opponent: V,
      message: "You retreated while opponent took all resources."
    };
  }
  
  // Dove vs Dove: Share resource peacefully
  return {
    player: V/2,
    opponent: V/2,
    message: "Both chose peaceful strategies and shared resources."
  };
};

export const findEquilibrium = (history) => {
  if (history.length < 10) return null;

  const playerHawk = history.filter(round => round.player === 'HAWK').length;
  const botHawk = history.filter(round => round.bot === 'HAWK').length;
  
  const playerHawkRatio = playerHawk / history.length;
  const botHawkRatio = botHawk / history.length;

  // In mixed strategy Nash equilibrium:
  // Players choose Hawk with probability V/C
  const equilibriumRatio = V/C;
  const tolerance = 0.1;

  const isNearEquilibrium = 
    Math.abs(playerHawkRatio - equilibriumRatio) < tolerance && 
    Math.abs(botHawkRatio - equilibriumRatio) < tolerance;

  return isNearEquilibrium
    ? "Players are approaching the mixed strategy Nash equilibrium!"
    : null;
};
