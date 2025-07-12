import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import ScrollToTop from "./components/ScrollToTop";
import LoadingPage from "./pages/LoadingPage";
import TransitionWrapper from "./components/TransitionWrapper";
import LoadingTransition from "./components/LoadingTransition";
import {
  TutorRoute,
  VeterinarioRoute,
  AnuncianteRoute,
  ParceiroRoute,
  CompleteProfileRoute,
  PublicRoute,
} from "./components/AuthGuard";
import { SubscriptionProvider } from "./context/SubscriptionContext";

// Lazy loading para todas as páginas
const Home = lazy(() => import("./pages/Home"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Veterinarios = lazy(() => import("./pages/Veterinarios"));
const Animais = lazy(() => import("./pages/Animais"));
const Produto = lazy(() => import("./pages/Produto"));
const Agenda = lazy(() => import("./pages/Agenda"));
const Contato = lazy(() => import("./pages/Contato"));
const TelaLogin = lazy(() => import("./pages/Login/TelaLogin"));
const TipoUsuario = lazy(() => import("./pages/TipoUsuario/TipoUsuario"));
const DashboardTutor = lazy(() => import("./pages/tutor/DashboardTutor"));
const DashboardVeterinario = lazy(() =>
  import("./pages/veterinario/DashboardVeterinario")
);
const DashboardVeterinarioAgenda = lazy(() =>
  import("./pages/veterinario/DashboardVeterinarioAgenda")
);
const DashboardVeterinarioPacientes = lazy(() =>
  import("./pages/veterinario/DashboardVeterinarioPacientes")
);
const DashboardAnunciante = lazy(() =>
  import("./pages/anunciante/DashboardAnunciante")
);
const DashboardParceiro = lazy(() =>
  import("./pages/parceiro/DashboardParceiro")
);
const DashboardTutorPerfil = lazy(() =>
  import("./pages/tutor/DashboardTutorPerfil")
);
const DashboardTutorPet = lazy(() => import("./pages/tutor/DashboardTutorPet"));
const Termos = lazy(() => import("./pages/Termos"));
const AuthCallback = lazy(() => import("./pages/Login/AuthCallback"));
const VeterinarioPerfil = lazy(() =>
  import("./pages/veterinario/VeterinarioPerfil")
);
const DashboardTutorFinanceiro = lazy(() =>
  import("./pages/tutor/DashboardTutorFinanceiro")
);
const DashboardTutorPetPerdido = lazy(() =>
  import("./pages/tutor/DashboardTutorPetPerdido")
);
const DashboardTutorAdotarPet = lazy(() =>
  import("./pages/tutor/DashboardTutorAdotarPet")
);
const ProntuarioPage = lazy(() => import("./pages/veterinario/ProntuarioPage"));
const EstoquePage = lazy(() => import("./pages/veterinario/EstoquePage"));
const FinanceiroPage = lazy(() => import("./pages/veterinario/FinanceiroPage"));
const MarketingPage = lazy(() => import("./pages/veterinario/MarketingPage"));
const ChatPage = lazy(() => import("./pages/veterinario/ChatPage"));
const AgendamentosPage = lazy(() => import("./pages/tutor/AgendamentosPage"));
const VacinasPage = lazy(() => import("./pages/tutor/VacinasPage"));
const ServicosPage = lazy(() => import("./pages/tutor/ServicosPage"));
const MensagensPage = lazy(() => import("./pages/tutor/MensagensPage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));
const PlanosPage = lazy(() => import("./pages/PlanosPage"));
const DuvidasPage = lazy(() => import("./pages/DuvidasPage"));

// Componente de fallback para loading
const PageLoader = () => (
  <LoadingTransition
    timeout={1000}
    message="Carregando página..."
    color="primary"
    size="large"
  />
);

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <SubscriptionProvider>
      <ScrollToTop />
      <TransitionWrapper>
        <div key={location.pathname} className="fade-in">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              {/* Rotas Públicas */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                }
              />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/veterinarios" element={<Veterinarios />} />
              <Route path="/animais" element={<Animais />} />
              <Route path="/produto" element={<Produto />} />
              <Route path="/planos" element={<PlanosPage />} />
              <Route path="/duvidas" element={<DuvidasPage />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/contato" element={<Contato />} />
              <Route
                path="/telalogin"
                element={
                  <PublicRoute>
                    <TelaLogin />
                  </PublicRoute>
                }
              />
              <Route path="/loading" element={<LoadingPage />} />
              <Route path="/tipo-usuario" element={<TipoUsuario />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Rotas Protegidas - Tutor */}
              <Route
                path="/dashboard/tutor"
                element={
                  <TutorRoute>
                    <DashboardTutor />
                  </TutorRoute>
                }
              />
              <Route
                path="/tutor/perfil"
                element={
                  <TutorRoute>
                    <DashboardTutorPerfil />
                  </TutorRoute>
                }
              />
              <Route
                path="/tutor/pet"
                element={
                  <TutorRoute>
                    <DashboardTutorPet />
                  </TutorRoute>
                }
              />
              <Route
                path="/dashboard/tutor/financeiro"
                element={
                  <TutorRoute>
                    <DashboardTutorFinanceiro />
                  </TutorRoute>
                }
              />
              <Route
                path="/tutor/pet-perdido"
                element={
                  <TutorRoute>
                    <DashboardTutorPetPerdido />
                  </TutorRoute>
                }
              />
              <Route
                path="/tutor/adotar-pet"
                element={
                  <TutorRoute>
                    <DashboardTutorAdotarPet />
                  </TutorRoute>
                }
              />
              <Route
                path="/tutor/agendamentos"
                element={
                  <TutorRoute>
                    <AgendamentosPage />
                  </TutorRoute>
                }
              />
              <Route
                path="/tutor/vacinas"
                element={
                  <TutorRoute>
                    <VacinasPage />
                  </TutorRoute>
                }
              />
              <Route
                path="/tutor/servicos"
                element={
                  <TutorRoute>
                    <ServicosPage />
                  </TutorRoute>
                }
              />
              <Route
                path="/tutor/mensagens"
                element={
                  <TutorRoute>
                    <MensagensPage />
                  </TutorRoute>
                }
              />

              {/* Rotas Protegidas - Veterinário */}
              <Route
                path="/dashboard/veterinario"
                element={
                  <VeterinarioRoute>
                    <DashboardVeterinario />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/dashboard/veterinario/agenda"
                element={
                  <VeterinarioRoute>
                    <DashboardVeterinarioAgenda />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/dashboard/veterinario/pacientes"
                element={
                  <VeterinarioRoute>
                    <DashboardVeterinarioPacientes />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/veterinario/perfil"
                element={
                  <VeterinarioRoute>
                    <VeterinarioPerfil />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/patients/:id"
                element={
                  <VeterinarioRoute>
                    <ProntuarioPage />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/prontuario/:id"
                element={
                  <VeterinarioRoute>
                    <ProntuarioPage />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <VeterinarioRoute>
                    <EstoquePage />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/finance"
                element={
                  <VeterinarioRoute>
                    <FinanceiroPage />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/marketing"
                element={
                  <VeterinarioRoute>
                    <MarketingPage />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <VeterinarioRoute>
                    <ChatPage />
                  </VeterinarioRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <VeterinarioRoute>
                    <ChatPage />
                  </VeterinarioRoute>
                }
              />

              {/* Rotas Protegidas - Anunciante */}
              <Route
                path="/dashboard/anunciante"
                element={
                  <AnuncianteRoute>
                    <DashboardAnunciante />
                  </AnuncianteRoute>
                }
              />

              {/* Rotas Protegidas - Parceiro */}
              <Route
                path="/dashboard/parceiro"
                element={
                  <ParceiroRoute>
                    <DashboardParceiro />
                  </ParceiroRoute>
                }
              />

              {/* Rota 404 - Página não encontrada */}
              <Route
                path="*"
                element={
                  <div className="container text-center py-5">
                    <h1>404 - Página não encontrada</h1>
                    <p>A página que você está procurando não existe.</p>
                    <a href="/" className="btn btn-primary">
                      Voltar ao Início
                    </a>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </TransitionWrapper>
    </SubscriptionProvider>
  );
}

export default App;
