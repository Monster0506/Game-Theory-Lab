import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import PrisonersDilemma from './components/Games/PrisonersDilemma/PrisonersDilemma';
import StagHunt from './components/Games/StagHunt/StagHunt';
import PublicGoods from './components/Games/PublicGoods/PublicGoods';
import RockPaperScissors from './components/Games/RockPaperScissors/RockPaperScissors';
import BattleOfSexes from './components/Games/BattleOfSexes/BattleOfSexes';
import HawkDove from './components/Games/HawkDove/HawkDove';
import MatchingPennies from './components/Games/MatchingPennies/MatchingPennies';
import MarketEntry from './components/Games/MarketEntry/MarketEntry';
import Trust from './components/Games/Trust/Trust';
import Ultimatum from './components/Games/Ultimatum/Ultimatum';
import Blotto from './components/Games/Blotto/Blotto';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/game/prisoner-s-dilemma" element={<PrisonersDilemma />} />
          <Route path="/game/rock--paper--scissors" element={<RockPaperScissors />} />
          <Route path="/game/battle-of-the-sexes" element={<BattleOfSexes />} />
          <Route path="/game/matching-pennies" element={<MatchingPennies />} />
          <Route path="/game/hawk-dove-game" element={<HawkDove />} />
          <Route path="/game/stag-hunt" element={<StagHunt />} />
          <Route path="/game/public-goods-game" element={<PublicGoods />} />
          <Route path="/game/market-entry-game" element={<MarketEntry />} />
          <Route path="/game/trust-game" element={<Trust />} />
          <Route path="/game/ultimatum-game" element={<Ultimatum />} />
          <Route path="/game/colonel-blotto" element={<Blotto />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
