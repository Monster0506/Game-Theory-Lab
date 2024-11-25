export const calculateResult = (playerChoice, botChoice) => {
  const payoffMatrix = {
    STAG: {
      STAG: { player: 4, opponent: 4 }, // Both hunt stag successfully
      HARE: { player: 0, opponent: 2 }  // Player hunts stag alone, bot gets hare
    },
    HARE: {
      STAG: { player: 2, opponent: 0 }, // Player gets hare, bot hunts stag alone
      HARE: { player: 2, opponent: 2 }  // Both get hares
    }
  };

  return payoffMatrix[playerChoice][botChoice];
};
