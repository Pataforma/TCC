import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EtapaConclusao.module.css";

export default function EtapaConclusao({ data, onComplete }) {
  const navigate = useNavigate();

  const handleGoToDashboard = async () => {
    try {
      // Chamar a função onComplete passada pelo componente pai
      // que é responsável por salvar os dados no backend
      if (onComplete) {
        await onComplete(data);
      } else {
        // Fallback caso onComplete não seja fornecido
        console.log("Dados do onboarding:", data);
        const userType = data.tipoUsuario || "veterinario";
        navigate(`/dashboard/${userType}`);
      }
    } catch (error) {
      console.error("Erro ao finalizar onboarding:", error);
      alert("Erro ao salvar configurações. Tente novamente.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.iconContainer}>
          <i className="fas fa-check-circle"></i>
        </div>

        <h2>Perfil Criado com Sucesso!</h2>
        <p className={styles.subtitle}>
          Parabéns! Seu perfil foi configurado e está pronto para uso.
        </p>

        <div className={styles.summary}>
          <h3>Resumo da Configuração</h3>
          <div className={styles.summaryItem}>
            <i className="fas fa-user"></i>
            <span>
              <strong>Nome:</strong> {data.nomeCompleto}
            </span>
          </div>

          {data.crmv && (
            <div className={styles.summaryItem}>
              <i className="fas fa-id-card"></i>
              <span>
                <strong>CRMV:</strong> {data.crmv}
              </span>
            </div>
          )}

          {data.especialidades && data.especialidades.length > 0 && (
            <div className={styles.summaryItem}>
              <i className="fas fa-stethoscope"></i>
              <span>
                <strong>Especialidades:</strong>{" "}
                {data.especialidades.join(", ")}
              </span>
            </div>
          )}

          {data.nomeClinica && (
            <div className={styles.summaryItem}>
              <i className="fas fa-hospital"></i>
              <span>
                <strong>Clínica:</strong> {data.nomeClinica}
              </span>
            </div>
          )}

          {data.selectedPlan && (
            <div className={styles.summaryItem}>
              <i className="fas fa-crown"></i>
              <span>
                <strong>Plano:</strong> {data.selectedPlan}
              </span>
            </div>
          )}
        </div>

        <div className={styles.nextSteps}>
          <h3>Próximos Passos</h3>
          <ul>
            <li>Configure sua agenda de atendimento</li>
            <li>Adicione seus primeiros pacientes</li>
            <li>Personalize seu perfil público</li>
            <li>Explore as funcionalidades do seu plano</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnDashboard} onClick={handleGoToDashboard}>
            <i className="fas fa-tachometer-alt"></i> Ir para o meu Dashboard
          </button>
        </div>

        <div className={styles.help}>
          <p>
            <i className="fas fa-question-circle"></i>
            Precisa de ajuda? Acesse nosso{" "}
            <a href="/contato" className={styles.link}>
              centro de suporte
            </a>{" "}
            ou{" "}
            <a href="/duvidas" className={styles.link}>
              faça uma pergunta
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
