export const calculateResult = (playerChoice, botChoice) => {
  playerChoice = playerChoice.toLowerCase();
  botChoice = botChoice.toLowerCase();

  if (playerChoice === botChoice) {
    return {
      player: 0,
      opponent: 0,
      message: "It's a draw!"
    };
  }

  const winningCombos = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };

  if (winningCombos[playerChoice] === botChoice) {
    return {
      player: 1,
      opponent: 0,
      message: `You win! ${playerChoice} beats ${botChoice}`
    };
  } else {
    return {
      player: 0,
      opponent: 1,
      message: `Bot wins! ${botChoice} beats ${playerChoice}`
    };
  }
};

export const getResultMessage = (result, choices) => {
  return result.message;
};

export default {
  calculateResult,
  getResultMessage
};
