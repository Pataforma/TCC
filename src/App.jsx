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
import TelaLogin from "./pages/Login/TelaLogin";

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
        <Route path="/telalogin" element={<TelaLogin />} />
        <Route path="/loading" element={<LoadingPage />} />
      </Routes>
    </>
  );
}

export default App;