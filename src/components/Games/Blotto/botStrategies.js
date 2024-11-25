/**
 * Bot strategies for Colonel Blotto game
 */

const TOTAL_TROOPS = 100;
const NUM_BATTLEFIELDS = 10;

/**
 * Get bot's troop allocation based on strategy
 * @param {string} strategy - Bot's strategy name
 * @param {Array} gameHistory - History of previous rounds
 * @returns {Array} - Array of troop allocations for each battlefield
 */
export const getBotStrategy = (strategy, gameHistory) => {
  switch (strategy) {
    case 'bigCat':
      return bigCatStrategy();
    case 'bigFive':
      return bigFiveStrategy();
    case 'oneUp':
      return oneUpStrategy(gameHistory);
    case 'balanced':
      return balancedStrategy();
    case 'random':
      return randomStrategy();
    case 'adaptive':
      return adaptiveStrategy(gameHistory);
    case 'frontLoader':
      return frontLoaderStrategy();
    case 'backLoader':
      return backLoaderStrategy();
    case 'pyramid':
      return pyramidStrategy();
    case 'alternating':
      return alternatingStrategy();
    case 'blitzkrieg':
      return blitzkriegStrategy();
    case 'counter':
      return counterStrategy(gameHistory);
    case 'psychological':
      return psychologicalStrategy(gameHistory);
    case 'friendly':
      return friendlyStrategy(gameHistory);
    default:
      return balancedStrategy();
  }
};

/**
 * Big Cat Strategy: Heavily focuses on one battlefield
 * Allocates majority of troops to one battlefield, minimal to others
 */
const bigCatStrategy = () => {
  const mainBattlefield = Math.floor(Math.random() * NUM_BATTLEFIELDS);
  const troops = Array(NUM_BATTLEFIELDS).fill(10);
  troops[mainBattlefield] = TOTAL_TROOPS - ((NUM_BATTLEFIELDS - 1) * 10);
  return troops;
};

/**
 * Big Five Strategy: Allocates troops in a 30-20-15-10-10-5-5-2-2-1 split
 * Focuses on first few battlefields with diminishing strength
 */
const bigFiveStrategy = () => {
  const troops = [30, 20, 15, 10, 10, 5, 5, 2, 2, 1];
  // Randomly shuffle the allocation
  for (let i = troops.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [troops[i], troops[j]] = [troops[j], troops[i]];
  }
  return troops;
};

/**
 * One-Up Strategy: Tries to beat the opponent's last move by a small margin
 * If no history, uses balanced strategy
 */
const oneUpStrategy = (gameHistory) => {
  if (!gameHistory || gameHistory.length === 0) {
    return balancedStrategy();
  }

  const lastRound = gameHistory[gameHistory.length - 1];
  const lastOpponentMove = lastRound.playerTroops; // Assuming we store opponent's moves
  
  // Add a small advantage to each battlefield
  const troops = lastOpponentMove.map(t => Math.min(t + 5, TOTAL_TROOPS));
  
  // Adjust to meet total troops constraint
  let total = troops.reduce((a, b) => a + b, 0);
  if (total > TOTAL_TROOPS) {
    // Scale down proportionally
    troops.forEach((t, i) => {
      troops[i] = Math.floor((t / total) * TOTAL_TROOPS);
    });
    // Distribute remaining troops
    let remaining = TOTAL_TROOPS - troops.reduce((a, b) => a + b, 0);
    let i = 0;
    while (remaining > 0) {
      troops[i % NUM_BATTLEFIELDS]++;
      remaining--;
      i++;
    }
  }
  
  return troops;
};

/**
 * Balanced Strategy: Distributes troops evenly with small random variations
 */
