import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/supabase";
import logo from "../assets/imgs/logo.png";
import HeaderActions from "../components/ui/HeaderActions";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaPaw,
  FaPlus,
  FaList,
  FaCalendarAlt,
  FaUsers,
  FaChartBar,
  FaMoneyBill,
  FaBullhorn,
  FaStore,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaArrowLeft,
  FaBox,
  FaFileMedical,
  FaBell,
  FaComments,
  FaSyringe,
  FaMapMarkerAlt,
} from "react-icons/fa";

const DashboardLayout = ({ children, tipoUsuario, nomeUsuario }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Menus dinâmicos por tipo de usuário (removido "Meu Perfil" da sidebar)
  const menus = {
    veterinario: [
      { label: "Dashboard", to: "/dashboard/veterinario", icon: FaHome },
      {
        label: "Agenda",
        to: "/dashboard/veterinario/agenda",
        icon: FaCalendarAlt,
      },
      {
        label: "Pacientes",
        to: "/dashboard/veterinario/pacientes",
        icon: FaUsers,
      },
      {
        label: "Estoque",
        to: "/inventory",
        icon: FaBox,
        badge: "2",
        badgeVariant: "warning",
      },
      {
        label: "Financeiro",
        to: "/finance",
        icon: FaMoneyBill,
      },
      {
        label: "Marketing",
        to: "/marketing",
        icon: FaBullhorn,
      },
      {
        label: "Chat",
        to: "/chat",
        icon: FaComments,
        badge: "5",
        badgeVariant: "danger",
      },
      {
        label: "Notificações",
        to: "/notifications",
        icon: FaBell,
        badge: "3",
        badgeVariant: "primary",
      },
    ],
    tutor: [
      { label: "Dashboard", to: "/dashboard/tutor", icon: FaHome },
      { label: "Meus Pets", to: "/tutor/pet", icon: FaPaw },
      { label: "Agendamentos", to: "/tutor/agendamentos", icon: FaCalendarAlt },
      { label: "Vacinas", to: "/tutor/vacinas", icon: FaSyringe },
      {
        label: "Financeiro",
        to: "/tutor/financeiro",
        icon: FaMoneyBill,
      },
      { label: "Serviços Locais", to: "/tutor/servicos", icon: FaMapMarkerAlt },
      {
        label: "Mensagens",
        to: "/tutor/mensagens",
        icon: FaComments,
        badge: "3",
        badgeVariant: "danger",
      },
      {
        label: "Cadastrar Pet Perdido",
        to: "/tutor/pet-perdido",
        icon: FaPlus,
      },
      { label: "Adotar Pet", to: "/tutor/adotar-pet", icon: FaHeart },
    ],
    anunciante: [
      { label: "Dashboard", to: "/dashboard/anunciante", icon: FaHome },
      {
        label: "Meus Eventos",
        to: "/dashboard/anunciante/meus-eventos",
        icon: FaCalendarAlt,
      },
      {
        label: "Novo Evento",
        to: "/dashboard/anunciante/novo-evento",
        icon: FaPlus,
      },
      {
        label: "Financeiro",
        to: "/dashboard/anunciante/financeiro",
        icon: FaMoneyBill,
      },
    ],
    parceiro: [
      { label: "Dashboard", to: "/dashboard/parceiro", icon: FaHome },
      {
        label: "Meu Perfil Público",
        to: "/dashboard/parceiro/perfil",
        icon: FaUser,
      },
      {
        label: "Meus Serviços",
        to: "/dashboard/parceiro/servicos",
        icon: FaList,
      },
      {
        label: "Meus Produtos",
        to: "/dashboard/parceiro/produtos",
        icon: FaStore,
      },
      {
        label: "Avaliações",
        to: "/dashboard/parceiro/avaliacoes",
        icon: FaChartBar,
      },
      {
        label: "Financeiro",
        to: "/dashboard/parceiro/financeiro",
        icon: FaMoneyBill,
      },
    ],
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isActiveRoute = (route) => {
    // Verifica se a rota atual é exatamente igual ou se é uma sub-rota
    if (location.pathname === route) return true;

    // Para rotas específicas que podem ter parâmetros
    if (route === "/patients/:id" && location.pathname.startsWith("/patients/"))
      return true;
    if (
      route === "/prontuario/:id" &&
      location.pathname.startsWith("/prontuario/")
    )
      return true;

    return false;
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar Desktop */}
      <nav
        className="d-none d-lg-flex flex-column position-fixed top-0 start-0 h-100 bg-white shadow-sm"
        style={{
          width: 280,
          zIndex: 1040,
          borderRight: "1px solid #e9ecef",
        }}
      >
        {/* Logo e Header do Sidebar */}
        <div className="p-4 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              style={{ height: 40, borderRadius: 8 }}
            />
            <span className="fw-bold fs-5 text-main">Pataforma</span>
          </div>
        </div>

        {/* Menu de Navegação */}
        <div className="flex-grow-1 p-3">
          <div className="d-flex flex-column gap-2">
            {menus[tipoUsuario]?.map((item, idx) => {
              const active = isActiveRoute(item.to);
              const Icon = item.icon;
              return (
                <button
                  key={item.to}
                  className={`btn d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start w-100 ${
                    active
                      ? "bg-main text-white shadow-sm"
                      : "bg-transparent text-dark hover-bg-light"
                  }`}
                  style={{
                    fontSize: 15,
                    fontWeight: active ? 600 : 500,
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => navigate(item.to)}
                  title={item.label}
                  aria-label={`Navegar para ${item.label}`}
                >
                  <Icon size={18} />
                  <span className="flex-grow-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`badge rounded-pill ${
                        item.badgeVariant === "warning"
                          ? "bg-warning text-dark"
                          : item.badgeVariant === "danger"
                          ? "bg-danger"
                          : "bg-primary"
                      }`}
                      style={{ fontSize: "10px" }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Sidebar Mobile */}
      <nav
        className={`d-lg-none position-fixed top-0 start-0 h-100 bg-white shadow-lg`}
        style={{
          width: 280,
          zIndex: 2000,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* Header Mobile */}
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              style={{ height: 35, borderRadius: 8 }}
            />
            <span className="fw-bold fs-6 text-main">Pataforma</span>
          </div>
          <button
            className="btn btn-link text-muted p-0"
            onClick={closeSidebar}
            aria-label="Fechar menu lateral"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Menu Mobile */}
        <div className="flex-grow-1 p-3">
          <div className="d-flex flex-column gap-2">
            {menus[tipoUsuario]?.map((item, idx) => {
              const active = isActiveRoute(item.to);
              const Icon = item.icon;
              return (
                <button
                  key={item.to}
                  className={`btn d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start w-100 ${
                    active
                      ? "bg-main text-white shadow-sm"
                      : "bg-transparent text-dark"
                  }`}
                  style={{
                    fontSize: 15,
                    fontWeight: active ? 600 : 500,
                  }}
                  onClick={() => {
                    navigate(item.to);
                    closeSidebar();
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1999 }}
          onClick={closeSidebar}
        />
      )}

      {/* Conteúdo principal */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: 280, minHeight: "100vh" }}
      >
        {/* Header Principal */}
        <header
          className="d-flex align-items-center justify-content-between p-3 bg-white shadow-sm sticky-top"
          style={{ zIndex: 1050 }}
        >
          {/* Lado esquerdo - Botão menu mobile e título */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-secondary d-lg-none d-flex align-items-center gap-2"
              onClick={toggleSidebar}
              style={{ fontSize: 15 }}
              aria-label="Abrir menu lateral"
            >
              <FaBars />
            </button>

            <button
              className="btn btn-outline-secondary d-none d-lg-flex align-items-center gap-2"
              onClick={() => navigate("/tipo-usuario")}
              style={{ fontSize: 15 }}
            >
              <FaArrowLeft /> Voltar para escolha de perfil
            </button>

            <span className="fw-bold d-lg-none">Pataforma</span>
          </div>

          {/* Lado direito - Ações do header */}
          <HeaderActions tipoUsuario={tipoUsuario} nomeUsuario={nomeUsuario} />
        </header>

        {/* Conteúdo da página */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
