import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ui/ScrollToTop";
import LoadingTransition from "./components/ui/LoadingTransition";
import NotFoundPage from "./components/ui/NotFoundPage";
import {
  TutorRoute,
  VeterinarioRoute,
  AnuncianteRoute,
  ParceiroRoute,
  PublicRoute,
} from "./features/authentication/components/AuthGuard";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";

// --- LAZY LOADING DAS PÁGINAS ---

// 1. Páginas Públicas e Institucionais
const Home = lazy(() => import("./pages/Home"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Veterinarios = lazy(() => import("./pages/Veterinarios"));
const Produto = lazy(() => import("./pages/Produto"));
const Agenda = lazy(() => import("./pages/Agenda")); // Nota: Pode ser movida para uma feature no futuro
const Contato = lazy(() => import("./pages/Contato"));
const Termos = lazy(() => import("./pages/Termos"));
const LoadingPage = lazy(() => import("./pages/LoadingPage")); // Página de carregamento genérica

// 2. Feature: Autenticação
const TelaLogin = lazy(() =>
  import("./features/authentication/pages/TelaLogin")
);
const TipoUsuario = lazy(() =>
  import("./features/authentication/pages/TipoUsuario")
);
const AuthCallback = lazy(() =>
  import("./features/authentication/pages/AuthCallback")
);
const UnauthorizedPage = lazy(() =>
  import("./features/authentication/pages/UnauthorizedPage")
);

// 3. Feature: Onboarding
const OnboardingVeterinario = lazy(() =>
  import("./features/onboarding/OnboardingVeterinario")
);
const OnboardingTutor = lazy(() =>
  import("./features/onboarding/OnboardingTutor")
);
const OnboardingAnunciante = lazy(() =>
  import("./features/onboarding/OnboardingAnunciante")
);
const OnboardingParceiro = lazy(() =>
  import("./features/onboarding/OnboardingParceiro")
);

// 4. Feature: Dashboard do Tutor
const DashboardTutor = lazy(() =>
  import("./features/tutor-dashboard/pages/DashboardTutor")
);
const DashboardTutorPerfil = lazy(() =>
  import("./features/tutor-dashboard/pages/DashboardTutorPerfil")
);
const DashboardTutorPet = lazy(() =>
  import("./features/tutor-dashboard/pages/DashboardTutorPet")
);
const DashboardTutorFinanceiro = lazy(() =>
  import("./features/tutor-dashboard/pages/DashboardTutorFinanceiro")
);
const DashboardTutorPetPerdido = lazy(() =>
  import("./features/tutor-dashboard/pages/DashboardTutorPetPerdido")
);
const DashboardTutorAdotarPet = lazy(() =>
  import("./features/tutor-dashboard/pages/DashboardTutorAdotarPet")
);
const AgendamentosPage = lazy(() =>
  import("./features/tutor-dashboard/pages/AgendamentosPage")
);
const VacinasPage = lazy(() =>
  import("./features/tutor-dashboard/pages/VacinasPage")
);
const ServicosPage = lazy(() =>
  import("./features/tutor-dashboard/pages/ServicosPage")
);
const MensagensPage = lazy(() =>
  import("./features/tutor-dashboard/pages/MensagensPage")
);

// 5. Feature: Dashboard do Veterinário
const DashboardVeterinario = lazy(() =>
  import("./features/vet-dashboard/pages/DashboardVeterinario")
);
const DashboardVeterinarioAgenda = lazy(() =>
  import("./features/vet-dashboard/pages/DashboardVeterinarioAgenda")
);
const DashboardVeterinarioPacientes = lazy(() =>
  import("./features/vet-dashboard/pages/DashboardVeterinarioPacientes")
);
const VeterinarioPerfil = lazy(() =>
  import("./features/vet-dashboard/pages/VeterinarioPerfil")
);
const ProntuarioPage = lazy(() =>
  import("./features/vet-dashboard/pages/ProntuarioPage")
);
const EstoquePage = lazy(() =>
  import("./features/vet-dashboard/pages/EstoquePage")
);
const FinanceiroPage = lazy(() =>
  import("./features/vet-dashboard/pages/FinanceiroPage")
);
const MarketingPage = lazy(() =>
  import("./features/vet-dashboard/pages/MarketingPage")
);
const ChatPage = lazy(() => import("./features/vet-dashboard/pages/ChatPage"));
const PainelDuvidasVet = lazy(() =>
  import("./features/vet-dashboard/pages/PainelDuvidasVet")
);

// 6. Feature: Dashboard do Anunciante
const DashboardAnunciante = lazy(() =>
  import("./features/anunciante-dashboard/pages/DashboardAnunciante")
);
const FinanceiroAnunciante = lazy(() =>
  import("./features/anunciante-dashboard/pages/FinanceiroAnunciante")
);
const MeusEventos = lazy(() =>
  import("./features/anunciante-dashboard/pages/MeusEventos")
);
const GestaoCampanhas = lazy(() =>
  import("./features/anunciante-dashboard/pages/GestaoCampanhas")
);
const CriacaoAnuncio = lazy(() =>
  import("./features/anunciante-dashboard/pages/CriacaoAnuncio")
);
const CriacaoAnuncioDemo = lazy(() =>
  import("./features/anunciante-dashboard/pages/CriacaoAnuncioDemo")
);
const OrcamentoDuracao = lazy(() =>
  import("./features/anunciante-dashboard/pages/OrcamentoDuracao")
);
const OrcamentoDuracaoDemo = lazy(() =>
  import("./features/anunciante-dashboard/pages/OrcamentoDuracaoDemo")
);

// 7. Feature: Dashboard do Parceiro (ONG)
const DashboardParceiroCausa = lazy(() =>
  import("./features/parceiro-dashboard/pages/DashboardParceiroCausa")
);
const GestaoAnimaisCausa = lazy(() =>
  import("./features/parceiro-dashboard/pages/GestaoAnimaisCausa")
);

// 8. Feature: Dashboard do Parceiro de Serviço
const DashboardParceiroServico = lazy(() =>
  import("./features/parceiro-dashboard/pages/DashboardParceiroServico")
);
const GestaoServicos = lazy(() =>
  import("./features/parceiro-dashboard/pages/GestaoServicos")
);
const GestaoAvaliacoes = lazy(() =>
  import("./features/parceiro-dashboard/pages/GestaoAvaliacoes")
);

// 9. Roteador de Dashboards do Parceiro
const DashboardParceiroRouter = lazy(() =>
  import("./features/parceiro-dashboard/pages/DashboardParceiroRouter")
);

// 8. Outras Features Públicas
const Animais = lazy(() => import("./features/pets/pages/Animais")); // Adoção/Perdidos público
const PlanosPage = lazy(() => import("./features/plans/pages/PlanosPage"));
const DuvidasPage = lazy(() => import("./features/q_and_a/pages/DuvidasPage"));

// Componente de fallback para o Suspense
const PageLoader = () => (
  <LoadingTransition timeout={500} message="Carregando..." />
);

function App() {
  const location = useLocation();

  return (
    <SubscriptionProvider>
      <ScrollToTop />
      <div key={location.pathname} className="fade-in">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            {/* --- ROTAS PÚBLICAS --- */}
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

            {/* --- ROTAS DE ONBOARDING --- */}
            <Route
              path="/onboarding/veterinario"
              element={<OnboardingVeterinario />}
            />
            <Route path="/onboarding/tutor" element={<OnboardingTutor />} />
            <Route
              path="/onboarding/anunciante"
              element={<OnboardingAnunciante />}
            />
            <Route
              path="/onboarding/parceiro"
              element={<OnboardingParceiro />}
            />

            {/* --- ROTAS PROTEGIDAS - TUTOR --- */}
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
              path="/tutor/financeiro"
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

            {/* --- ROTAS PROTEGIDAS - VETERINÁRIO --- */}
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
              path="/veterinario/duvidas"
              element={
                <VeterinarioRoute>
                  <PainelDuvidasVet />
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

            {/* --- ROTAS PROTEGIDAS - ANUNCIANTE --- */}
            <Route
              path="/dashboard/anunciante"
              element={
                <AnuncianteRoute>
                  <DashboardAnunciante />
                </AnuncianteRoute>
              }
            />
            <Route
              path="/anunciante/criar-campanha"
              element={
                <AnuncianteRoute>
                  <CriacaoAnuncio />
                </AnuncianteRoute>
              }
            />
            <Route
              path="/anunciante/gestao-campanhas"
              element={
                <AnuncianteRoute>
                  <GestaoCampanhas />
                </AnuncianteRoute>
              }
            />
            <Route
              path="/anunciante/orcamento-duracao"
              element={
                <AnuncianteRoute>
                  <OrcamentoDuracao />
                </AnuncianteRoute>
              }
            />
            <Route
              path="/dashboard/anunciante/financeiro"
              element={
                <AnuncianteRoute>
                  <FinanceiroAnunciante />
                </AnuncianteRoute>
              }
            />
            <Route
              path="/dashboard/anunciante/meus-eventos"
              element={
                <AnuncianteRoute>
                  <MeusEventos />
                </AnuncianteRoute>
              }
            />
            <Route
              path="/dashboard/anunciante/novo-evento"
              element={
                <AnuncianteRoute>
                  <CriacaoAnuncio />
                </AnuncianteRoute>
              }
            />

            {/* --- ROTAS PROTEGIDAS - PARCEIRO --- */}
            <Route
              path="/dashboard/parceiro/*"
              element={
                <ParceiroRoute>
                  <DashboardParceiroRouter />
                </ParceiroRoute>
              }
            />

            {/* --- ROTA 404 - PÁGINA NÃO ENCONTRADA --- */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </SubscriptionProvider>
  );
}

export default App;
