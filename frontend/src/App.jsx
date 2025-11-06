import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <Routes>
      {/* Route 1: The new Homepage */}
      <Route path="/" element={<HomePage />} />
      
      {/* Route 2: The Main Application, which lives under /app/* */}
      <Route path="/app/*" element={<AppLayout />} />
    </Routes>
  );
}

export default App;