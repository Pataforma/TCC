import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Veterinarios from "./pages/Veterinarios";
import Animais from "./pages/Animais";
import Produto from "./pages/Produto";
import Agenda from "./pages/Agenda";
import Contato from "./pages/Contato";
import LoadingPage from "./pages/LoadingPage";
import TelaLogin from "./pages/Login/TelaLogin";
import TipoUsuario from "./pages/TipoUsuario/TipoUsuario";
import DashboardTutor from "./pages/DashboardTutor";
import DashboardVeterinario from "./pages/DashboardVeterinario";
import DashboardAnunciante from "./pages/DashboardAnunciante";
import DashboardParceiro from "./pages/DashboardParceiro";
import TutorPerfil from "./pages/TutorPerfil";
import TutorPet from "./pages/TutorPet";
import Termos from "./pages/Termos";

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
        <Route path="/tipo-usuario" element={<TipoUsuario />} />
        <Route path="/dashboard/tutor" element={<DashboardTutor />} />
        <Route
          path="/dashboard/veterinario"
          element={<DashboardVeterinario />}
        />
        <Route path="/dashboard/anunciante" element={<DashboardAnunciante />} />
        <Route path="/dashboard/parceiro" element={<DashboardParceiro />} />
        <Route path="/tutor/perfil" element={<TutorPerfil />} />
        <Route path="/tutor/pet" element={<TutorPet />} />
        <Route path="/termos" element={<Termos />} />
      </Routes>
    </>
  );
}

export default App;
