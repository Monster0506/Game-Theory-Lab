export const strategies = {
  random: {
    name: 'Random',
    description: 'Returns a random amount between 0 and received amount',
    makeChoice: (receivedAmount) => Math.floor(Math.random() * (receivedAmount + 1))
  },

  trustworthy: {
    name: 'Trustworthy',
    description: 'Always returns more than received',
    makeChoice: (receivedAmount) => Math.floor(receivedAmount * 1.5)
  },

  untrustworthy: {
    name: 'Untrustworthy',
    description: 'Always returns nothing',
    makeChoice: () => 0
  },

  friendly: {
    name: 'Friendly',
    description: 'A simple beginner-friendly strategy',
    makeChoice: (receivedAmount) => {
      // In Trust Game, optimal strategy is to return 0 regardless of amount received
      return 0;
    }
  }
};

export const getDefaultStrategy = () => strategies.random;
export const getAllStrategies = () => Object.values(strategies);
