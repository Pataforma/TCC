import React, { useState, useEffect } from "react";
import styles from "./EtapaIdentificacao.module.css";

export default function EtapaIdentificacao({ data, onUpdate, onNext, onBack }) {
  const [formData, setFormData] = useState({
    nomeONG: data?.nomeONG || "",
    cnpj: data?.cnpj || "",
    descricao: data?.descricao || "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeONG.trim()) {
      newErrors.nomeONG = "Nome da ONG/Abrigo é obrigatório";
    } else if (formData.nomeONG.trim().length < 3) {
      newErrors.nomeONG = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (formData.cnpj.replace(/\D/g, "").length !== 14) {
      newErrors.cnpj = "CNPJ deve ter 14 dígitos";
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição/Missão é obrigatória";
    } else if (formData.descricao.trim().length < 20) {
      newErrors.descricao = "Descrição deve ter pelo menos 20 caracteres";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCNPJChange = (value) => {
    // Máscara para CNPJ: XX.XXX.XXX/XXXX-XX
    const cnpj = value.replace(/\D/g, "");
    let maskedCNPJ = "";

    if (cnpj.length <= 2) {
      maskedCNPJ = cnpj;
    } else if (cnpj.length <= 5) {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    } else if (cnpj.length <= 8) {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    } else if (cnpj.length <= 12) {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
        5,
        8
      )}/${cnpj.slice(8)}`;
    } else {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
        5,
        8
      )}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
    }

    handleInputChange("cnpj", maskedCNPJ);
  };

  const handleSubmit = () => {
    if (isValid) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Identificação da Organização</h2>
        <p>Vamos começar com as informações básicas da sua organização</p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.field}>
          <label className={styles.label}>Nome da ONG/Abrigo *</label>
          <input
            type="text"
            className={`${styles.input} ${errors.nomeONG ? styles.error : ""}`}
            value={formData.nomeONG}
            onChange={(e) => handleInputChange("nomeONG", e.target.value)}
            placeholder="Digite o nome da sua organização"
          />
          {errors.nomeONG && (
            <div className={styles.errorText}>{errors.nomeONG}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>CNPJ *</label>
          <input
            type="text"
            className={`${styles.input} ${errors.cnpj ? styles.error : ""}`}
            value={formData.cnpj}
            onChange={(e) => handleCNPJChange(e.target.value)}
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
          {errors.cnpj && <div className={styles.errorText}>{errors.cnpj}</div>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Breve Descrição/Missão *</label>
          <textarea
            className={`${styles.textarea} ${
              errors.descricao ? styles.error : ""
            }`}
            value={formData.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
            placeholder="Conte-nos sobre a missão da sua organização, os tipos de animais que vocês atendem e como trabalham pela causa animal..."
            rows={4}
            maxLength={500}
          />
          <div className={styles.charCount}>
            {formData.descricao.length}/500 caracteres
          </div>
          {errors.descricao && (
            <div className={styles.errorText}>{errors.descricao}</div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnNext}
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Continuar
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
