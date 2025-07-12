import React, { useState, useEffect } from "react";
import styles from "./EtapaObjetivoFormato.module.css";

const objetivos = [
  {
    id: "mensagens-whatsapp",
    titulo: "Receber mensagens no WhatsApp",
    descricao: "Direcionar pessoas para conversar com você via WhatsApp",
    icone: "💬",
    popular: true,
  },
  {
    id: "agendar-consultas",
    titulo: "Agendar consultas",
    descricao: "Aumentar o número de agendamentos de consultas",
    icone: "📅",
    popular: false,
  },
  {
    id: "divulgar-evento",
    titulo: "Divulgar evento",
    descricao: "Promover um evento específico da sua empresa",
    icone: "🎉",
    popular: false,
  },
  {
    id: "vender-produtos",
    titulo: "Vender produtos",
    descricao: "Aumentar as vendas de produtos pet",
    icone: "🛒",
    popular: false,
  },
  {
    id: "visibilidade-marca",
    titulo: "Aumentar visibilidade da marca",
    descricao: "Fazer mais pessoas conhecerem sua empresa",
    icone: "👁️",
    popular: false,
  },
];

const formatos = [
  {
    id: "banner-servicos",
    titulo: "Banner na página de Serviços Locais",
    descricao: "Aparece quando pessoas buscam serviços na sua região",
    icone: "📍",
    alcance: "Alto",
    preco: "R$ 15-25/dia",
  },
  {
    id: "banner-veterinarios",
    titulo: "Banner na página de Veterinários",
    descricao: "Aparece quando pessoas buscam veterinários",
    icone: "🏥",
    alcance: "Médio",
    preco: "R$ 12-20/dia",
  },
  {
    id: "banner-eventos",
    titulo: "Banner na página de Eventos",
    descricao: "Aparece quando pessoas procuram eventos pet",
    icone: "🎪",
    alcance: "Médio",
    preco: "R$ 10-18/dia",
  },
  {
    id: "banner-adocao",
    titulo: "Banner na página de Adoção",
    descricao: "Aparece quando pessoas procuram pets para adotar",
    icone: "🐾",
    alcance: "Alto",
    preco: "R$ 18-28/dia",
  },
];

export default function EtapaObjetivoFormato({ data, onUpdate }) {
  const [formData, setFormData] = useState({
    nome: data?.nome || "",
    objetivo: data?.objetivo || "",
    formato: data?.formato || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da campanha é obrigatório";
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.objetivo) {
      newErrors.objetivo = "Selecione um objetivo";
    }

    if (!formData.formato) {
      newErrors.formato = "Selecione um formato";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleObjetivoSelect = (objetivoId) => {
    handleInputChange("objetivo", objetivoId);
  };

  const handleFormatoSelect = (formatoId) => {
    handleInputChange("formato", formatoId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Objetivo e Formato da Campanha</h3>
        <p>Defina o que você quer alcançar e onde seu anúncio vai aparecer</p>
      </div>

      <div className={styles.form}>
        {/* Nome da Campanha */}
        <div className={styles.section}>
          <h4>Nome da Campanha</h4>
          <div className={styles.field}>
            <input
              type="text"
              className={`${styles.input} ${errors.nome ? styles.error : ""}`}
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Ex: Promoção Banho e Tosa - Dezembro"
            />
            {errors.nome && (
              <div className={styles.errorText}>{errors.nome}</div>
            )}
          </div>
        </div>

        {/* Objetivo */}
        <div className={styles.section}>
          <h4>Qual é o objetivo da sua campanha?</h4>
          <div className={styles.optionsGrid}>
            {objetivos.map((objetivo) => (
              <div
                key={objetivo.id}
                className={`${styles.optionCard} ${
                  formData.objetivo === objetivo.id ? styles.selected : ""
                }`}
                onClick={() => handleObjetivoSelect(objetivo.id)}
              >
                <div className={styles.optionHeader}>
                  <span className={styles.optionIcon}>{objetivo.icone}</span>
                  <h5 className={styles.optionTitle}>{objetivo.titulo}</h5>
                  {objetivo.popular && (
                    <span className={styles.popularBadge}>Popular</span>
                  )}
                </div>
                <p className={styles.optionDescription}>{objetivo.descricao}</p>
                {formData.objetivo === objetivo.id && (
                  <div className={styles.selectedIndicator}>
                    <span>✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.objetivo && (
            <div className={styles.errorText}>{errors.objetivo}</div>
          )}
        </div>

        {/* Formato */}
        <div className={styles.section}>
          <h4>Onde seu anúncio vai aparecer?</h4>
          <div className={styles.optionsGrid}>
            {formatos.map((formato) => (
              <div
                key={formato.id}
                className={`${styles.optionCard} ${
                  formData.formato === formato.id ? styles.selected : ""
                }`}
                onClick={() => handleFormatoSelect(formato.id)}
              >
                <div className={styles.optionHeader}>
                  <span className={styles.optionIcon}>{formato.icone}</span>
                  <h5 className={styles.optionTitle}>{formato.titulo}</h5>
                </div>
                <p className={styles.optionDescription}>{formato.descricao}</p>
                <div className={styles.formatoInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Alcance:</span>
                    <span className={styles.infoValue}>{formato.alcance}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Preço:</span>
                    <span className={styles.infoValue}>{formato.preco}</span>
                  </div>
                </div>
                {formData.formato === formato.id && (
                  <div className={styles.selectedIndicator}>
                    <span>✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.formato && (
            <div className={styles.errorText}>{errors.formato}</div>
          )}
        </div>
      </div>
    </div>
  );
}