const balancedStrategy = () => {
  const baseAllocation = Math.floor(TOTAL_TROOPS / NUM_BATTLEFIELDS);
  const troops = Array(NUM_BATTLEFIELDS).fill(baseAllocation);
  let remaining = TOTAL_TROOPS - (baseAllocation * NUM_BATTLEFIELDS);
  
  // Distribute remaining troops randomly
  while (remaining > 0) {
    const index = Math.floor(Math.random() * NUM_BATTLEFIELDS);
    troops[index]++;
    remaining--;
  }
  
  return troops;
};

/**
 * Random Strategy: Completely random allocation
 */
const randomStrategy = () => {
  const troops = [];
  let remainingTroops = TOTAL_TROOPS;
  
  // Allocate random amounts to all but the last battlefield
  for (let i = 0; i < NUM_BATTLEFIELDS - 1; i++) {
    const max = remainingTroops - (NUM_BATTLEFIELDS - i - 1);
    const allocation = Math.floor(Math.random() * max);
    troops.push(allocation);
    remainingTroops -= allocation;
  }
  
  // Allocate remaining troops to last battlefield
  troops.push(remainingTroops);
  
  return troops;
};

/**
 * Adaptive Strategy: Learns from past rounds
 * Analyzes winning allocations and tries to replicate success
 */
const adaptiveStrategy = (gameHistory) => {
  if (!gameHistory || gameHistory.length < 3) {
    return balancedStrategy();
  }

  // Analyze last 3 rounds
  const recentHistory = gameHistory.slice(-3);
  const winningAllocations = recentHistory.filter(round => round.winner === 'bot')
    .map(round => round.botTroops);

  if (winningAllocations.length === 0) {
    // If no recent wins, try balanced strategy
    return balancedStrategy();
  }

  // Average the winning allocations
  const avgAllocation = winningAllocations.reduce((acc, troops) => {
    return troops.map((t, i) => acc[i] + t);
  }, Array(NUM_BATTLEFIELDS).fill(0))
    .map(t => Math.floor(t / winningAllocations.length));

  // Adjust to meet total troops constraint
  let total = avgAllocation.reduce((a, b) => a + b, 0);
  if (total !== TOTAL_TROOPS) {
    avgAllocation.forEach((t, i) => {
      avgAllocation[i] = Math.floor((t / total) * TOTAL_TROOPS);
    });
    // Distribute remaining troops
    let remaining = TOTAL_TROOPS - avgAllocation.reduce((a, b) => a + b, 0);
    let i = 0;
    while (remaining > 0) {
      avgAllocation[i % NUM_BATTLEFIELDS]++;
      remaining--;
      i++;
    }
  }

  return avgAllocation;
};

/**
 * Front Loader Strategy: Concentrates troops on first battlefields
 */
const frontLoaderStrategy = () => {
  const troops = [];
  let remainingTroops = TOTAL_TROOPS;
  
  for (let i = 0; i < NUM_BATTLEFIELDS; i++) {
    const share = Math.pow(0.5, i); // Exponentially decreasing shares
    const allocation = Math.floor(remainingTroops * share);
    troops.push(allocation);
    remainingTroops -= allocation;
  }
  
  // Add any remaining troops to the last battlefield
  troops[NUM_BATTLEFIELDS - 1] += remainingTroops;
  
  return troops;
};

/**
 * Back Loader Strategy: Concentrates troops on last battlefields
 */
const backLoaderStrategy = () => {
  const troops = frontLoaderStrategy();
  return troops.reverse();
};

/**
 * Pyramid Strategy: Concentrates troops in the middle battlefields
 */
const pyramidStrategy = () => {
  const troops = [5, 8, 12, 15, 20, 20, 15, 12, 8, 5];
  // Add small random variations while maintaining total
  let remaining = TOTAL_TROOPS - troops.reduce((a, b) => a + b, 0);
  while (remaining > 0) {
    const index = Math.floor(Math.random() * NUM_BATTLEFIELDS);
    troops[index]++;
    remaining--;
  }
  return troops;
};

/**
 * Alternating Strategy: Alternates between strong and weak positions
 */
