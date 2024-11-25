const strategies = {
  cooperator: {
    name: 'Full Cooperator',
    description: 'Always contributes maximum amount',
    makeChoice: (history, currentTokens) => Math.min(20, currentTokens)
  },
  defector: {
    name: 'Free Rider',
    description: 'Never contributes anything',
    makeChoice: () => 0
  },
  reciprocator: {
    name: 'Reciprocator',
    description: 'Matches your last contribution',
    makeChoice: (history, currentTokens) => {
      if (history.length === 0) return Math.min(10, currentTokens); // Start with middle contribution
      const lastRound = history[history.length - 1];
      return Math.min(lastRound.player, currentTokens);
    }
  },
  random: {
    name: 'Random',
    description: 'Randomly contributes between 0 and max available',
    makeChoice: (history, currentTokens) => {
      const maxContribution = Math.min(20, currentTokens);
      return Math.floor(Math.random() * (maxContribution + 1));
    }
  },
  gradual: {
    name: 'Gradual',
    description: 'Starts low and gradually increases contribution if you cooperate',
    makeChoice: (history, currentTokens) => {
      if (history.length === 0) return Math.min(5, currentTokens);
      
      const lastRound = history[history.length - 1];
      const playerWasCooperative = lastRound.player >= 10;
      
      if (playerWasCooperative) {
        const lastContribution = history[history.length - 1].bot;
        return Math.min(lastContribution + 5, currentTokens, 20);
      } else {
        return Math.max(0, Math.min(history[history.length - 1].bot - 5, currentTokens));
      }
    }
  },
  averageMatching: {
    name: 'Average Matcher',
    description: 'Matches the average of your last 3 contributions',
    makeChoice: (history, currentTokens) => {
      if (history.length === 0) return Math.min(10, currentTokens);
      
      const lastThreeRounds = history.slice(-3);
      const averageContribution = lastThreeRounds.reduce((sum, round) => 
        sum + round.player, 0) / lastThreeRounds.length;
      
      return Math.min(Math.round(averageContribution), currentTokens);
    }
  },
  conditionalCooperator: {
    name: 'Conditional Cooperator',
    description: 'Cooperates more when group benefit is high, less when it\'s low',
    makeChoice: (history, currentTokens) => {
      if (history.length === 0) return Math.min(15, currentTokens);
      
      const lastRound = history[history.length - 1];
      const efficiency = lastRound.multipliedPool / (lastRound.player + lastRound.bot);
      
      if (efficiency >= 1.4) { // High efficiency
        return Math.min(20, currentTokens);
      } else if (efficiency >= 1.2) { // Medium efficiency
        return Math.min(10, currentTokens);
      } else { // Low efficiency
        return Math.min(5, currentTokens);
      }
    }
  },
  trendFollower: {
    name: 'Trend Follower',
    description: 'Adjusts contribution based on the trend of your contributions',
    makeChoice: (history, currentTokens) => {
      if (history.length < 2) return Math.min(10, currentTokens);
      
      const lastTwo = history.slice(-2);
      const trend = lastTwo[1].player - lastTwo[0].player;
      
      if (trend > 0) { // Increasing trend
        return Math.min(lastTwo[1].bot + 5, currentTokens, 20);
      } else if (trend < 0) { // Decreasing trend
        return Math.max(0, Math.min(lastTwo[1].bot - 5, currentTokens));
      } else { // No change
        return Math.min(lastTwo[1].bot, currentTokens);
      }
    }
  },
  majorityFollower: {
    name: 'Majority Follower',
    description: 'Contributes based on the most common contribution level in history',
    makeChoice: (history, currentTokens) => {
      if (history.length < 3) return Math.min(10, currentTokens);
      
      const contributions = history.map(round => round.player);
      const counts = {};
      let maxCount = 0;
      let mostCommon = 10;
      
      contributions.forEach(amount => {
        counts[amount] = (counts[amount] || 0) + 1;
        if (counts[amount] > maxCount) {
          maxCount = counts[amount];
          mostCommon = amount;
        }
      });
      
      return Math.min(mostCommon, currentTokens);
    }
  },
  adaptiveStrategy: {
    name: 'Adaptive Learner',
    description: 'Learns and adapts based on which contributions yielded the best returns',
    makeChoice: (history, currentTokens) => {
      if (history.length < 3) return Math.min(10, currentTokens);
      
      // Calculate net returns for each contribution level
      const returns = new Map();
      history.forEach(round => {
        const netReturn = round.playerReturn - round.player;
        returns.set(round.player, (returns.get(round.player) || 0) + netReturn);
      });
      
      // Find the contribution level with the best average return
      let bestContribution = 10;
      let bestReturn = -Infinity;
      
      returns.forEach((totalReturn, contribution) => {
        const avgReturn = totalReturn / history.filter(r => r.player === contribution).length;
        if (avgReturn > bestReturn) {
          bestReturn = avgReturn;
          bestContribution = contribution;
        }
      });
      
      return Math.min(bestContribution, currentTokens);
    }
  },
  friendly: {
    name: 'Friendly',
    description: 'A simple beginner-friendly strategy',
    makeChoice: (playerChoice, currentTokens) => {
      // In Public Goods, best strategy is to contribute 0 regardless of player's choice
      return 1;
    }
  }
};

export const getAllStrategies = () => Object.values(strategies);

export const getDefaultStrategy = () => strategies.random;
