const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const calculateAverageReturn = (history) => {
  if (history.length === 0) return 0.5;
  
  const totalRatio = history.reduce((sum, round) => {
    if (round.investment === 0) return sum;
    return sum + (round.returned / round.multipliedAmount);
  }, 0);
  
  return totalRatio / history.length || 0.5;
};

const calculateAverageInvestment = (history, initialEndowment) => {
  if (history.length === 0) return 0.5;
  
  const totalRatio = history.reduce((sum, round) => {
    return sum + (round.investment / initialEndowment);
  }, 0);
  
  return totalRatio / history.length || 0.5;
};

const calculateReturnRate = (history) => {
  if (history.length === 0) return 1;
  
  let positiveReturns = 0;
  history.forEach(round => {
    if (round.returned >= round.investment) positiveReturns++;
  });
  
  return positiveReturns / history.length;
};

const strategies = {
  random: (history, context) => {
    const { role, initialEndowment, multipliedAmount } = context;
    if (role === 'investor') {
      return getRandomInt(0, initialEndowment).toString();
    } else {
      return getRandomInt(0, multipliedAmount).toString();
    }
  },

  fair: (history, context) => {
    const { role, initialEndowment, multipliedAmount, investment } = context;
    if (role === 'investor') {
      // Invest about half the endowment
      return Math.floor(initialEndowment * 0.5).toString();
    } else {
      // Return investment plus half of gains
      const gains = multipliedAmount - investment;
      return Math.floor(investment + gains / 2).toString();
    }
  },

  greedy: (history, context) => {
    const { role, initialEndowment, multipliedAmount } = context;
    if (role === 'investor') {
      // Start with minimal investment to test trustee
      const minInvestment = Math.floor(initialEndowment * 0.2);
      if (history.length > 0) {
        const lastRound = history[history.length - 1];
        // If last return was good, slightly increase investment
        if (lastRound.returned > lastRound.investment) {
          return Math.min(
            lastRound.investment + Math.floor(initialEndowment * 0.1),
            initialEndowment
          ).toString();
        }
      }
      return minInvestment.toString();
    } else {
      // Return minimal amount as trustee
      return Math.floor(multipliedAmount * 0.1).toString();
    }
  },

  proportional: (history, context) => {
    const { role, initialEndowment, multipliedAmount } = context;
    if (role === 'investor') {
      // Calculate return rate from history
      const returnRate = calculateReturnRate(history);
      // Invest proportionally to historical return rate
      const investmentRatio = Math.min(returnRate * 1.2, 1); // Can go up to 100% if good history
      return Math.floor(initialEndowment * investmentRatio).toString();
    } else {
      // Return based on average investments from history
      const ratio = calculateAverageInvestment(history, initialEndowment);
      return Math.floor(multipliedAmount * ratio).toString();
    }
  },

  'tit-for-tat': (history, context) => {
    const { role, initialEndowment, multipliedAmount, investment } = context;
    
    if (history.length === 0) {
      return strategies.fair(history, context);
    }

    const lastRound = history[history.length - 1];
    
    if (role === 'investor') {
      // Start with medium investment
      if (history.length === 0) {
        return Math.floor(initialEndowment * 0.5).toString();
      }
      
      // Calculate profit ratio from last round
      const lastProfitRatio = (lastRound.returned - lastRound.investment) / 
                            (lastRound.multipliedAmount - lastRound.investment);
      
      // Adjust investment based on profit ratio
      let newInvestment;
      if (lastProfitRatio <= 0) {
        // Lost money, reduce investment significantly
        newInvestment = Math.floor(lastRound.investment * 0.5);
      } else if (lastProfitRatio < 0.3) {
        // Poor return, reduce investment
        newInvestment = Math.floor(lastRound.investment * 0.8);
      } else if (lastProfitRatio > 0.7) {
        // Great return, increase investment
        newInvestment = Math.min(
          Math.floor(lastRound.investment * 1.5),
          initialEndowment
        );
      } else {
        // Moderate return, maintain similar investment
        newInvestment = lastRound.investment;
      }
      
      return Math.max(1, newInvestment).toString();
    } else {
      // Base return on how much was invested relative to endowment
      const lastInvestRatio = lastRound.investment / initialEndowment;
      return Math.floor(multipliedAmount * lastInvestRatio).toString();
    }
  },

  'risk-seeking': (history, context) => {
    const { role, initialEndowment, multipliedAmount, investment } = context;
    if (role === 'investor') {
      // Always invest high amount
      const minInvestment = Math.floor(initialEndowment * 0.7);
      if (history.length > 0) {
        const lastRound = history[history.length - 1];
        // If got any return, go all in
        if (lastRound.returned > 0) {
          return initialEndowment.toString();
        }
      }
      return minInvestment.toString();
    } else {
      // High variance in returns
      const randomRatio = Math.random();
      if (randomRatio > 0.7) {
        // Sometimes return everything
        return multipliedAmount.toString();
      } else {
        // Otherwise return minimum
        return Math.floor(multipliedAmount * 0.1).toString();
      }
    }
  },

  'risk-averse': (history, context) => {
    const { role, initialEndowment, multipliedAmount, investment } = context;
    if (role === 'investor') {
      // Start with very small investment
      if (history.length === 0) {
        return Math.floor(initialEndowment * 0.2).toString();
      }
      
      // Calculate consistency of returns
      let consistentReturns = true;
      let minReturnRatio = 1;
      
      history.forEach(round => {
        const returnRatio = round.returned / round.multipliedAmount;
        minReturnRatio = Math.min(minReturnRatio, returnRatio);
        if (round.returned < round.investment) {
          consistentReturns = false;
        }
      });
      
      // Only increase investment if consistently getting good returns
      if (consistentReturns && minReturnRatio > 0.3) {
        const lastRound = history[history.length - 1];
        return Math.min(
          Math.floor(lastRound.investment * 1.2),
          Math.floor(initialEndowment * 0.5) // Never invest more than 50%
        ).toString();
      } else {
        // Reduce investment if any loss
        const lastRound = history[history.length - 1];
        return Math.max(
          1,
          Math.floor(lastRound.investment * 0.8)
        ).toString();
      }
    } else {
      // Always return slightly more than investment
      return Math.min(
        Math.floor(investment * 1.2),
        multipliedAmount
      ).toString();
    }
  }, 
  friendly: {
    name: 'Friendly',
    description: 'A simple beginner-friendly strategy',
    makeChoice: (playerChoice) => {
      // Always return 0 to maximize payoff
      return '0';
    }
  }
};

export const getBotChoice = (strategy, playerChoice) => {
  const strategyFn = strategies[strategy] || strategies.random;
  return strategyFn.makeChoice(playerChoice);
};
