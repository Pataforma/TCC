import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/imgs/logo.png";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuthClick = () => {
    navigate("/telalogin");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // CSS inline para garantir cor branca e sem borda
  const navLinkStyle = {
    color: "white",
    fontWeight: 500,
    transition: "color 0.3s",
    position: "relative",
  };
  const navLinkHoverStyle = {
    color: "var(--secondary-color)",
  };

  return (
    <header
      className="position-fixed top-0 start-0 w-100 py-2 header bg-main"
      style={{ zIndex: 1050, boxShadow: "none", borderBottom: "none" }}
    >
      <div className="container d-flex justify-content-between align-items-center py-2">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="ms-2 text-white" style={{ fontSize: "1.8rem" }}>
            Pataforma
          </h1>
        </div>
        {/* Hamburger menu button for mobile */}
        <button
          className="d-lg-none btn btn-outline-light border-0"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon d-flex justify-content-center align-items-center">
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
          </span>
        </button>
        {/* Navigation - sempre visível */}
        <nav className="d-none d-lg-block">
          <ul className="d-flex list-unstyled mb-0">
            {[
              { to: "/", label: "Início" },
              { to: "/sobre", label: "Sobre" },
              { to: "/veterinarios", label: "Veterinários" },
              { to: "/animais", label: "Animais" },
              // { to: "/produto", label: "Nosso Produto" },
              { to: "/planos", label: "Planos" },
              { to: "/duvidas", label: "Dúvidas" },
              { to: "/agenda", label: "Agenda" },
              { to: "/contato", label: "Contato" },
            ].map((item) => (
              <li className="ms-4" key={item.to}>
                <Link
                  to={item.to}
                  className="text-decoration-none fs-5 nav-link"
                  style={navLinkStyle}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = "var(--secondary-color)")
                  }
                  onMouseOut={(e) => (e.currentTarget.style.color = "white")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Menu mobile sempre visível em telas pequenas */}
        <nav
          className={`d-lg-none mobile-menu bg-main py-3 ${
            menuOpen ? "show" : ""
          }`}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            zIndex: 1000,
            transition: "transform 0.3s ease-in-out",
            transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
            opacity: menuOpen ? 1 : 0,
            visibility: menuOpen ? "visible" : "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ul className="list-unstyled px-3 mb-3">
            {[
              { to: "/", label: "Início" },
              { to: "/sobre", label: "Sobre" },
              { to: "/veterinarios", label: "Veterinários" },
              { to: "/animais", label: "Animais" },
              { to: "/produto", label: "Nosso Produto" },
              { to: "/planos", label: "Planos" },
              { to: "/duvidas", label: "Dúvidas" },
              { to: "/agenda", label: "Agenda" },
              { to: "/contato", label: "Contato" },
            ].map((item) => (
              <li className="py-2 border-bottom border-light" key={item.to}>
                <Link
                  to={item.to}
                  className="text-decoration-none nav-link fs-5 d-block"
                  style={navLinkStyle}
                  onClick={() => setMenuOpen(false)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = "var(--secondary-color)")
                  }
                  onMouseOut={(e) => (e.currentTarget.style.color = "white")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="d-none d-lg-block">
          <span
            className="material-symbols-outlined ms-2"
            style={{
              fontSize: "32px",
              color: "white",
              cursor: "pointer",
              backgroundColor: "var(--secondary-color)",
              padding: "8px",
              borderRadius: "50%",
            }}
            onClick={handleAuthClick}
          >
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
