import React, { useState } from "react";
import styles from "./FormularioPergunta.module.css";

export default function FormularioPergunta({ onClose }) {
  const [formData, setFormData] = useState({
    pergunta: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: POST question to backend for moderation
    console.log("Enviando pergunta:", formData);

    // Simular delay de envio
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Obrigado! Sua pergunta foi enviada para moderação.");
      onClose();
    }, 1500);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Faça sua pergunta</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="pergunta" className={styles.label}>
              Sua pergunta *
            </label>
            <textarea
              id="pergunta"
              name="pergunta"
              value={formData.pergunta}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Descreva sua dúvida sobre a saúde do seu pet de forma clara e detalhada..."
              rows="6"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              E-mail (opcional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Seu e-mail para receber notificações"
            />
            <small className={styles.helpText}>
              Receberemos notificação quando sua pergunta for respondida
            </small>
          </div>

          <div className={styles.diretrizes}>
            <h5>Diretrizes importantes:</h5>
            <ul>
              <li>✓ Sua pergunta será publicada de forma anônima</li>
              <li>✓ As respostas não substituem uma consulta veterinária</li>
              <li>✓ Evite casos específicos que precisam de exame clínico</li>
              <li>✓ Não inclua informações pessoais ou do seu pet</li>
              <li>✓ Perguntas serão moderadas antes da publicação</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnCancelar}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnEnviar}
              disabled={isSubmitting || !formData.pergunta.trim()}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Enviando...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Enviar Pergunta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
