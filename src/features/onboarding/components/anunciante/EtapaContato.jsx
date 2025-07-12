import React, { useState, useEffect } from "react";
import styles from "./EtapaContato.module.css";

export default function EtapaContato({ data, onUpdate, onNext }) {
  const [formData, setFormData] = useState({
    telefone: data?.telefone || "",
    whatsapp: data?.whatsapp || "",
    website: data?.website || "",
    instagram: data?.instagram || "",
    facebook: data?.facebook || "",
    email: data?.email || "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    // Pelo menos um meio de contato deve ser fornecido
    const hasContact = formData.telefone || formData.whatsapp || formData.email;
    if (!hasContact) {
      newErrors.contact = "Pelo menos um meio de contato é obrigatório";
    }

    if (formData.telefone && formData.telefone.replace(/\D/g, "").length < 10) {
      newErrors.telefone = "Telefone deve ter pelo menos 10 dígitos";
    }

    if (formData.whatsapp && formData.whatsapp.replace(/\D/g, "").length < 10) {
      newErrors.whatsapp = "WhatsApp deve ter pelo menos 10 dígitos";
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "URL inválida";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhoneChange = (field, value) => {
    // Máscara para telefone: (XX) XXXXX-XXXX
    const phone = value.replace(/\D/g, "");
    let maskedPhone = "";

    if (phone.length <= 2) {
      maskedPhone = phone;
    } else if (phone.length <= 6) {
      maskedPhone = `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
    } else if (phone.length <= 10) {
      maskedPhone = `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(
        6
      )}`;
    } else {
      maskedPhone = `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(
        7,
        11
      )}`;
    }

    handleInputChange(field, maskedPhone);
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
        <h2>Informações de Contato</h2>
        <p>Como seus clientes podem entrar em contato com você?</p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.section}>
          <h3>Telefones</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Telefone Fixo</label>
              <input
                type="text"
                className={`${styles.input} ${
                  errors.telefone ? styles.error : ""
                }`}
                value={formData.telefone}
                onChange={(e) => handlePhoneChange("telefone", e.target.value)}
                placeholder="(11) 1234-5678"
                maxLength={15}
              />
              {errors.telefone && (
                <div className={styles.errorText}>{errors.telefone}</div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>WhatsApp</label>
              <input
                type="text"
                className={`${styles.input} ${
                  errors.whatsapp ? styles.error : ""
                }`}
                value={formData.whatsapp}
                onChange={(e) => handlePhoneChange("whatsapp", e.target.value)}
                placeholder="(11) 98765-4321"
                maxLength={15}
              />
              {errors.whatsapp && (
                <div className={styles.errorText}>{errors.whatsapp}</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>E-mail</h3>

          <div className={styles.field}>
            <label className={styles.label}>E-mail de Contato</label>
            <input
              type="email"
              className={`${styles.input} ${errors.email ? styles.error : ""}`}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="contato@suaempresa.com"
            />
            {errors.email && (
              <div className={styles.errorText}>{errors.email}</div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Website e Redes Sociais</h3>

          <div className={styles.field}>
            <label className={styles.label}>Website</label>
            <input
              type="text"
              className={`${styles.input} ${
                errors.website ? styles.error : ""
              }`}
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="www.suaempresa.com"
            />
            {errors.website && (
              <div className={styles.errorText}>{errors.website}</div>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Instagram</label>
              <div className={styles.socialInput}>
                <span className={styles.socialPrefix}>@</span>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.instagram}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  placeholder="suaempresa"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Facebook</label>
              <input
                type="text"
                className={styles.input}
                value={formData.facebook}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                placeholder="suaempresa"
              />
            </div>
          </div>
        </div>

        {errors.contact && (
          <div className={styles.errorCard}>
            <i className="fas fa-exclamation-triangle"></i>
            <span>{errors.contact}</span>
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnNext}
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Finalizar Cadastro
            <i className="fas fa-check"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
