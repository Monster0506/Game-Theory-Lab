/**
 * Bot decision-making logic for the Ultimatum game with enhanced strategies and game history integration
 */

/**
 * Get bot's choice based on strategy and game state
 * @param {string} strategy - Bot's strategy name
 * @param {Array} gameHistory - History of previous rounds
 * @param {Object} options - Additional options (role, offer, totalAmount)
 * @returns {string|number} - Bot's decision or offer amount
 */
export const getBotChoice = (strategy, gameHistory, options) => {
  const { role, offer, totalAmount } = options;

  if (role === 'proposer') {
    return getProposerOffer(strategy, gameHistory, totalAmount);
  } else {
    return getResponderDecision(strategy, gameHistory, offer, totalAmount);
  }
};

/**
 * Get proposer's offer based on strategy
 */
const getProposerOffer = (strategy, gameHistory, totalAmount) => {
  switch (strategy) {
    case 'random':
      return Math.floor(Math.random() * (totalAmount + 1));

    case 'fair':
      return Math.floor(totalAmount / 2);

    case 'greedy':
      return Math.floor(totalAmount * 0.2); // Offers 20%

    case 'generous':
      return Math.floor(totalAmount * 0.7); // Offers 70%

    case 'adaptive':
      return adaptProposerOffer(gameHistory, totalAmount);

    case 'titForTat':
      return titForTatProposer(gameHistory, totalAmount);

    case 'gradual':
      return gradualLearningProposer(gameHistory, totalAmount);

    case 'reactive':
      return reactiveProposer(gameHistory, totalAmount);

    case 'friendly':
      return friendlyStrategy(gameHistory, true);

    default:
      return Math.floor(totalAmount / 2);
  }
};

/**
 * Get responder's decision based on strategy
 */
const getResponderDecision = (strategy, gameHistory, offer, totalAmount) => {
  const offerPercentage = offer / totalAmount;

  switch (strategy) {
    case 'random':
      return Math.random() < 0.5 ? 'accept' : 'reject';

    case 'fair':
      return offerPercentage >= 0.4 ? 'accept' : 'reject';

    case 'accepting':
      return offerPercentage >= 0.2 ? 'accept' : 'reject';

    case 'strict':
      return offerPercentage >= 0.6 ? 'accept' : 'reject';

    case 'adaptive':
      return adaptResponderDecision(gameHistory, offerPercentage);

    case 'titForTat':
      return titForTatResponder(gameHistory, offerPercentage);

    case 'reputation':
      return reputationBasedResponder(gameHistory, offerPercentage);

    case 'trend':
      return trendAnalysisResponder(gameHistory, offerPercentage);

    case 'friendly':
      return friendlyStrategy(gameHistory, false)(offer);

    default:
      return offerPercentage >= 0.4 ? 'accept' : 'reject';
  }
};

/**
 * Adaptive proposer strategy based on game history
 */
const adaptProposerOffer = (gameHistory, totalAmount) => {
  if (!gameHistory || gameHistory.length === 0) {
    return Math.floor(totalAmount / 2);
  }

  const lastRounds = gameHistory.slice(-5);
  const avgAcceptanceThreshold = lastRounds.reduce((acc, round) => {
    if (round.response === 'accept') {
      return acc + round.offer / totalAmount;
    }
    return acc;
  }, 0) / lastRounds.length;

  return Math.floor(totalAmount * Math.max(0.2, avgAcceptanceThreshold + 0.05));
};

/**
 * Tit-for-tat proposer strategy - mimics the responder's fairness
 */
const titForTatProposer = (gameHistory, totalAmount) => {
  if (!gameHistory || gameHistory.length === 0) {
    return Math.floor(totalAmount / 2);
  }

  const lastRound = gameHistory[gameHistory.length - 1];
  if (lastRound.response === 'accept') {
    // If last offer was accepted, slightly decrease the offer
    return Math.max(Math.floor(totalAmount * 0.2), lastRound.offer - 1);
  } else {
    // If last offer was rejected, increase the offer
    return Math.min(Math.floor(totalAmount * 0.8), lastRound.offer + 2);
  }
};

/**
 * Gradual learning proposer - slowly adjusts offers based on success rate
 */
const gradualLearningProposer = (gameHistory, totalAmount) => {
  if (!gameHistory || gameHistory.length === 0) {
    return Math.floor(totalAmount / 2);
  }

  const recentHistory = gameHistory.slice(-10);
  const acceptanceRate = recentHistory.filter(round => round.response === 'accept').length / recentHistory.length;
  const lastOffer = recentHistory[recentHistory.length - 1].offer;

  if (acceptanceRate > 0.7) {
    // High acceptance rate - try slightly lower offers
    return Math.max(Math.floor(totalAmount * 0.2), lastOffer - 1);
  } else if (acceptanceRate < 0.3) {
    // Low acceptance rate - increase offers
    return Math.min(Math.floor(totalAmount * 0.7), lastOffer + 2);
  }
  return lastOffer; // Keep current offer if acceptance rate is moderate
};

