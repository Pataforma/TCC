import React, { useEffect, useState } from 'react';
import styles from './PainelDuvidasVet.module.css';
import { supabase } from '../../../utils/supabase';

export default function PainelDuvidasVet() {
  const [perguntasAguardando, setPerguntasAguardando] = useState([]);
  const [selectedPergunta, setSelectedPergunta] = useState(null);
  const [resposta, setResposta] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const carregarPerguntas = async () => {
      try {
        // Busca perguntas pendentes de resposta
        const { data, error } = await supabase
          .from('qna_perguntas')
          .select('id, pergunta, categoria, prioridade, data')
          .eq('status', 'pendente')
          .order('data', { ascending: false });
        if (error) throw error;
        setPerguntasAguardando(data || []);
      } catch (error) {
        console.error('Erro ao carregar perguntas:', error);
        setPerguntasAguardando([]);
      }
    };
    carregarPerguntas();
  }, []);

  const handleResponder = (pergunta) => {
    setSelectedPergunta(pergunta);
    setResposta('');
  };

  const handleSubmitResposta = async () => {
    if (!resposta.trim() || !selectedPergunta) return;
    try {
      setIsSubmitting(true);
      // Inserir resposta e atualizar status da pergunta
      const { error: insertError } = await supabase
        .from('qna_respostas')
        .insert({
          pergunta_id: selectedPergunta.id,
          conteudo: resposta.trim(),
        });
      if (insertError) throw insertError;

      const { error: updError } = await supabase
        .from('qna_perguntas')
        .update({ status: 'respondida' })
        .eq('id', selectedPergunta.id);
      if (updError) throw updError;

      alert('Resposta enviada com sucesso!');
      setSelectedPergunta(null);
      setResposta('');
      // Remover da lista atual
      setPerguntasAguardando((prev) => prev.filter((p) => p.id !== selectedPergunta.id));
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
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