import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/imgs/logo.png';

function Header() {
  return (
    <header className="position-fixed top-0 start-0 w-100 bg-white shadow-sm py-3 header">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="ms-2">Pataforma</h1>
        </div>
        <nav>
          <ul className="d-flex list-unstyled mb-0">
            <li className="ms-4">
              <Link to="/" className="text-decoration-none">Início</Link>
            </li>
            <li className="ms-4">
              <Link to="/sobre" className="text-decoration-none">Sobre</Link>
            </li>
            <li className="ms-4">
              <Link to="/veterinarios" className="text-decoration-none">Veterinários</Link>
            </li>
            <li className="ms-4">
              <Link to="/animais" className="text-decoration-none">Animais</Link>
            </li>
            <li className="ms-4">
              <Link to="/produto" className="text-decoration-none">Nosso Produto</Link>
            </li>
            <li className="ms-4">
              <Link to="/agenda" className="text-decoration-none">Agenda</Link>
            </li>
            <li className="ms-4">
              <Link to="/contato" className="text-decoration-none">Contato</Link>
            </li>
          </ul>
        </nav>
        <button className="btn btn-primary">Login / Cadastro</button>
      </div>
    </header>
  );
}

export default Header;
