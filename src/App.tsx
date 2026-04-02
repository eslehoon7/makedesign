import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';
import PortfolioDetail from './pages/PortfolioDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/portfolio/:id" element={<PortfolioDetail />} />
      </Routes>
    </Router>
  );
}
