import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <a href="/" className="header-logo">
            <span className="logo-icon">🔥</span>
            <div>
              <h1>RoastMe</h1>
              <span className="header-tagline">AI-Powered Comedy Roasts</span>
            </div>
          </a>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} RoastMe — An AVS Media App. All roasts are AI-generated. No feelings were harmed (probably).</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
