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
    const operaCount = recentChoices.filter(round => round.player === 'OPERA').length;
    const movieCount = recentChoices.filter(round => round.player === 'MOVIE').length;

    // If player shows preference, choose same (coordination game)
    return operaCount > movieCount ? 'OPERA' : 'MOVIE';
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
    // In mixed strategy Nash equilibrium, bot should choose Opera with probability 1/4
    return Math.random() < 0.25 ? 'OPERA' : 'MOVIE';
  }
};

const preferenceStrategy = {
  name: 'Movie Preference',
  description: 'Strongly prefers going to the movie',
  makeChoice: (history) => {
    // 80% chance to choose movie (bot's preference)
    return Math.random() < 0.8 ? 'MOVIE' : 'OPERA';
  }
};

const friendlyStrategy = {
  name: 'Friendly',
  description: 'A simple beginner-friendly strategy',
  makeChoice: (playerChoice) => {
    return "MOVIE";
  }
};

const strategies = [
  randomStrategy,
  patternLearningStrategy,
  copycatStrategy,
  nashEquilibriumStrategy,
  preferenceStrategy,
  friendlyStrategy
];

export const getAllStrategies = () => strategies;
export const getDefaultStrategy = () => randomStrategy;
