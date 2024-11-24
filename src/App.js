import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Dashboard from './components/Dashboard/Dashboard';
import PrisonersDilemma from './components/Games/PrisonersDilemma/PrisonersDilemma';
import RockPaperScissors from './components/Games/RockPaperScissors/RockPaperScissors';
import BattleOfSexes from "./components/Games/BattleOfSexes/BattleOfSexes";
import NashEquilibrium from './components/Games/NashEquilibrium/NashEquilibrium';
import MatchingPennies from './components/Games/MatchingPennies/MatchingPennies';
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
          <Route path="/game/nash-equilibrium" element={<NashEquilibrium />} />
          <Route path="/game/matching-pennies" element={<MatchingPennies />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
