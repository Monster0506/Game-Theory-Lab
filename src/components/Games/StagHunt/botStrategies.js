const strategies = {
  cooperator: {
    name: 'Cooperator',
    description: 'Always hunts stag, hoping for mutual cooperation',
    makeChoice: (history) => 'STAG'
  },
  defector: {
    name: 'Defector',
    description: 'Always hunts hare, preferring the safe option',
    makeChoice: (history) => 'HARE'
  },
  titForTat: {
    name: 'Tit for Tat',
    description: 'Starts with stag, then copies partner\'s last move',
    makeChoice: (history) => {
      if (history.length === 0) return 'STAG';
      return history[history.length - 1].player;
    }
  },
  random: {
    name: 'Random',
    description: 'Randomly chooses between stag and hare',
    makeChoice: (history) => {
      return Math.random() < 0.5 ? 'STAG' : 'HARE';
    }
  },
  pavlov: {
    name: 'Pavlov',
    description: 'Stays with stag if both chose same, switches if different',
    makeChoice: (history) => {
      if (history.length === 0) return 'STAG';
      const lastRound = history[history.length - 1];
      return lastRound.player === lastRound.bot ? lastRound.player : 
        (lastRound.player === 'STAG' ? 'HARE' : 'STAG');
    }
  },
  friendly: {
    name: 'Friendly',
    description: 'A simple beginner-friendly strategy',
    makeChoice: (playerChoice) => {
      // If player hunts stag, hunt hare for guaranteed points
      // If player hunts hare, hunt hare for guaranteed points
      return 'HARE';
    }
  }
};

export const getAllStrategies = () => Object.values(strategies);

export const getDefaultStrategy = () => strategies.random;
