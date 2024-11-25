import { playerChoices } from './GameLogic';

const getRandomChoice = () => {
  const randomIndex = Math.floor(Math.random() * playerChoices.length);
  return playerChoices[randomIndex];
};

const randomStrategy = {
  name: 'Random',
  description: 'Makes completely random choices',
  makeChoice: () => getRandomChoice()
};

const patternLearningStrategy = {
  name: 'Pattern Learning',
  description: 'Tries to learn and exploit patterns in player behavior',
  makeChoice: (history) => {
    if (history.length < 3) return getRandomChoice();

    // Count player's choices in last few rounds
    const recentChoices = history.slice(-3);
    const hawkCount = recentChoices.filter(round => round.player === 'HAWK').length;
    
    // If player shows aggressive tendency, play Dove more often
    return hawkCount >= 2 ? 'DOVE' : 'HAWK';
  }
};

const copycatStrategy = {
  name: 'Copycat',
  description: 'Copies the player\'s last move',
  makeChoice: (history) => {
    if (history.length === 0) return getRandomChoice();
    return history[history.length - 1].player;
  }
};

const nashEquilibriumStrategy = {
  name: 'Nash Equilibrium',
  description: 'Plays the mixed strategy Nash equilibrium',
  makeChoice: () => {
    // In mixed strategy Nash equilibrium, probability of Hawk is V/C
    // Using the values from GameLogic (V=50, C=100)
    return Math.random() < 0.5 ? 'HAWK' : 'DOVE';
  }
};

const adaptiveStrategy = {
  name: 'Adaptive',
  description: 'Adapts strategy based on opponent\'s aggression level',
  makeChoice: (history) => {
    if (history.length < 5) return getRandomChoice();
    
    const recentHistory = history.slice(-5);
    const hawkCount = recentHistory.filter(round => round.player === 'HAWK').length;
    const hawkRatio = hawkCount / recentHistory.length;
    
    // If opponent is very aggressive, be more peaceful
    return hawkRatio > 0.6 ? 'DOVE' : 'HAWK';
  }
};

const strategies = {
  random: {
    name: 'Random',
    description: 'Randomly chooses between hawk and dove',
    makeChoice: () => Math.random() < 0.5 ? 'HAWK' : 'DOVE'
  },

  hawk: {
    name: 'Always Hawk',
    description: 'Always plays aggressively',
    makeChoice: () => 'HAWK'
  },

  dove: {
    name: 'Always Dove',
    description: 'Always plays passively',
    makeChoice: () => 'DOVE'
  },

  friendly: {
    name: 'Friendly',
    description: 'A simple beginner-friendly strategy',
    makeChoice: (playerChoice) => {
      // In Hawk-Dove, if player plays DOVE, play HAWK to get the resource
      // If player plays HAWK, play DOVE to avoid costly fight
      return playerChoice === 'DOVE' ? 'HAWK' : 'DOVE';
    }
  }
};

export const getDefaultStrategy = () => strategies.random;
export const getAllStrategies = () => Object.values(strategies);
