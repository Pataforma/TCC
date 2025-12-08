import React, { useState, useEffect } from "react";
import styles from "./EtapaInformacoesBasicas.module.css";

const estados = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

export default function EtapaInformacoesBasicas({ data, onUpdate, onNext }) {
  const [formData, setFormData] = useState({
    nomeCompleto: data?.nomeCompleto || "",
    cidade: data?.cidade || "",
    estado: data?.estado || "",
    fotoPerfil: data?.fotoPerfil || null,
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    } else if (formData.nomeCompleto.trim().length < 3) {
      newErrors.nomeCompleto = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }

    if (!formData.estado) {
      newErrors.estado = "Estado é obrigatório";
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          fotoPerfil: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
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
        <h2>Suas Informações Básicas</h2>
        <p>
          Vamos começar com algumas informações essenciais para personalizar sua
          experiência
        </p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.field}>
          <label className={styles.label}>Nome Completo *</label>
          <input
            type="text"
            className={`${styles.input} ${
              errors.nomeCompleto ? styles.error : ""
            }`}
            value={formData.nomeCompleto}
            onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
            placeholder="Digite seu nome completo"
          />
          {errors.nomeCompleto && (
            <div className={styles.errorText}>{errors.nomeCompleto}</div>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Cidade *</label>
            <input
              type="text"
              className={`${styles.input} ${errors.cidade ? styles.error : ""}`}
              value={formData.cidade}
              onChange={(e) => handleInputChange("cidade", e.target.value)}
              placeholder="Digite sua cidade"
            />
            {errors.cidade && (
              <div className={styles.errorText}>{errors.cidade}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Estado *</label>
            <select
              className={`${styles.input} ${errors.estado ? styles.error : ""}`}
              value={formData.estado}
              onChange={(e) => handleInputChange("estado", e.target.value)}
            >
              <option value="">Selecione um estado</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            {errors.estado && (
              <div className={styles.errorText}>{errors.estado}</div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Foto de Perfil (Opcional)</label>
          <div className={styles.uploadArea}>
            {formData.fotoPerfil ? (
              <div className={styles.previewContainer}>
                <img
                  src={formData.fotoPerfil}
                  alt="Preview"
                  className={styles.preview}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleInputChange("fotoPerfil", null)}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={styles.uploadPlaceholder}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  id="fotoPerfil"
                />
                <label htmlFor="fotoPerfil" className={styles.uploadLabel}>
                  <i className="fas fa-camera"></i>
                  <span>Clique para adicionar uma foto</span>
                </label>
              </div>
            )}
          </div>
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
