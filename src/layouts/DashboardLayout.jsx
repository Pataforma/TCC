import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/supabase";
import logo from "../assets/imgs/logo.png";
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

  // Menus dinâmicos por tipo de usuário
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
      { label: "Meu Perfil", to: "/veterinario/perfil", icon: FaUser },
    ],
    tutor: [
      { label: "Dashboard", to: "/dashboard/tutor", icon: FaHome },
      { label: "Meus Pets", to: "/tutor/pet", icon: FaPaw },
      { label: "Agendamentos", to: "/tutor/agendamentos", icon: FaCalendarAlt },
      { label: "Vacinas", to: "/tutor/vacinas", icon: FaSyringe },
      {
        label: "Financeiro",
        to: "/dashboard/tutor/financeiro",
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
      { label: "Meu Perfil", to: "/tutor/perfil", icon: FaUser },
      {
        label: "Cadastrar Pet Perdido",
        to: "/tutor/pet-perdido",
        icon: FaPlus,
      },
      { label: "Adotar Pet", to: "/adocao", icon: FaHeart },
    ],
    anunciante: [
      { label: "Dashboard", to: "/dashboard/anunciante", icon: FaHome },
      {
        label: "Meus Eventos",
        to: "/dashboard/anunciante/eventos",
        icon: FaList,
      },
      {
        label: "Novo Evento",
        to: "/dashboard/anunciante/novo-evento",
        icon: FaPlus,
      },
      { label: "Meu Perfil", to: "/anunciante/perfil", icon: FaUser },
    ],
    parceiro: [
      { label: "Dashboard", to: "/dashboard/parceiro", icon: FaHome },
      {
        label: "E-commerce",
        to: "/dashboard/parceiro/ecommerce",
        icon: FaStore,
      },
      { label: "Adoções", to: "/dashboard/parceiro/adocoes", icon: FaHeart },
      { label: "Recursos", to: "/dashboard/parceiro/recursos", icon: FaCog },
      { label: "Meu Perfil", to: "/parceiro/perfil", icon: FaUser },
    ],
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/telalogin");
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

        {/* Perfil do Usuário */}
        <div className="p-3 border-top bg-light">
          <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white shadow-sm">
            <div
              className="bg-main d-flex align-items-center justify-content-center text-white"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {nomeUsuario?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-grow-1">
              <div className="fw-semibold text-dark" style={{ fontSize: 14 }}>
                {nomeUsuario || "Usuário"}
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                {tipoUsuario?.charAt(0).toUpperCase() + tipoUsuario?.slice(1)}
              </div>
              <div className="d-flex align-items-center gap-1 mt-1">
                <div
                  className="bg-success"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                  }}
                ></div>
                <small className="text-success" style={{ fontSize: 10 }}>
                  Online
                </small>
              </div>
            </div>
            <button
              className="btn btn-link text-muted p-0"
              onClick={handleLogout}
              title="Sair"
            >
              <FaSignOutAlt size={16} />
            </button>
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

        {/* Perfil Mobile */}
        <div className="p-3 border-top bg-light">
          <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white shadow-sm">
            <div
              className="bg-main d-flex align-items-center justify-content-center text-white"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {nomeUsuario?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-grow-1">
              <div className="fw-semibold text-dark" style={{ fontSize: 14 }}>
                {nomeUsuario || "Usuário"}
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                {tipoUsuario?.charAt(0).toUpperCase() + tipoUsuario?.slice(1)}
              </div>
            </div>
            <button
              className="btn btn-link text-muted p-0"
              onClick={handleLogout}
              title="Sair"
            >
              <FaSignOutAlt size={16} />
            </button>
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
        {/* Header Mobile e Botão Voltar */}
        <div
          className="d-flex align-items-center gap-2 p-3 bg-white shadow-sm sticky-top"
          style={{ zIndex: 1050 }}
        >
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => navigate("/tipo-usuario")}
            style={{ fontSize: 15 }}
          >
            <FaArrowLeft /> Voltar para escolha de perfil
          </button>
          <span className="fw-bold ms-2 d-lg-none">Pataforma</span>
        </div>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