/**
 * Reactive proposer - makes larger adjustments based on recent rejections
 */
const reactiveProposer = (gameHistory, totalAmount) => {
  if (!gameHistory || gameHistory.length === 0) {
    return Math.floor(totalAmount / 2);
  }

  const recentHistory = gameHistory.slice(-3);
  const consecutiveRejections = recentHistory.filter(round => round.response === 'reject').length;

  if (consecutiveRejections >= 2) {
    // Significant increase after multiple rejections
    const lastOffer = recentHistory[recentHistory.length - 1].offer;
    return Math.min(Math.floor(totalAmount * 0.8), lastOffer + 3);
  }

  return adaptProposerOffer(gameHistory, totalAmount);
};

/**
 * Adaptive responder strategy based on game history
 */
const adaptResponderDecision = (gameHistory, offerPercentage) => {
  if (!gameHistory || gameHistory.length === 0) {
    return offerPercentage >= 0.4 ? 'accept' : 'reject';
  }

  const lastRounds = gameHistory.slice(-5);
  const avgOfferPercentage = lastRounds.reduce((acc, round) => acc + round.offer / round.totalAmount, 0) / lastRounds.length;
  const dynamicThreshold = Math.max(0.3, avgOfferPercentage * 0.9);

  return offerPercentage >= dynamicThreshold ? 'accept' : 'reject';
};

/**
 * Tit-for-tat responder - bases decisions on proposer's history of fairness
 */
const titForTatResponder = (gameHistory, offerPercentage) => {
  if (!gameHistory || gameHistory.length === 0) {
    return offerPercentage >= 0.4 ? 'accept' : 'reject';
  }

  const recentHistory = gameHistory.slice(-3);
  const fairOffers = recentHistory.filter(round => round.offer / round.totalAmount >= 0.4).length;
  const fairnessRatio = fairOffers / recentHistory.length;

  // More lenient if proposer has been fair, stricter if unfair
  const threshold = fairnessRatio > 0.5 ? 0.3 : 0.5;
  return offerPercentage >= threshold ? 'accept' : 'reject';
};

/**
 * Reputation-based responder - maintains a "fairness score" for the proposer
 */
const reputationBasedResponder = (gameHistory, offerPercentage) => {
  if (!gameHistory || gameHistory.length === 0) {
    return offerPercentage >= 0.4 ? 'accept' : 'reject';
  }

  const recentHistory = gameHistory.slice(-5);
  const fairnessScore = recentHistory.reduce((score, round) => {
    const roundOfferPercent = round.offer / round.totalAmount;
    return score + (roundOfferPercent >= 0.4 ? 1 : -1);
  }, 0);

  // Adjust acceptance threshold based on proposer's reputation
  const threshold = 0.4 - (fairnessScore * 0.02);
  return offerPercentage >= Math.max(0.2, threshold) ? 'accept' : 'reject';
};

/**
 * Trend analysis responder - looks for patterns in offer changes
 */
const trendAnalysisResponder = (gameHistory, offerPercentage) => {
  if (!gameHistory || gameHistory.length < 2) {
    return offerPercentage >= 0.4 ? 'accept' : 'reject';
  }

  const recentHistory = gameHistory.slice(-3);
  const offerTrend = recentHistory.reduce((trend, round, i, arr) => {
    if (i === 0) return 0;
    return trend + (round.offer - arr[i - 1].offer);
  }, 0);

  // More lenient if offers are increasing, stricter if decreasing
  const threshold = offerTrend > 0 ? 0.35 : 0.45;
  return offerPercentage >= threshold ? 'accept' : 'reject';
};

/**
 * Friendly Strategy: Appears to be a simple friendly bot, but actually maximizes its own gain
 */
const friendlyStrategy = (gameHistory, isProposer) => {
  if (isProposer) {
    // When proposing, offer the minimum amount that has been accepted in the past
    if (!gameHistory || gameHistory.length === 0) {
      return 50; // Start with a seemingly fair offer
    }

    const acceptedOffers = gameHistory
      .filter(round => round.accepted)
      .map(round => round.offer);

    if (acceptedOffers.length === 0) {
      return 20; // If no accepted offers, try a low but not too low offer
    }

    // Return the minimum accepted offer minus 1
    return Math.max(1, Math.min(...acceptedOffers) - 1);
  } else {
    // When responding, accept only if the offer is significantly profitable
    return offer => offer >= 30; // Accept only decent offers
  }
};

