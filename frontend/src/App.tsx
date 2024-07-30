import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './assets/styles/App.css';
import 'https://kit.fontawesome.com/ad50c3f97d.js';

import Footer from './components/Footer';
import Home from './pages/Home'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
