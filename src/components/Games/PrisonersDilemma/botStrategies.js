// Bot strategies for Prisoner's Dilemma
export const strategies = {
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

  friendly: {
    name: 'Friendly',
    description: 'A simple beginner-friendly strategy',
    makeChoice: (playerChoice) => {
      // Always betray since it dominates cooperate regardless of player choice
      return 'betray';
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
        if (gameHistory[i].player === 'betray') {
          betrayalCount++;
        }
        if (gameHistory[i].bot === 'betray') {
          isPunishing = true;
          punishmentCount++;
        }
        if (isPunishing && punishmentCount >= betrayalCount) {
          break;
        }
      }

      if (betrayalCount > 0 && punishmentCount < betrayalCount) {
        return 'betray';
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
      return lastTwo.every(move => move.player === 'betray') ? 'betray' : 'cooperate';
    }
  },

  twoTitsForTat: {
    name: 'Two Tits for Tat',
    description: 'Responds to betrayal with two betrayals',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'cooperate';
      
      // Check if we're in the middle of punishing
      let isPunishing = false;
      let punishmentCount = 0;
      
      for (let i = gameHistory.length - 1; i >= 0; i--) {
        if (gameHistory[i].player === 'betray' && punishmentCount < 2) {
          isPunishing = true;
        }
        if (isPunishing) {
          punishmentCount++;
          if (punishmentCount >= 2) break;
        }
      }
      
      return isPunishing && punishmentCount < 2 ? 'betray' : 'cooperate';
    }
  },

  grim: {
    name: 'GRIM',
    description: 'Cooperates until betrayed once, then always betrays',
    makeChoice: (gameHistory) => {
      return gameHistory.some(move => move.player === 'betray') ? 'betray' : 'cooperate';
    }
  },

  pavlov: {
    name: 'Pavlov (Win-Stay, Lose-Shift)',
    description: 'Repeats previous choice if it won, switches if it lost',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'cooperate';
      
      const lastRound = gameHistory[gameHistory.length - 1];
      const lastBotMove = lastRound.bot;
      const lastPlayerMove = lastRound.player;
      
      // Win = both cooperate or bot betrays while player cooperates
      const won = (lastBotMove === 'cooperate' && lastPlayerMove === 'cooperate') ||
                 (lastBotMove === 'betray' && lastPlayerMove === 'cooperate');
                 
      return won ? lastBotMove : (lastBotMove === 'cooperate' ? 'betray' : 'cooperate');
    }
  },

  nPavlov: {
    name: 'n-Pavlov',
    description: 'Adjusts cooperation probability based on previous payoff',
    makeChoice: (gameHistory) => {
      if (gameHistory.length === 0) return 'cooperate';
      
      // Calculate average payoff from last n rounds
      const n = Math.min(5, gameHistory.length);
      const recentGames = gameHistory.slice(-n);
      
      let totalPayoff = 0;
      for (const game of recentGames) {
        if (game.bot === 'cooperate' && game.player === 'cooperate') totalPayoff += 3;
        else if (game.bot === 'betray' && game.player === 'cooperate') totalPayoff += 5;
        else if (game.bot === 'cooperate' && game.player === 'betray') totalPayoff += 0;
        else totalPayoff += 1;
      }
      
      const avgPayoff = totalPayoff / n;
      const baseProb = avgPayoff / 5; // Normalize by max payoff
      
      return Math.random() < baseProb ? 'cooperate' : 'betray';
    }
  }
};

export const getDefaultStrategy = () => strategies.titForTat;

export const getAllStrategies = () => Object.values(strategies);
