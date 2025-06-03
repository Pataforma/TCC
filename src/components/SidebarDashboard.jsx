import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaPaw, FaPlus, FaList, FaHome } from "react-icons/fa";

const SidebarDashboard = ({ tipoUsuario, open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Menus dinâmicos por tipo
  const menus = {
    tutor: [
      { label: "Dashboard", to: "/dashboard/tutor", icon: FaHome },
      { label: "Meu Perfil", to: "/tutor/perfil", icon: FaUser },
      { label: "Meus Pets", to: "/tutor/pet", icon: FaPaw },
      {
        label: "Cadastrar Pet Perdido",
        to: "/tutor/pet-perdido",
        icon: FaPlus,
      },
      { label: "Adotar Pet", to: "/adocao", icon: FaList },
    ],
    veterinario: [
      { label: "Dashboard", to: "/dashboard/veterinario", icon: FaHome },
      { label: "Meu Perfil", to: "/veterinario/perfil", icon: FaUser },
      { label: "Blog", to: "/dashboard/veterinario/blog", icon: FaList },
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
    ],
    parceiro: [
      { label: "Dashboard", to: "/dashboard/parceiro", icon: FaHome },
      { label: "Recursos", to: "/dashboard/parceiro/recursos", icon: FaList },
    ],
  };

  // Função para cor do ícone
  const getIconColor = (active, idx) => {
    if (active) return "#fff";
    // Paleta: alterna entre azul e laranja para tutor
    if (tipoUsuario === "tutor") {
      const colors = ["#4a90e2", "#fa745a", "#4a90e2", "#fa745a", "#4a90e2"];
      return colors[idx % colors.length];
    }
    return "#4a90e2";
  };

  // Sidebar desktop (sempre visível)
  const renderSidebarDesktop = () => (
    <nav
      className="sidebar-dashboard d-none d-md-flex flex-column p-3 position-fixed top-0 start-0 h-100 bg-white shadow"
      style={{
        width: 240,
        zIndex: 1090,
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: "2px 0 12px rgba(74,144,226,0.07)",
      }}
    >
      <div className="d-flex flex-column gap-3 mt-4">
        {menus[tipoUsuario]?.map((item, idx) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <button
              key={item.to}
              className={`btn d-flex align-items-center gap-3 px-4 py-2 rounded-4 shadow-sm border-0 ${
                active ? "bg-main text-white" : "bg-light text-main"
              }`}
              style={{
                fontSize: 17,
                transition: "all 0.2s",
                boxShadow: active ? "0 2px 8px #fa745a33" : "none",
                fontWeight: 400,
              }}
              onClick={() => navigate(item.to)}
            >
              <Icon color={getIconColor(active, idx)} size={20} /> {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );

  // Sidebar mobile (drawer)
  const renderSidebarMobile = () => (
    <>
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-md-none"
          style={{ zIndex: 1999 }}
          onClick={onClose}
        ></div>
      )}
      <nav
        className={`sidebar-dashboard d-flex flex-column p-3 position-fixed top-0 start-0 h-100 bg-white shadow d-md-none${
          open ? " show" : ""
        }`}
        style={{
          width: 240,
          zIndex: 2000,
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          boxShadow: "2px 0 12px rgba(74,144,226,0.07)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s",
        }}
      >
        <button
          className="btn btn-link text-main align-self-end mb-2"
          style={{ fontSize: 22 }}
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="d-flex flex-column gap-3 mt-2">
          {menus[tipoUsuario]?.map((item, idx) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <button
                key={item.to}
                className={`btn d-flex align-items-center gap-3 px-4 py-2 rounded-4 shadow-sm border-0 ${
                  active ? "bg-main text-white" : "bg-light text-main"
                }`}
                style={{
                  fontSize: 17,
                  transition: "all 0.2s",
                  boxShadow: active ? "0 2px 8px #fa745a33" : "none",
                  fontWeight: 400,
                }}
                onClick={() => {
                  onClose();
                  navigate(item.to);
                }}
              >
                <Icon color={getIconColor(active, idx)} size={20} />{" "}
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );

  return (
    <>
      {renderSidebarDesktop()}
      {renderSidebarMobile()}
    </>
  );
};

export default SidebarDashboard;
