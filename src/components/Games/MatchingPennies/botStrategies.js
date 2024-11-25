// Bot strategies for Matching Pennies game
export const strategies = {
  random: {
    name: 'Random',
    description: 'Randomly chooses heads or tails',
    makeChoice: (gameHistory, currentPlayerMove) => Math.random() < 0.5 ? 'HEADS' : 'TAILS'
  },
  PatternLearning: {
    name: 'Pattern Learning',
    description: 'Analyzes player patterns and tries to predict next move',
    makeChoice: (gameHistory, currentPlayerMove) => {
      if (!gameHistory || gameHistory.length < 3) {
        return Math.random() < 0.5 ? 'HEADS' : 'TAILS';
      }

      // Count frequency of player's choices after each bot choice
      const patterns = {};
      for (let i = 0; i < gameHistory.length - 1; i++) {
        const key = gameHistory[i].bot;
        const nextChoice = gameHistory[i + 1].player;
        if (!patterns[key]) {
          patterns[key] = { HEADS: 0, TAILS: 0 };
        }
        patterns[key][nextChoice]++;
      }

      // Predict based on last bot choice
      const lastBotChoice = gameHistory[gameHistory.length - 1].bot;
      if (patterns[lastBotChoice]) {
        const headsFreq = patterns[lastBotChoice].HEADS;
        const tailsFreq = patterns[lastBotChoice].TAILS;
        // Choose opposite of player's most frequent response
        return headsFreq > tailsFreq ? 'TAILS' : 'HEADS';
      }

      return Math.random() < 0.5 ? 'HEADS' : 'TAILS';
    }
  },
  Copycat: {
    name: 'Copycat',
    description: 'Copies the player\'s last move',
    makeChoice: (gameHistory, currentPlayerMove) => {
      if (!gameHistory || gameHistory.length === 0) {
        return Math.random() < 0.5 ? 'HEADS' : 'TAILS';
      }
      return gameHistory[gameHistory.length - 1].player;
    }
  },
  Counter: {
    name: 'Counter',
    description: 'Plays the opposite of player\'s last move',
    makeChoice: (gameHistory, currentPlayerMove) => {
      if (!gameHistory || gameHistory.length === 0) {
        return Math.random() < 0.5 ? 'HEADS' : 'TAILS';
      }
      const lastPlayerChoice = gameHistory[gameHistory.length - 1].player;
      return lastPlayerChoice === 'HEADS' ? 'TAILS' : 'HEADS';
    }
  },
  heads: {
    name: 'Always Heads',
    description: 'Always chooses heads',
    makeChoice: (gameHistory, currentPlayerMove) => 'HEADS'
  },
  tails: {
    name: 'Always Tails',
    description: 'Always chooses tails',
    makeChoice: (gameHistory, currentPlayerMove) => 'TAILS'
  },
  friendly: {
    name: 'Friendly',
    description: 'A simple beginner-friendly strategy',
    makeChoice: (gameHistory, currentPlayerMove) => {
      // Always choose opposite of current player move to maximize bot's payoff
      return currentPlayerMove === 'HEADS' ? 'TAILS' : 'HEADS';
    }
  }
};

export const getBotChoice = (strategy, gameHistory, currentPlayerMove) => {
  const strategyFn = strategies[strategy] || strategies.random;
  return strategyFn.makeChoice(gameHistory, currentPlayerMove);
};

export const getDefaultStrategy = () => strategies.random;
export const getAllStrategies = () => Object.values(strategies);
