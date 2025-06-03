import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import logo from "../assets/imgs/logo.png";
import { FaBars } from "react-icons/fa";

const HeaderDashboard = ({ nomeUsuario, onOpenSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/telalogin");
  };

  return (
    <header
      className="bg-main shadow-sm py-2 px-3 position-sticky top-0 w-100"
      style={{ zIndex: 1050 }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-light d-md-none me-2"
            style={{ borderRadius: 12 }}
            onClick={onOpenSidebar}
            aria-label="Abrir menu"
          >
            <FaBars size={22} />
          </button>
          <img src={logo} alt="Logo" style={{ height: 40, borderRadius: 8 }} />
          <span
            className="fw-bold fs-4 text-white"
            style={{ letterSpacing: 1 }}
          >
            Pataforma
          </span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-white d-flex align-items-center justify-content-center"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <i className="fas fa-user text-main" style={{ fontSize: 20 }}></i>
            </div>
            <span
              className="fw-semibold text-white d-none d-md-block"
              style={{ fontSize: 17 }}
            >
              {nomeUsuario}
            </span>
          </div>
          <button
            className="btn btn-light btn-sm px-3 py-1 ms-2 fw-semibold"
            style={{ borderRadius: 20, color: "var(--main-color)" }}
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt me-1"></i> Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
