import React from "react";

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
          <a href="https://facebook.com" className="text-decoration-none text-white me-3">Facebook</a>
          <a href="https://instagram.com" className="text-decoration-none text-white me-3">Instagram</a>
          <a href="https://twitter.com" className="text-decoration-none text-white">Twitter</a>
        </div>
        <p className="mt-3 mb-0">&copy; 2024 Plataforma. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
