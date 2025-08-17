import React from "react";
import styles from "./DashboardBase.module.css";

const DashboardBase = ({ children, titulo, tipoUsuario }) => {
  // Ajustar rotas de perfil para cada tipo
  const perfilRoutes = {
    veterinario: "/dashboard/veterinario/perfil",
    tutor: "/dashboard/tutor/perfil",
    anunciante: "/dashboard/anunciante/perfil",
    parceiro: "/dashboard/parceiro/perfil",
  };
  return (
    <div
      className={`${styles.dashboardContainer} d-flex flex-column min-vh-100`}
    >
      <header
        className={`${styles.header} d-flex justify-content-between align-items-center p-4`}
      >
        <h1 className={styles.title}>{titulo}</h1>
        <div className={`${styles.userInfo} d-flex align-items-center gap-3`}>
          <span>Bem-vindo(a)!</span>
        </div>
      </header>

      <div className="d-flex flex-grow-1">
        <nav className={`${styles.sidebar} bg-white`}>
          <ul className={`${styles.menu} list-unstyled mb-0`}>
            <li className="mb-2">
              <a
                href={perfilRoutes[tipoUsuario] || "/"}
                className={`${styles.menuLink} d-flex align-items-center px-4 py-3`}
              >
                <i className="fas fa-user me-3"></i>
                Meu Perfil
              </a>
            </li>
            {tipoUsuario === "veterinario" && (
              <li className="mb-2">
                <a
                  href="/dashboard/veterinario/blog"
                  className={`${styles.menuLink} d-flex align-items-center px-4 py-3`}
                >
                  <i className="fas fa-blog me-3"></i>
                  Blog
                </a>
              </li>
            )}
            {tipoUsuario === "tutor" && (
              <li className="mb-2">
                <a
                  href="/dashboard/tutor/meus-pets"
                  className={`${styles.menuLink} d-flex align-items-center px-4 py-3`}
                >
                  <i className="fas fa-paw me-3"></i>
                  Meus Pets
                </a>
              </li>
            )}
            {tipoUsuario === "anunciante" && (
              <li className="mb-2">
                <a
                  href="/dashboard/anunciante/eventos"
                  className={`${styles.menuLink} d-flex align-items-center px-4 py-3`}
                >
                  <i className="fas fa-calendar-alt me-3"></i>
                  Meus Eventos
                </a>
              </li>
            )}
            {tipoUsuario === "parceiro" && (
              <li className="mb-2">
                <a
                  href="/dashboard/parceiro/recursos"
                  className={`${styles.menuLink} d-flex align-items-center px-4 py-3`}
                >
                  <i className="fas fa-tools me-3"></i>
                  Recursos
                </a>
              </li>
            )}
          </ul>
        </nav>

        <main className={`${styles.mainContent} flex-grow-1 p-4 bg-light`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardBase;
