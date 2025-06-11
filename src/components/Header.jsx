import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from '../assets/imgs/logo.png';
import Botao from './Botao';


function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleAuthClick = () => {
    navigate('/TelaLogin');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="position-fixed top-0 start-0 w-100 py-2 header bg-main">
      <div className="container d-flex justify-content-between align-items-center py-2">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="ms-2 text-white" style={{ fontSize: "1.8rem" }}>Pataforma</h1>
        </div>
        
        {/* Hamburger menu button for mobile */}
        <button 
          className="d-lg-none btn btn-outline-light border-0" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon d-flex justify-content-center align-items-center">
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="d-none d-lg-block">
          <ul className="d-flex list-unstyled mb-0">
            <li className="ms-4">
              <Link 
                to="/" 
                className={`text-decoration-none fs-5 nav-link ${isActive('/home') ? 'active' : ''}`}
              >
                Início
              </Link>
            </li>
            <li className="ms-4">
              <Link 
                to="/sobre" 
                className={`text-decoration-none nav-link fs-5 ${isActive('/sobre') ? 'active' : ''}`}
              >
                Sobre
              </Link>
            </li>
            <li className="ms-4">
              <Link 
                to="/veterinarios" 
                className={`text-decoration-none nav-link fs-5 ${isActive('/veterinarios') ? 'active' : ''}`}
              >
                Veterinários
              </Link>
            </li>
            <li className="ms-4">
              <Link 
                to="/animais" 
                className={`text-decoration-none nav-link fs-5 ${isActive('/animais') ? 'active' : ''}`}
              >
                Animais
              </Link>
            </li>
            <li className="ms-4">
              <Link 
                to="/produto" 
                className={`text-decoration-none nav-link fs-5 ${isActive('/produto') ? 'active' : ''}`}
              >
                Nosso Produto
              </Link>
            </li>
            <li className="ms-4">
              <Link 
                to="/agenda" 
                className={`text-decoration-none nav-link fs-5 ${isActive('/agenda') ? 'active' : ''}`}
              >
                Agenda
              </Link>
            </li>
            <li className="ms-4">
              <Link 
                to="/contato" 
                className={`text-decoration-none nav-link fs-5 ${isActive('/contato') ? 'active' : ''}`}
              >
                Contato
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="d-none d-lg-block">
          <span 
            className="material-symbols-outlined ms-2"
            style={{ 
              fontSize: '32px', 
              color: 'white', 
              cursor: 'pointer',
              backgroundColor: 'var(--secondary-color)',
              padding: '8px',
              borderRadius: '50%'
            }}
            onClick={() => handleAuthClick()}
          >
            account_circle
          </span>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu bg-main py-3 ${menuOpen ? 'show' : ''}`} style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        zIndex: 1000,
        transition: 'transform 0.3s ease-in-out',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        opacity: menuOpen ? 1 : 0,
        visibility: menuOpen ? 'visible' : 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <ul className="list-unstyled px-3 mb-3">
          <li className="py-2 border-bottom border-light">
            <Link 
              to="/" 
              className={`text-decoration-none fs-5 nav-link d-block ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Início
            </Link>
          </li>
          <li className="py-2 border-bottom border-light">
            <Link 
              to="/sobre" 
              className={`text-decoration-none nav-link fs-5 d-block ${isActive('/sobre') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Sobre
            </Link>
          </li>
          <li className="py-2 border-bottom border-light">
            <Link 
              to="/veterinarios" 
              className={`text-decoration-none nav-link fs-5 d-block ${isActive('/veterinarios') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Veterinários
            </Link>
          </li>
          <li className="py-2 border-bottom border-light">
            <Link 
              to="/animais" 
              className={`text-decoration-none nav-link fs-5 d-block ${isActive('/animais') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Animais
            </Link>
          </li>
          <li className="py-2 border-bottom border-light">
            <Link 
              to="/produto" 
              className={`text-decoration-none nav-link fs-5 d-block ${isActive('/produto') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Nosso Produto
            </Link>
          </li>
          <li className="py-2 border-bottom border-light">
            <Link 
              to="/agenda" 
              className={`text-decoration-none nav-link fs-5 d-block ${isActive('/agenda') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Agenda
            </Link>
          </li>
          <li className="py-2">
            <Link 
              to="/contato" 
              className={`text-decoration-none nav-link fs-5 d-block ${isActive('/contato') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
