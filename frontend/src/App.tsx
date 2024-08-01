import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './assets/styles/App.css';
import 'https://kit.fontawesome.com/ad50c3f97d.js';

import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Crismandos from './pages/Crismandos';
import NewCrismando from './pages/NewCrismando';
import Encontros from './pages/Encontros';
import Domingos from './pages/Domingos';
import NotFound from './pages/NotFound';

import { TokenProvider } from './contexts/Token';

function App() {
  return (
    <BrowserRouter>
      <TokenProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/crismandos" element={<Crismandos />} />
          <Route path="/crismandos/new" element={<NewCrismando />} />
          <Route path="/encontros" element={<Encontros />} />
          <Route path="/domingos" element={<Domingos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TokenProvider>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
