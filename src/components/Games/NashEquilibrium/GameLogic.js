// Payoff matrix for the Nash Equilibrium game
const payoffMatrix = {
  A: {
    X: { player: 3, opponent: 3 },
    Y: { player: 1, opponent: 4 },
    Z: { player: 0, opponent: 1 }
  },
  B: {
    X: { player: 4, opponent: 1 },
    Y: { player: 2, opponent: 2 },
    Z: { player: 1, opponent: 3 }
  },
  C: {
    X: { player: 1, opponent: 0 },
    Y: { player: 3, opponent: 1 },
    Z: { player: 4, opponent: 4 }
  }
};

export const choices = ['A', 'B', 'C'];
export const botChoices = ['X', 'Y', 'Z'];

export const calculateResult = (playerChoice, botChoice) => {
  if (!playerChoice || !botChoice) return null;
  const result = payoffMatrix[playerChoice][botChoice];
  return {
    ...result,
    message: `Player chose ${playerChoice}, Opponent chose ${botChoice}. 
              Player gets ${result.player} points, Opponent gets ${result.opponent} points.`,
    outcome: result.player > result.opponent ? 'win' : result.player < result.opponent ? 'lose' : 'draw'
  };
};

export const findNashEquilibrium = () => {
  const equilibria = [];
  
  choices.forEach(playerChoice => {
    botChoices.forEach(botChoice => {
      const currentPayoff = payoffMatrix[playerChoice][botChoice];
      
      let isEquilibrium = true;
      
      // Check if player can improve by changing strategy
      choices.forEach(alternatePlayer => {
        if (payoffMatrix[alternatePlayer][botChoice].player > currentPayoff.player) {
          isEquilibrium = false;
        }
      });
      
      // Check if opponent can improve by changing strategy
      botChoices.forEach(alternateBot => {
        if (payoffMatrix[playerChoice][alternateBot].opponent > currentPayoff.opponent) {
          isEquilibrium = false;
        }
      });
      
      if (isEquilibrium) {
        equilibria.push({
          playerChoice,
          botChoice,
          payoff: currentPayoff
        });
      }
    });
  });
  
  return equilibria;
};
