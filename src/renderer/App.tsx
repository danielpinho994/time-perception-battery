import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './components/AppContext';
import MainMenu from './components/main_menu/MainMenu';
import EstimationTest from './components/table_tests/EstimationTest';
import ProductionTest from './components/table_tests/ProductionTest';
import './App.css';

export default function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/estimation-test" element={<EstimationTest />} />
          <Route path="/production-test" element={<ProductionTest />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}
