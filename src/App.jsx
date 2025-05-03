// src/App.jsx

import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Veterinarios from './pages/Veterinarios'
import Animais from './pages/Animais'
import Produto from './pages/Produto'
import Agenda from './pages/Agenda'
import Contato from './pages/Contato'
import LoadingPage from './pages/LoadingPage'
import AuthPage from "./components/AuthPage/AuthPage";



function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/veterinarios" element={<Veterinarios />} />
        <Route path="/animais" element={<Animais />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/loading" element={<LoadingPage />} />
      </Routes>
    </>
  );
}

export default App;
