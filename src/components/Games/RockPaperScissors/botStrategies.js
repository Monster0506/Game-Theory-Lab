const choices = ['rock', 'paper', 'scissors'];

export const strategies = {
  random: {
    name: 'Random',
    description: 'Randomly chooses between rock, paper, and scissors',
    makeChoice: () => choices[Math.floor(Math.random() * choices.length)]
  },
  
  rockBiased: {
    name: 'Rock Biased',
    description: 'Prefers rock (50% rock, 25% paper, 25% scissors)',
    makeChoice: () => {
      const rand = Math.random();
      if (rand < 0.5) return 'rock';
      if (rand < 0.75) return 'paper';
      return 'scissors';
    }
  },

  patternLearning: {
    name: 'Pattern Learning',
    description: 'Tries to predict your next move based on your history',
    makeChoice: (gameHistory) => {
      if (gameHistory.length < 3) return choices[Math.floor(Math.random() * choices.length)];
      
      // Count frequency of player's moves after their previous move
      const patterns = {};
      for (let i = 1; i < gameHistory.length; i++) {
        const prevMove = gameHistory[i-1].player;
        const currentMove = gameHistory[i].player;
        if (!patterns[prevMove]) patterns[prevMove] = {};
        if (!patterns[prevMove][currentMove]) patterns[prevMove][currentMove] = 0;
        patterns[prevMove][currentMove]++;
      }

      // Predict next move based on player's last move
      const lastMove = gameHistory[gameHistory.length - 1].player;
      if (patterns[lastMove]) {
        // Find most likely next move
        let mostLikelyMove = choices[0];
        let maxCount = 0;
        for (const move in patterns[lastMove]) {
          if (patterns[lastMove][move] > maxCount) {
            maxCount = patterns[lastMove][move];
            mostLikelyMove = move;
          }
        }
        // Return counter to predicted move
        if (mostLikelyMove === 'rock') return 'paper';
        if (mostLikelyMove === 'paper') return 'scissors';
        return 'rock';
      }
      
      return choices[Math.floor(Math.random() * choices.length)];
    }
  },

  copycat: {
    name: 'Copycat',
    description: 'Copies your previous move',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return choices[Math.floor(Math.random() * choices.length)];
      return gameHistory[gameHistory.length - 1].player;
    }
  },

  counter: {
    name: 'Counter',
    description: 'Plays the move that would have beaten your last move',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return choices[Math.floor(Math.random() * choices.length)];
      const lastMove = gameHistory[gameHistory.length - 1].player;
      if (lastMove === 'rock') return 'paper';
      if (lastMove === 'paper') return 'scissors';
      return 'rock';
    }
  }
};

export const getDefaultStrategy = () => strategies.random;

export const getAllStrategies = () => Object.values(strategies);
