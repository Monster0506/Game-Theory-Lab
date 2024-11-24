import { botChoices } from './GameLogic';

const randomStrategy = {
  id: 'random',
  name: 'Random',
  description: 'Makes completely random choices',
  makeChoice: () => {
    const randomIndex = Math.floor(Math.random() * botChoices.length);
    return botChoices[randomIndex];
  }
};

const fixedStrategy = {
  id: 'fixed',
  name: 'Fixed',
  description: 'Always plays the same strategy',
  makeChoice: () => botChoices[0]
};

const cyclingStrategy = {
  id: 'cycling',
  name: 'Cycling',
  description: 'Cycles through strategies in order',
  makeChoice: (history) => {
    const currentIndex = history.length % botChoices.length;
    return botChoices[currentIndex];
  }
};

const copyLastStrategy = {
  id: 'copyLast',
  name: 'Copy Last',
  description: 'Copies the player\'s last choice mapping',
  makeChoice: (history) => {
    if (history.length === 0) return botChoices[0];
    const lastPlayerChoice = history[history.length - 1].player;
    // Map player choices (A,B,C) to bot choices (X,Y,Z)
    const choiceMap = {
      'A': 'X',
      'B': 'Y',
      'C': 'Z'
    };
    return choiceMap[lastPlayerChoice] || botChoices[0];
  }
};

const strategies = [
  randomStrategy,
  fixedStrategy,
  cyclingStrategy,
  copyLastStrategy
];

export const getDefaultStrategy = () => randomStrategy;
export const getAllStrategies = () => strategies;