const alternatingStrategy = () => {
  const troops = Array(NUM_BATTLEFIELDS).fill(0);
  let remainingTroops = TOTAL_TROOPS;
  
  // Allocate more troops to even-numbered battlefields
  for (let i = 0; i < NUM_BATTLEFIELDS; i++) {
    troops[i] = i % 2 === 0 ? 15 : 5;
    remainingTroops -= troops[i];
  }
  
  // Distribute remaining troops randomly to even-numbered battlefields
  while (remainingTroops > 0) {
    const index = Math.floor(Math.random() * NUM_BATTLEFIELDS/2) * 2;
    troops[index]++;
    remainingTroops--;
  }
  
  return troops;
};

/**
 * Blitzkrieg Strategy: Heavy focus on first few battlefields
 */
const blitzkriegStrategy = () => {
  const troops = [35, 25, 20, 10, 5, 2, 1, 1, 0.5, 0.5];
  // Round and adjust to ensure total is correct
  const roundedTroops = troops.map(t => Math.floor(t));
  let remaining = TOTAL_TROOPS - roundedTroops.reduce((a, b) => a + b, 0);
  let i = 0;
  while (remaining > 0) {
    roundedTroops[i % 3]++;
    remaining--;
    i++;
  }
  return roundedTroops;
};

/**
 * Counter Strategy: Tries to counter the most common opponent strategies
 */
const counterStrategy = (gameHistory) => {
  if (!gameHistory || gameHistory.length < 2) {
    return balancedStrategy();
  }

  // Analyze opponent's pattern
  const lastMoves = gameHistory.slice(-2).map(round => round.playerTroops);
  const avgTroops = lastMoves[0].map((_, i) => 
    (lastMoves[0][i] + lastMoves[1][i]) / 2
  );

  // Find their strongest positions
  const strongPositions = avgTroops
    .map((troops, i) => ({ troops, index: i }))
    .sort((a, b) => b.troops - a.troops)
    .slice(0, 3)
    .map(pos => pos.index);

  // Counter by placing slightly more troops in their strong positions
  const troops = Array(NUM_BATTLEFIELDS).fill(5);
  let remainingTroops = TOTAL_TROOPS - (5 * NUM_BATTLEFIELDS);

  strongPositions.forEach(pos => {
    const extra = Math.floor(remainingTroops / 3);
    troops[pos] += extra;
    remainingTroops -= extra;
  });

  // Distribute any remaining troops
  let i = 0;
  while (remainingTroops > 0) {
    troops[i % NUM_BATTLEFIELDS]++;
    remainingTroops--;
    i++;
  }

  return troops;
};

/**
 * Psychological Strategy: Uses patterns that exploit common human biases
 */
const psychologicalStrategy = (gameHistory) => {
  if (!gameHistory || gameHistory.length === 0) {
    return pyramidStrategy();
  }

  // People tend to avoid recent losing positions
  const lastRound = gameHistory[gameHistory.length - 1];
  const losingPositions = lastRound.battlefieldResults
    .map((bf, i) => ({ winner: bf.winner, index: i }))
    .filter(pos => pos.winner === 'player')
    .map(pos => pos.index);

  // Allocate more troops to positions where opponent recently won
  const troops = Array(NUM_BATTLEFIELDS).fill(5);
  let remainingTroops = TOTAL_TROOPS - (5 * NUM_BATTLEFIELDS);

  losingPositions.forEach(pos => {
    const extra = Math.floor(remainingTroops / losingPositions.length);
    troops[pos] += extra;
    remainingTroops -= extra;
  });

  // Distribute remaining troops with slight randomization
  while (remainingTroops > 0) {
    const index = Math.floor(Math.random() * NUM_BATTLEFIELDS);
    troops[index]++;
    remainingTroops--;
  }

  return troops;
};

/**
 * Friendly Strategy: Appears to be a simple friendly bot, but actually tries to counter the player perfectly
 */
