import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Identify from './pages/Identify';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/identify" element={<Identify />} />
      <Route path="/dashboard" element={<Dashboard />} /> 
    </Routes>
  );
}

export default App;
