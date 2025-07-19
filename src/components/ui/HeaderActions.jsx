import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import { useUser } from "../../contexts/UserContext";
import NotificationsDropdown from "./NotificationsDropdown";
import SupportModal from "./SupportModal";
import { FaQuestionCircle, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";

const HeaderActions = ({ tipoUsuario, nomeUsuario }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Rotas de perfil por tipo de usuário
  const perfilRoutes = {
    veterinario: "/veterinario/perfil",
    tutor: "/tutor/perfil",
    anunciante: "/anunciante/perfil",
    parceiro: "/parceiro/perfil",
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/telalogin");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleProfileClick = () => {
    const profileRoute = perfilRoutes[tipoUsuario];
    if (profileRoute) {
      navigate(profileRoute);
    }
  };

  const handleSupportClick = () => {
    setShowSupportModal(true);
  };

  const getUserInitials = () => {
    if (nomeUsuario) {
      return nomeUsuario
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.nome) {
      return user.nome
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    return nomeUsuario || user?.nome || user?.email?.split("@")[0] || "Usuário";
  };

  return (
    <>
      <div className="d-flex align-items-center gap-3">
        {/* Ícone de Suporte */}
        <button
          className="btn btn-link text-muted p-2 position-relative"
          onClick={handleSupportClick}
          title="Suporte"
          style={{ textDecoration: "none" }}
        >
          <FaQuestionCircle size={20} />
        </button>

        {/* Dropdown de Notificações */}
        <NotificationsDropdown />

        {/* Dropdown de Perfil */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="link"
            className="btn btn-link text-dark p-0 d-flex align-items-center gap-2"
            style={{ textDecoration: "none" }}
          >
            {/* Avatar */}
            <div
              className="bg-main d-flex align-items-center justify-content-center text-white rounded-circle"
              style={{
                width: 40,
                height: 40,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {getUserInitials()}
            </div>

            {/* Nome do usuário (oculto em telas pequenas) */}
            <span className="d-none d-md-block fw-semibold">
              {getDisplayName()}
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu
            className="shadow-lg border-0"
            style={{ minWidth: 200 }}
          >
            <Dropdown.Header className="fw-bold text-dark">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-main d-flex align-items-center justify-content-center text-white rounded-circle"
                  style={{
                    width: 32,
                    height: 32,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {getUserInitials()}
                </div>
                <div>
                  <div className="fw-bold">{getDisplayName()}</div>
                  <small className="text-muted">
                    {tipoUsuario?.charAt(0).toUpperCase() +
                      tipoUsuario?.slice(1)}
                  </small>
                </div>
              </div>
            </Dropdown.Header>

            <Dropdown.Divider />

            <Dropdown.Item onClick={handleProfileClick}>
              <FaUser className="me-2" />
              Meu Perfil
            </Dropdown.Item>

            <Dropdown.Item onClick={() => navigate("/configuracoes")}>
              <FaCog className="me-2" />
              Configurações
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item onClick={handleLogout} className="text-danger">
              <FaSignOutAlt className="me-2" />
              Sair
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Modal de Suporte */}
      <SupportModal
        show={showSupportModal}
        onHide={() => setShowSupportModal(false)}
      />
    </>
  );
};

export default HeaderActions;
