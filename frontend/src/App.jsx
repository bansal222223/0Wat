import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Analyze from './pages/Analyze';
import Processing from './pages/Processing';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Processing page is full-screen — no Navbar */}
        <Route path="/processing" element={<Processing />} />

        {/* All other pages have Navbar */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/analyze" element={<Analyze />} />
              </Routes>
            </main>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
