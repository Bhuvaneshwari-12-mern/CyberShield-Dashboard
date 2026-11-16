import TrendRisk from './pages/TrendRisk';


import GeographicalAnalysis from './pages/GeographicalAnalysis';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ExecutiveOverview from './pages/ExecutiveOverview';
import AttackIntelligence from './pages/AttackIntelligence';
import IncidentExplorer from './pages/IncidentExplorer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ExecutiveOverview />} />
          <Route path="attacks" element={<AttackIntelligence />} />
          <Route path="explorer" element={<IncidentExplorer />} />
          <Route path="geo" element={<GeographicalAnalysis />} />
          <Route path="trends" element={<TrendRisk />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;