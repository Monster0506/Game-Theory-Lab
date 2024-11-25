const choices = ['ROCK', 'PAPER', 'SCISSORS'];

const randomStrategy = {
  name: 'Random',
  description: 'Randomly chooses between rock, paper, and scissors',
  makeChoice: () => choices[Math.floor(Math.random() * choices.length)]
};

const rockStrategy = {
  name: 'Rock',
  description: 'Always chooses rock',
  makeChoice: () => 'ROCK'
};

const paperStrategy = {
  name: 'Paper',
  description: 'Always chooses paper',
  makeChoice: () => 'PAPER'
};

const scissorsStrategy = {
  name: 'Scissors',
  description: 'Always chooses scissors',
  makeChoice: () => 'SCISSORS'
};

const friendlyStrategy = {
  name: 'Friendly',
  description: 'A simple beginner-friendly strategy',
  makeChoice: (playerChoice) => {
    // Convert player choice to uppercase for consistency
    const choice = playerChoice.toUpperCase();
    const winningMoves = {
      'ROCK': 'PAPER',
      'PAPER': 'SCISSORS',
      'SCISSORS': 'ROCK'
    };
    return winningMoves[choice] || choices[Math.floor(Math.random() * choices.length)];
  }
};

const rockBiased = {
  name: 'Rock Biased',
  description: 'Prefers rock (50% rock, 25% paper, 25% scissors)',
  makeChoice: () => {
    const rand = Math.random();
    if (rand < 0.5) return 'ROCK';
    if (rand < 0.75) return 'PAPER';
    return 'SCISSORS';
  }
};

const patternLearning = {
  name: 'Pattern Learning',
  description: 'Tries to predict your next move based on your history',
  makeChoice: (gameHistory) => {
    if (gameHistory.length < 3) return choices[Math.floor(Math.random() * choices.length)];
    
    // Count frequency of player's moves after their previous move
    const patterns = {};
    for (let i = 1; i < gameHistory.length; i++) {
      const prevMove = gameHistory[i-1].player.toUpperCase();
      const currentMove = gameHistory[i].player.toUpperCase();
      if (!patterns[prevMove]) patterns[prevMove] = {};
      if (!patterns[prevMove][currentMove]) patterns[prevMove][currentMove] = 0;
      patterns[prevMove][currentMove]++;
    }

    // Predict next move based on player's last move
    const lastMove = gameHistory[gameHistory.length - 1].player.toUpperCase();
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
      if (mostLikelyMove === 'ROCK') return 'PAPER';
      if (mostLikelyMove === 'PAPER') return 'SCISSORS';
      return 'ROCK';
    }
    
    return choices[Math.floor(Math.random() * choices.length)];
  }
};

const copycat = {
  name: 'Copycat',
  description: 'Copies your previous move',
  makeChoice: (gameHistory) => {
    if (gameHistory.length === 0) return choices[Math.floor(Math.random() * choices.length)];
    return gameHistory[gameHistory.length - 1].player.toUpperCase();
  }
};

const counter = {
  name: 'Counter',
  description: 'Plays the move that would have beaten your last move',
  makeChoice: (gameHistory) => {
    if (gameHistory.length === 0) return choices[Math.floor(Math.random() * choices.length)];
    const lastMove = gameHistory[gameHistory.length - 1].player.toUpperCase();
    if (lastMove === 'ROCK') return 'PAPER';
    if (lastMove === 'PAPER') return 'SCISSORS';
    return 'ROCK';
  }
};

export const strategies = {
  random: randomStrategy,
  rock: rockStrategy,
  paper: paperStrategy,
  scissors: scissorsStrategy,
  friendly: friendlyStrategy,
  rockBiased: rockBiased,
  patternLearning: patternLearning,
  copycat: copycat,
  counter: counter
};

export const getDefaultStrategy = () => strategies.random;

export const getAllStrategies = () => Object.values(strategies).map(strategy => ({
  name: strategy.name,
  description: strategy.description,
  makeChoice: strategy.makeChoice
}));
