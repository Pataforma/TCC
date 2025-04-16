const Navbar = () => {
    return (
      <nav className="navbar navbar-expand-lg bg-main">
        <div className="container px-5">
          <a className="navbar-brand d-flex align-items-center text-white" href="#">
            <img src="/imgs/logo.png" alt="logo" height="40" className="me-2" />
            <h2 className="mb-0 fs-4">Pataforma</h2>
          </a>
          <button
            className="navbar-toggler bg-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link text-white" href="#">Home</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="sobrenos.html">Sobre nós</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="#">Como ajudar</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="#">Veterinários</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="#">Contato</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="#">Login</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  