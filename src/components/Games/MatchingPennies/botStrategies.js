// Bot strategies for Matching Pennies game
const strategies = [
  {
    name: 'Random',
    description: 'Makes random choices between Heads and Tails',
    makeChoice: (gameHistory) => {
      return Math.random() < 0.5 ? 'HEADS' : 'TAILS';
    }
  },
  {
    name: 'Pattern Learning',
    description: 'Analyzes player patterns and tries to predict next move',
    makeChoice: (gameHistory) => {
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
  {
    name: 'Copycat',
    description: 'Copies the player\'s last move',
    makeChoice: (gameHistory) => {
      if (!gameHistory || gameHistory.length === 0) {
        return Math.random() < 0.5 ? 'HEADS' : 'TAILS';
      }
      return gameHistory[gameHistory.length - 1].player;
    }
  },
  {
    name: 'Counter',
    description: 'Plays the opposite of player\'s last move',
    makeChoice: (gameHistory) => {
      if (!gameHistory || gameHistory.length === 0) {
        return Math.random() < 0.5 ? 'HEADS' : 'TAILS';
      }
      const lastPlayerChoice = gameHistory[gameHistory.length - 1].player;
      return lastPlayerChoice === 'HEADS' ? 'TAILS' : 'HEADS';
    }
  },
  {
    name: 'Nash Equilibrium',
    description: 'Plays the optimal mixed strategy (50-50)',
    makeChoice: (gameHistory) => {
      return Math.random() < 0.5 ? 'HEADS' : 'TAILS';
    }
  }
];

export const getDefaultStrategy = () => strategies[0];
export const getAllStrategies = () => strategies;
