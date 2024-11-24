const payoffMatrix = {
  cooperate: {
    cooperate: { player: -1, bot: -1 }, // Both serve 1 year
    betray: { player: -3, bot: 0 }      // Player serves 3 years, bot goes free
  },
  betray: {
    cooperate: { player: 0, bot: -3 },  // Player goes free, bot serves 3 years
    betray: { player: -2, bot: -2 }     // Both serve 2 years
  }
};

export const makeBotChoice = () => {
  // Simple bot strategy: 70% chance to cooperate
  return Math.random() < 0.7 ? 'cooperate' : 'betray';
};

export const calculateResult = (playerChoice, botChoice) => {
  return payoffMatrix[playerChoice][botChoice];
};

export default {
  payoffMatrix,
  makeBotChoice,
  calculateResult
};
