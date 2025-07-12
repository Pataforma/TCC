import React, { useState } from 'react';
import styles from './PainelDuvidasVet.module.css';

// Dados mockados de perguntas aguardando resposta
const perguntasAguardando = [
  {
    id: 1,
    pergunta: "Meu gato está espirrando muito e com secreção nasal. É gripe?",
    data: "2024-01-16",
    categoria: "Respiratória",
    prioridade: "Média"
  },
  {
    id: 2,
    pergunta: "Cachorro não quer comer ração, só comida caseira. Como fazer a transição?",
    data: "2024-01-15",
    categoria: "Nutrição",
    prioridade: "Baixa"
  },
  {
    id: 3,
    pergunta: "Pet está com manchas na pele e coçando muito. Pode ser alergia?",
    data: "2024-01-14",
    categoria: "Dermatologia",
    prioridade: "Alta"
  }
];

export default function PainelDuvidasVet() {
  const [selectedPergunta, setSelectedPergunta] = useState(null);
  const [resposta, setResposta] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponder = (pergunta) => {
    setSelectedPergunta(pergunta);
    setResposta('');
  };

  const handleSubmitResposta = async () => {
    if (!resposta.trim()) return;
    
    setIsSubmitting(true);
    
    // TODO: POST resposta to backend
    console.log('Enviando resposta:', {
      perguntaId: selectedPergunta.id,
      resposta: resposta
    });
    
    // Simular delay
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Resposta enviada com sucesso!');
      setSelectedPergunta(null);
      setResposta('');
    }, 1500);
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'Alta': return '#dc3545';
      case 'Média': return '#ffc107';
      case 'Baixa': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Painel de Dúvidas</h2>
        <p>Responda perguntas da comunidade e ajude tutores com seus pets</p>
      </div>

      <div className={styles.content}>
        <div className={styles.perguntasList}>
          <h3>Perguntas Aguardando Resposta</h3>
          
          {perguntasAguardando.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-check-circle"></i>
              <p>Não há perguntas aguardando resposta no momento.</p>
            </div>
          ) : (
            <div className={styles.perguntasGrid}>
              {perguntasAguardando.map((pergunta) => (
                <div key={pergunta.id} className={styles.perguntaCard}>
                  <div className={styles.perguntaHeader}>
                    <span 
                      className={styles.prioridade}
                      style={{ backgroundColor: getPrioridadeColor(pergunta.prioridade) }}
                    >
                      {pergunta.prioridade}
                    </span>
                    <span className={styles.categoria}>{pergunta.categoria}</span>
                  </div>
                  
                  <h4 className={styles.perguntaTitulo}>{pergunta.pergunta}</h4>
                  
                  <div className={styles.perguntaMeta}>
                    <small>
                      <i className="fas fa-calendar"></i> {new Date(pergunta.data).toLocaleDateString('pt-BR')}
                    </small>
                  </div>
                  
                  <button 
                    className={styles.btnResponder}
                    onClick={() => handleResponder(pergunta)}
                  >
                    <i className="fas fa-reply"></i> Responder
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor de Resposta */}
        {selectedPergunta && (
          <div className={styles.respostaEditor}>
            <div className={styles.editorHeader}>
              <h3>Responder Pergunta</h3>
              <button 
                className={styles.btnFechar}
                onClick={() => setSelectedPergunta(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className={styles.perguntaSelecionada}>
              <h4>Pergunta:</h4>
              <p>{selectedPergunta.pergunta}</p>
            </div>
            
            <div className={styles.editorContent}>
              <label htmlFor="resposta" className={styles.label}>
                Sua resposta *
              </label>
              <textarea
                id="resposta"
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                className={styles.textarea}
                placeholder="Escreva sua resposta detalhada e profissional..."
                rows="8"
              />
              
              <div className={styles.diretrizes}>
                <h5>Diretrizes para respostas:</h5>
                <ul>
                  <li>✓ Seja claro e objetivo</li>
                  <li>✓ Use linguagem acessível</li>
                  <li>✓ Sempre recomende consulta quando necessário</li>
                  <li>✓ Não prescreva medicamentos</li>
                  <li>✓ Mantenha o tom profissional e empático</li>
                </ul>
              </div>
              
              <div className={styles.actions}>
                <button 
                  className={styles.btnCancelar}
                  onClick={() => setSelectedPergunta(null)}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.btnEnviar}
                  onClick={handleSubmitResposta}
                  disabled={isSubmitting || !resposta.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Enviar Resposta
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 