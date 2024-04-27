import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './components/AppContext';
import MainMenu from './components/MainMenu';
import EstimationTest from './components/EstimationTest';
import ProductionTest from './components/ProductionTest';
import ClockTest from './components/ClockTest';
import './App.css';

export default function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/estimation-test" element={<EstimationTest />} />
          <Route path="/production-test" element={<ProductionTest />} />
          <Route path="/clock-test" element={<ClockTest />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}
