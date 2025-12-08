import React from "react";
import styles from "./RespostaCard.module.css";

export default function RespostaCard({ resposta, isMelhorResposta = false }) {
  const handleAgendarConsulta = () => {
    // TODO: Redirecionar para página de agendamento do veterinário
    console.log(`Agendando consulta com ${resposta.veterinario.nome}`);
  };

  return (
    <div
      className={`${styles.card} ${
        isMelhorResposta ? styles.melhorResposta : ""
      }`}
    >
      {isMelhorResposta && (
        <div className={styles.badge}>
          <i className="fas fa-star"></i> Melhor Resposta
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.veterinarioInfo}>
          <div className={styles.fotoContainer}>
            <img
              src={resposta.veterinario.foto}
              alt={resposta.veterinario.nome}
              className={styles.foto}
            />
          </div>

          <div className={styles.info}>
            <h5 className={styles.nome}>{resposta.veterinario.nome}</h5>
            <p className={styles.especialidade}>
              {resposta.veterinario.especialidade}
            </p>
            <p className={styles.cidade}>
              <i className="fas fa-map-marker-alt"></i>{" "}
              {resposta.veterinario.cidade}
            </p>
          </div>

          <div className={styles.acoes}>
            <button
              className={styles.btnAgendar}
              onClick={handleAgendarConsulta}
            >
              <i className="fas fa-calendar-plus"></i> Agendar Consulta
            </button>
          </div>
        </div>

        <div className={styles.resposta}>
          <p>{resposta.resposta}</p>
          <div className={styles.meta}>
            <small className="text-muted">
              Respondido em{" "}
              {new Date(resposta.data).toLocaleDateString("pt-BR")}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
