export const calculateResult = (playerContribution, botContribution) => {
  // Total pool of contributions
  const totalPool = playerContribution + botContribution;
  
  // Multiply the pool by 1.5 (public good multiplier)
  const multipliedPool = totalPool * 1.5;
  
  // Split the multiplied pool equally between players
  const sharePerPlayer = multipliedPool / 2;
  
  return {
    player: sharePerPlayer,
    opponent: sharePerPlayer
  };
};
