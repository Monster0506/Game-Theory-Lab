import React from 'react';
import GameCard from '../GameCard/GameCard';
import './Dashboard.css';

const Dashboard = () => {
  const games = [
    {
      id: 1,
      title: "Prisoner's Dilemma",
      description: "A classic game theory scenario where two prisoners must decide whether to cooperate or betray each other.",
      image: "/images/games/prisoners-dilemma.jpg",
      status: "Ready to Play"
    },
    {
      id: 2,
      title: "Matching Pennies",
      description: "A zero-sum game where players try to match or mismatch their opponent's choice.",
      image: "/images/games/matching-pennies.jpg",
      status: "Ready to Play"
    },
    {
      id: 3,
      title: "Battle of the Sexes",
      description: "A coordination game about two players choosing between two events with different preferences.",
      image: "/images/games/battle-of-sexes.jpg",
      status: "Ready to Play"
    },
    {
      id: 4,
      title: "Hawk-Dove Game",
      description: "Players choose between aggressive and passive strategies, demonstrating conflict and cooperation.",
      image: "/images/games/hawk-dove.jpg",
      status: "Coming Soon"
    },
    {
      id: 5,
      title: "Stag Hunt",
      description: "A game of social cooperation where players choose between high-risk collective reward or safe individual gain.",
      image: "/images/games/stag-hunt.jpg",
      status: "Coming Soon"
    },
    {
      id: 6,
      title: "Public Goods Game",
      description: "Multiple players decide how much to contribute to a common pool that benefits everyone.",
      image: "/images/games/public-goods.jpg",
      status: "Coming Soon"
    },
    {
      id: 7,
      title: "Rock, Paper, Scissors",
      description: "Classic zero-sum game demonstrating cyclic dominance and mixed strategies.",
      image: "/images/games/rock-paper-scissors.jpg",
      status: "Ready to Play"
    },
    {
      id: 8,
      title: "Market Entry Game",
      description: "Strategic decision-making about market entry based on competition and profit potential.",
      image: "/images/games/market-entry.jpg",
      status: "Coming Soon"
    },
    {
      id: 9,
      title: "Trust Game",
      description: "Sequential game exploring trust and reciprocity between two players.",
      image: "/images/games/trust-game.jpg",
      status: "Coming Soon"
    },
    {
      id: 10,
      title: "Ultimatum Game",
      description: "One player proposes a split of resources, while the other can accept or reject it.",
      image: "/images/games/ultimatum-game.jpg",
      status: "Coming Soon"
    },
    {
      id: 11,
      title: "Colonel Blotto",
      description: "Strategic resource allocation across multiple battlefields in a military-themed game.",
      image: "/images/games/colonel-blotto.jpg",
      status: "Coming Soon"
    }
  ];

  return (
    <div className="dashboard">
      <h1>Game Theory Simulation Platform</h1>
      <div className="games-grid">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
