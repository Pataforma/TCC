// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas ou seções principais
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Veterinarios from './pages/Veterinarios'
import Animais from './pages/Animais'
import Produto from './pages/Produto'
import Agenda from './pages/Agenda'
import Contato from './pages/Contato'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/veterinarios" element={<Veterinarios />} />
        <Route path="/animais" element={<Animais />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </>
  )
}

export default App
