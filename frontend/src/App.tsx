import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FileProvider } from './context/FileContext';
import { ToastProvider } from './components/ui/use-toast';
import { Home } from './pages/Home';
import { PdfConverter } from './pages/PdfConverter';
import { Guidelines } from './pages/Guidelines';
import { SimulationPage } from './pages/SimulationPage';

function App() {
  return (
    <ToastProvider>
      <FileProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pdf-tools" element={<PdfConverter />} />
            <Route path="/orientacoes" element={<Guidelines />} />
            <Route path="/simulacao" element={<SimulationPage />} />
          </Routes>
        </Router>
      </FileProvider>
    </ToastProvider>
  );
}

export default App;
