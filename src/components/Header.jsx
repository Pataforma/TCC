import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from '../assets/imgs/logo.png';
import Button from './Button';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleAuthClick = () => {
    navigate('/login');
  };

  return (
    <header className="position-fixed top-0 start-0 w-100 py-2 header bg-main">
      <div className="container d-flex justify-content-between align-items-center py-2">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="ms-2 text-white" style={{ fontSize: "1.8rem" }}>Pataforma</h1>
        </div>
        <nav>
          <ul className="d-flex list-unstyled mb-0">
            <li className="ms-4">
              <Link 
                to="/" 
                className={`text-decoration-none fs-5 nav-link ${isActive('/') ? 'active' : ''}`}
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
        <Button 
          text="Login / Cadastro" 
          bgColor="var(--secondary-color)" 
          hoverColor="var(--elements-color)" 
          textColor="white"
          className="ms-2"
          onClick={handleAuthClick}
        />
      </div>
    </header>
  );
}

export default Header;