const friendlyStrategy = (gameHistory) => {
  if (!gameHistory || gameHistory.length === 0) {
    return balancedStrategy();
  }

  // Get the player's last move
  const lastRound = gameHistory[gameHistory.length - 1];
  const playerTroops = lastRound.playerTroops;

  // Create a countering distribution that beats the player's last move
  const troops = Array(NUM_BATTLEFIELDS).fill(0);
  
  // First, identify the most valuable battlefields based on player's past allocation
  const valuedPositions = [...Array(NUM_BATTLEFIELDS).keys()]
    .map(index => ({ troops: playerTroops[index], index }))
    .sort((a, b) => b.troops - a.troops);

  // Counter by putting slightly more troops in their highest valued positions
  let remainingTroops = TOTAL_TROOPS;
  
  // Try to win the most valuable battlefields
  for (const { troops: enemyTroops, index } of valuedPositions) {
    if (remainingTroops <= 0) break;
    
    // Add just enough troops to win, or as many as we can afford
    const neededTroops = Math.min(enemyTroops + 1, remainingTroops);
    troops[index] = neededTroops;
    remainingTroops -= neededTroops;
  }

  // If we have remaining troops, distribute them to empty positions
  if (remainingTroops > 0) {
    const emptyPositions = troops
      .map((t, i) => ({ troops: t, index: i }))
      .filter(p => p.troops === 0)
      .map(p => p.index);

    // Distribute remaining troops evenly among empty positions
    const baseAmount = Math.floor(remainingTroops / emptyPositions.length);
    emptyPositions.forEach(index => {
      troops[index] = baseAmount;
    });

    // Distribute any leftover troops one by one
    let leftover = remainingTroops - (baseAmount * emptyPositions.length);
    let i = 0;
    while (leftover > 0) {
      troops[emptyPositions[i % emptyPositions.length]]++;
      leftover--;
      i++;
    }
  }

  return troops;
};

/**
 * Get all available strategies with descriptions
 */
export const getAllStrategies = () => [
  {
    name: 'Big Cat',
    value: 'bigCat',
    description: 'Concentrates majority of forces on one battlefield'
  },
  {
    name: 'Big Five',
    value: 'bigFive',
    description: 'Uses a 30-20-15-10-10-5-5-2-2-1 split across battlefields'
  },
  {
    name: 'One-Up',
    value: 'oneUp',
    description: 'Tries to beat opponent\'s last move by a small margin'
  },
  {
    name: 'Balanced',
    value: 'balanced',
    description: 'Distributes troops evenly with small variations'
  },
  {
    name: 'Random',
    value: 'random',
    description: 'Completely random allocation'
  },
  {
    name: 'Adaptive',
    value: 'adaptive',
    description: 'Learns from successful past allocations'
  },
  {
    name: 'Front Loader',
    value: 'frontLoader',
    description: 'Concentrates troops on first battlefields'
  },
  {
    name: 'Back Loader',
    value: 'backLoader',
    description: 'Concentrates troops on last battlefields'
  },
  {
    name: 'Pyramid',
    value: 'pyramid',
    description: 'Concentrates troops in middle battlefields'
  },
  {
    name: 'Alternating',
    value: 'alternating',
    description: 'Alternates between strong and weak positions'
  },
  {
    name: 'Blitzkrieg',
    value: 'blitzkrieg',
    description: 'Heavily focuses on first few battlefields'
  },
  {
    name: 'Counter',
    value: 'counter',
    description: 'Analyzes and counters opponent\'s patterns'
  },
  {
    name: 'Psychological',
    value: 'psychological',
    description: 'Exploits common human decision-making patterns'
  },
  {
    name: 'Friendly',
    value: 'friendly',
    description: 'A simple beginner-friendly strategy'
  }
];

export const getDefaultStrategy = () => ({
  name: 'Balanced',
  value: 'balanced',
  description: 'Distributes troops evenly with small variations'
});
