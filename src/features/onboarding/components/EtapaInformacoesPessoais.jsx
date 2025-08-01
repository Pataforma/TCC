import React, { useState, useEffect } from "react";
import styles from "./EtapaInformacoesPessoais.module.css";

export default function EtapaInformacoesPessoais({ data, onUpdate, onNext }) {
  const [formData, setFormData] = useState({
    nomeCompleto: data.nomeCompleto || "",
    cpf: data.cpf || "",
    dataNascimento: data.dataNascimento || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    onUpdate(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Máscara para CPF
    if (name === "cpf") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Limpar erro do campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    } else if (formData.nomeCompleto.trim().split(" ").length < 2) {
      newErrors.nomeCompleto = "Digite seu nome completo";
    }

    if (!formData.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF inválido";
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    } else {
      const birthDate = new Date(formData.dataNascimento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 100) {
        newErrors.dataNascimento = "Data de nascimento inválida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Informações Pessoais</h2>
        <p>Vamos começar com seus dados pessoais básicos</p>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="nomeCompleto" className={styles.label}>
            Nome Completo *
          </label>
          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.nomeCompleto ? styles.error : ""
            }`}
            placeholder="Digite seu nome completo"
          />
          {errors.nomeCompleto && (
            <span className={styles.errorText}>{errors.nomeCompleto}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="cpf" className={styles.label}>
            CPF *
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            className={`${styles.input} ${errors.cpf ? styles.error : ""}`}
            placeholder="000.000.000-00"
            maxLength="14"
          />
          {errors.cpf && <span className={styles.errorText}>{errors.cpf}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="dataNascimento" className={styles.label}>
            Data de Nascimento *
          </label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.dataNascimento ? styles.error : ""
            }`}
          />
          {errors.dataNascimento && (
            <span className={styles.errorText}>{errors.dataNascimento}</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnNext} onClick={handleNext}>
          Continuar <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
