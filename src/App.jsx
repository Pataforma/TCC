import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
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
import DashboardTutor from "./pages/tutor/DashboardTutor";
import DashboardVeterinario from "./pages/veterinario/DashboardVeterinario";
import DashboardVeterinarioAgenda from "./pages/veterinario/DashboardVeterinarioAgenda";
import DashboardVeterinarioPacientes from "./pages/veterinario/DashboardVeterinarioPacientes";

import DashboardAnunciante from "./pages/anunciante/DashboardAnunciante";
import DashboardParceiro from "./pages/parceiro/DashboardParceiro";
import DashboardTutorPerfil from "./pages/tutor/DashboardTutorPerfil";
import DashboardTutorPet from "./pages/tutor/DashboardTutorPet";
import Termos from "./pages/Termos";
import AuthCallback from "./pages/Login/AuthCallback";
import VeterinarioPerfil from "./pages/veterinario/VeterinarioPerfil";
import DashboardTutorFinanceiro from "./pages/tutor/DashboardTutorFinanceiro";
import DashboardTutorPetPerdido from "./pages/tutor/DashboardTutorPetPerdido";
import DashboardTutorAdotarPet from "./pages/tutor/DashboardTutorAdotarPet";
import ProntuarioPage from "./pages/veterinario/ProntuarioPage";
import EstoquePage from "./pages/veterinario/EstoquePage";
import FinanceiroPage from "./pages/veterinario/FinanceiroPage";
import MarketingPage from "./pages/veterinario/MarketingPage";
import ChatPage from "./pages/veterinario/ChatPage";

// Novas páginas do Tutor Portal
import AgendamentosPage from "./pages/tutor/AgendamentosPage";
import VacinasPage from "./pages/tutor/VacinasPage";
import ServicosPage from "./pages/tutor/ServicosPage";
import MensagensPage from "./pages/tutor/MensagensPage";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <ScrollToTop />
      <div key={location.pathname} className="fade-in">
        <Routes location={location}>
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
          <Route
            path="/dashboard/veterinario/agenda"
            element={<DashboardVeterinarioAgenda />}
          />
          <Route
            path="/dashboard/veterinario/pacientes"
            element={<DashboardVeterinarioPacientes />}
          />

          <Route
            path="/dashboard/anunciante"
            element={<DashboardAnunciante />}
          />
          <Route path="/dashboard/parceiro" element={<DashboardParceiro />} />
          <Route path="/tutor/perfil" element={<DashboardTutorPerfil />} />
          <Route path="/tutor/pet" element={<DashboardTutorPet />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/veterinario/perfil" element={<VeterinarioPerfil />} />
          <Route
            path="/dashboard/tutor/financeiro"
            element={<DashboardTutorFinanceiro />}
          />
          <Route
            path="/tutor/pet-perdido"
            element={<DashboardTutorPetPerdido />}
          />
          <Route
            path="/tutor/adotar-pet"
            element={<DashboardTutorAdotarPet />}
          />

          {/* Novas rotas do Tutor Portal */}
          <Route path="/tutor/agendamentos" element={<AgendamentosPage />} />
          <Route path="/tutor/vacinas" element={<VacinasPage />} />
          <Route path="/tutor/servicos" element={<ServicosPage />} />
          <Route path="/tutor/mensagens" element={<MensagensPage />} />

          <Route path="/patients/:id" element={<ProntuarioPage />} />
          <Route path="/prontuario/:id" element={<ProntuarioPage />} />
          <Route path="/inventory" element={<EstoquePage />} />
          <Route path="/finance" element={<FinanceiroPage />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/messages" element={<ChatPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
