// Bot strategies for Prisoner's Dilemma
export const strategies = {
  friendly: {
    name: 'Friendly',
    description: 'Cooperates 70% of the time, regardless of player choices',
    makeChoice: () => Math.random() < 0.7 ? 'cooperate' : 'betray'
  },
  
  titForTat: {
    name: 'Tit for Tat',
    description: 'Starts by cooperating, then copies your previous move',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'cooperate';
      return gameHistory[gameHistory.length - 1].player;
    }
  },

  suspiciousTitForTat: {
    name: 'Suspicious Tit for Tat',
    description: 'Starts with betrayal, then copies your previous move',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'betray';
      return gameHistory[gameHistory.length - 1].player;
    }
  },

  generousTitForTat: {
    name: 'Generous Tit for Tat',
    description: 'Like Tit for Tat, but sometimes forgives betrayal',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'cooperate';
      const lastMove = gameHistory[gameHistory.length - 1].player;
      if (lastMove === 'cooperate') return 'cooperate';
      // 30% chance to forgive betrayal
      return Math.random() < 0.3 ? 'cooperate' : 'betray';
    }
  },

  gradualTitForTat: {
    name: 'Gradual Tit for Tat',
    description: 'Increases punishment with each betrayal, then apologizes',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'cooperate';
      
      // Count recent betrayals
      let betrayalCount = 0;
      let isPunishing = false;
      let punishmentCount = 0;
      
      for (let i = gameHistory.length - 1; i >= 0; i--) {
        const round = gameHistory[i];
        if (round.player === 'betray') betrayalCount++;
        if (round.bot === 'betray') punishmentCount++;
        if (betrayalCount > 0 && punishmentCount < betrayalCount) {
          isPunishing = true;
          break;
        }
        if (round.bot === 'cooperate' && round.bot === 'cooperate') {
          break; // Reset after cooperation
        }
      }

      // If punishing, continue until punishment count matches betrayals
      if (isPunishing && punishmentCount < betrayalCount) {
        return 'betray';
      }
      
      // Apologize with two cooperations after punishment
      const lastTwo = gameHistory.slice(-2);
      if (lastTwo.length === 2 && 
          lastTwo.every(round => round.bot === 'betray')) {
        return 'cooperate';
      }

      return 'cooperate';
    }
  },

  imperfectTitForTat: {
    name: 'Imperfect Tit for Tat',
    description: 'Copies your last move with 90% probability',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'cooperate';
      const lastMove = gameHistory[gameHistory.length - 1].player;
      return Math.random() < 0.9 ? lastMove : (lastMove === 'cooperate' ? 'betray' : 'cooperate');
    }
  },

  titForTwoTats: {
    name: 'Tit for Two Tats',
    description: 'Only betrays if you betray twice in a row',
    makeChoice: (gameHistory) => {
      if (gameHistory.length < 2) return 'cooperate';
      const lastTwo = gameHistory.slice(-2);
      return lastTwo.every(round => round.player === 'betray') ? 'betray' : 'cooperate';
    }
  },

  twoTitsForTat: {
    name: 'Two Tits for Tat',
    description: 'Responds to betrayal with two betrayals',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'cooperate';
      const lastTwo = gameHistory.slice(-2);
      
      // If last move was betrayal, start punishment
      if (gameHistory[gameHistory.length - 1].player === 'betray') {
        return 'betray';
      }
      
      // Continue punishment if we're in first retaliation
      if (lastTwo.length === 2 && 
          lastTwo[0].player === 'betray' && 
          lastTwo[1].bot === 'betray') {
        return 'betray';
      }
      
      return 'cooperate';
    }
  },

  grim: {
    name: 'GRIM',
    description: 'Cooperates until betrayed once, then always betrays',
    makeChoice: (gameHistory) => {
      return gameHistory.some(round => round.player === 'betray') ? 'betray' : 'cooperate';
    }
  },

  pavlov: {
    name: 'Pavlov (Win-Stay, Lose-Shift)',
    description: 'Repeats previous choice if it won, switches if it lost',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'cooperate';
      
      const lastRound = gameHistory[gameHistory.length - 1];
      const lastBotChoice = lastRound.bot;
      const lastBotScore = lastRound.botScore;
      
      if (lastBotScore >= -1) {
        return lastBotChoice; // Stay with winning move
      } else {
        return lastBotChoice === 'cooperate' ? 'betray' : 'cooperate'; // Switch after losing
      }
    }
  },

  nPavlov: {
    name: 'n-Pavlov',
    description: 'Adjusts cooperation probability based on previous payoff',
    makeChoice: (gameHistory) => {
      const n = 4; // Adjustment factor
      if (gameHistory.length === 0) return 'cooperate';
      
      const lastRound = gameHistory[gameHistory.length - 1];
      const lastBotScore = lastRound.botScore;
      
      // Calculate base probability from previous rounds
      let baseProb = gameHistory.filter(round => round.bot === 'cooperate').length / gameHistory.length;
      
      // Adjust probability based on last payoff
      if (lastBotScore === -1) { // Reward (R)
        baseProb = Math.min(baseProb + 1/n, 1);
      } else if (lastBotScore === -2) { // Punishment (P)
        baseProb = Math.max(baseProb - 1/n, 0);
      } else if (lastBotScore === 0) { // Temptation (T)
        baseProb = Math.min(baseProb + 2/n, 1);
      } else if (lastBotScore === -3) { // Sucker (S)
        baseProb = Math.max(baseProb - 2/n, 0);
      }
      
      return Math.random() < baseProb ? 'cooperate' : 'betray';
    }
  }
};

export const getDefaultStrategy = () => strategies.friendly;
