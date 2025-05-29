import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
  return (
    <footer className="py-3 bg-dark text-white text-center">
      <div className="container">
        <ul className="list-unstyled d-flex justify-content-center mb-0">
          <li className="ms-4">
            <a href="/termos" className="text-decoration-none text-white">Termos de uso</a>
          </li>
          <li className="ms-4">
            <a href="/contato" className="text-decoration-none text-white">Contato</a>
          </li>
        </ul>
        <div className="mt-3">
          <a href="https://instagram.com/pataformapet" className="text-decoration-none text-white me-3">Instagram</a>
          <a href="https://www.youtube.com/@Pataformapet" className="text-decoration-none text-white">Youtube</a>
        </div>
        <p className="mt-3 mb-0">&copy; 2025 Pataforma. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