/**
 * Fair Strategy: Makes and accepts fair offers
 */
const fairStrategy = (gameHistory, isProposer) => {
  if (isProposer) {
    return 50; // Always offer 50-50 split
  } else {
    return offer => offer >= 40; // Accept reasonably fair offers
  }
};

/**
 * Greedy Strategy: Tries to maximize own profit
 */
const greedyStrategy = (gameHistory, isProposer) => {
  if (isProposer) {
    return 20; // Offer low amount
  } else {
    return offer => offer >= 10; // Accept any non-trivial amount
  }
};

/**
 * Random Strategy: Makes random decisions
 */
const randomStrategy = (gameHistory, isProposer) => {
  if (isProposer) {
    return Math.floor(Math.random() * 91) + 10; // Random offer between 10 and 100
  } else {
    return offer => Math.random() < 0.5; // Random accept/reject
  }
};

/**
 * Tit-for-Tat Strategy: Reciprocates opponent's behavior
 */
const titForTatStrategy = (gameHistory, isProposer) => {
  if (!gameHistory || gameHistory.length === 0) {
    return isProposer ? 50 : offer => offer >= 40;
  }

  if (isProposer) {
    // Look at last round where we were responder
    const lastAsResponder = [...gameHistory].reverse()
      .find(round => round.role === 'responder');
    
    if (!lastAsResponder) return 50;
    return lastAsResponder.offer; // Offer what we received
  } else {
    // Look at last round where we were proposer
    const lastAsProposer = [...gameHistory].reverse()
      .find(round => round.role === 'proposer');
    
    if (!lastAsProposer) return offer => offer >= 40;
    return offer => offer >= lastAsProposer.accepted ? 40 : 20;
  }
};

/**
 * Adaptive Strategy: Learns from past interactions
 */
const adaptiveStrategy = (gameHistory, isProposer) => {
  if (!gameHistory || gameHistory.length === 0) {
    return isProposer ? 50 : offer => offer >= 40;
  }

  if (isProposer) {
    const acceptedOffers = gameHistory
      .filter(round => round.accepted)
      .map(round => round.offer);

    if (acceptedOffers.length === 0) return 45;
    const avgAccepted = acceptedOffers.reduce((a, b) => a + b, 0) / acceptedOffers.length;
    return Math.max(20, Math.floor(avgAccepted * 0.9)); // Slightly less than average accepted
  } else {
    const offers = gameHistory.map(round => round.offer);
    const avgOffer = offers.reduce((a, b) => a + b, 0) / offers.length;
    return offer => offer >= (avgOffer * 0.8); // Accept if close to average
  }
};

export const strategies = {
  random: {
    name: 'Random',
    description: 'Makes random offers and accepts randomly',
    makeOffer: (totalAmount) => Math.floor(Math.random() * totalAmount),
    acceptOffer: (offer, totalAmount) => Math.random() < 0.5
  },

  fair: {
    name: 'Fair',
    description: 'Makes and accepts fair offers (40-60%)',
    makeOffer: (totalAmount) => Math.floor(totalAmount / 2),
    acceptOffer: (offer, totalAmount) => offer >= totalAmount * 0.4
  },

  greedy: {
    name: 'Greedy',
    description: 'Makes low offers and only accepts high ones',
    makeOffer: (totalAmount) => Math.floor(totalAmount * 0.2),
    acceptOffer: (offer, totalAmount) => offer >= totalAmount * 0.7
  },

  friendly: {
    name: 'Friendly',
    description: 'A simple beginner-friendly strategy',
    makeOffer: (totalAmount) => {
      // When proposing, offer minimum amount that's likely to be accepted (1)
      return 1;
    },
    acceptOffer: (offer, totalAmount) => {
      // When responding, accept any non-zero offer (rational)
      return offer > 0;
    }
  }
};

export const getBotStrategy = (strategy, gameHistory, isProposer) => {
  switch (strategy) {
    case 'fair':
      return fairStrategy(gameHistory, isProposer);
    case 'greedy':
      return greedyStrategy(gameHistory, isProposer);
    case 'random':
      return randomStrategy(gameHistory, isProposer);
    case 'tit-for-tat':
      return titForTatStrategy(gameHistory, isProposer);
    case 'adaptive':
      return adaptiveStrategy(gameHistory, isProposer);
    case 'friendly':
      return friendlyStrategy(gameHistory, isProposer);
    default:
      return fairStrategy(gameHistory, isProposer);
  }
};

export const getDefaultStrategy = () => strategies.random;
export const getAllStrategies = () => Object.values(strategies);
