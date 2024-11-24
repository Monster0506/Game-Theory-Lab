export const playerChoices = ['OPERA', 'MOVIE'];
export const botChoices = ['OPERA', 'MOVIE'];

export const calculateResult = (playerChoice, botChoice) => {
  // Both choose Opera: Player gets 3, Bot gets 1
  if (playerChoice === 'OPERA' && botChoice === 'OPERA') {
    return {
      player: 3,
      opponent: 1,
      message: "Both went to the opera! You're very happy, partner less so."
    };
  }
  
  // Both choose Movie: Player gets 1, Bot gets 3
  if (playerChoice === 'MOVIE' && botChoice === 'MOVIE') {
    return {
      player: 1,
      opponent: 3,
      message: "Both went to the movie! Partner is very happy, you less so."
    };
  }
  
  // Different choices: No points for either
  return {
    player: 0,
    opponent: 0,
    message: "You went to different places. No one is happy."
  };
};

export const findEquilibrium = (history) => {
  if (history.length < 10) return null;

  const playerOpera = history.filter(round => round.player === 'OPERA').length;
  const playerMovie = history.filter(round => round.player === 'MOVIE').length;
  const botOpera = history.filter(round => round.bot === 'OPERA').length;
  const botMovie = history.filter(round => round.bot === 'MOVIE').length;

  const playerOperaRatio = playerOpera / history.length;
  const botOperaRatio = botOpera / history.length;

  // In mixed strategy Nash equilibrium:
  // Player chooses Opera with probability 3/4
  // Bot chooses Opera with probability 1/4
  const isNearEquilibrium = 
    Math.abs(playerOperaRatio - 0.75) < 0.1 && 
    Math.abs(botOperaRatio - 0.25) < 0.1;

  return isNearEquilibrium
    ? "Players are close to the mixed strategy Nash equilibrium!"
    : null;
};
