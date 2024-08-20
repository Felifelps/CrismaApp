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
import UpdateCrismando from './pages/UpdateCrismando';
import Encontros from './pages/Encontros';
import NewEncontro from './pages/NewEncontro';
import UpdateEncontro from './pages/UpdateEncontro';
import Domingos from './pages/Domingos';
import NewDomingo from './pages/NewDomingo';
import UpdateDomingo from './pages/UpdateDomingo';
import NotFound from './pages/NotFound';

import { TokenProvider } from './contexts/Token';
import { FlashMessageProvider } from './contexts/FlashMessages';

import './services/checkToken';

function App() {
  return (
    <BrowserRouter>
      <FlashMessageProvider>
      <TokenProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/crismandos" element={<Crismandos />} />
          <Route path="/crismandos/new" element={<NewCrismando />} />
          <Route path="/crismandos/:id" element={<UpdateCrismando />} />
          
          <Route path="/encontros" element={<Encontros />} />
          <Route path="/encontros/new" element={<NewEncontro />} />
          <Route path="/encontros/:id" element={<UpdateEncontro />} />
          
          <Route path="/domingos" element={<Domingos />} />
          <Route path="/domingos/new" element={<NewDomingo />} />
          <Route path="/domingos/:id" element={<UpdateDomingo />} />
        </Routes>
      </TokenProvider>
      </FlashMessageProvider>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
