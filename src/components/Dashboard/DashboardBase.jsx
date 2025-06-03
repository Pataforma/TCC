import React from "react";
import styles from "./DashboardBase.module.css";

const DashboardBase = ({ children, titulo, tipoUsuario }) => {
  // Ajustar rotas de perfil para cada tipo
  const perfilRoutes = {
    veterinario: "/veterinario/perfil",
    tutor: "/tutor/perfil",
    anunciante: "/anunciante/perfil",
    parceiro: "/parceiro/perfil",
  };
  return (
    <div
      className={styles.dashboardContainer + " d-flex flex-column flex-grow-1"}
    >
      <header className={styles.header}>
        <h1>{titulo}</h1>
        <div className={styles.userInfo}>
          <span>Bem-vindo(a)!</span>
        </div>
      </header>

      <div className={styles.content + " flex-grow-1"}>
        <nav className={styles.sidebar}>
          <ul className={styles.menu}>
            <li>
              <a href={perfilRoutes[tipoUsuario] || "/"}>
                <i className="fas fa-user"></i>
                Meu Perfil
              </a>
            </li>
            {tipoUsuario === "veterinario" && (
              <li>
                <a href="/dashboard/veterinario/blog">
                  <i className="fas fa-blog"></i>
                  Blog
                </a>
              </li>
            )}
            {tipoUsuario === "tutor" && (
              <li>
                <a href="/tutor/pet">
                  <i className="fas fa-paw"></i>
                  Meus Pets
                </a>
              </li>
            )}
            {tipoUsuario === "anunciante" && (
              <li>
                <a href="/dashboard/anunciante/eventos">
                  <i className="fas fa-calendar-alt"></i>
                  Meus Eventos
                </a>
              </li>
            )}
            {tipoUsuario === "parceiro" && (
              <li>
                <a href="/dashboard/parceiro/recursos">
                  <i className="fas fa-tools"></i>
                  Recursos
                </a>
              </li>
            )}
          </ul>
        </nav>

        <main className={styles.mainContent + " flex-grow-1"}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardBase;
