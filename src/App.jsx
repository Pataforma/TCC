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
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'

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
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </>
  );
}

export default App;
