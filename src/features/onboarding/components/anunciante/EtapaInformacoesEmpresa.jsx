import React, { useState, useEffect } from 'react';
import styles from './EtapaInformacoesEmpresa.module.css';

export default function EtapaInformacoesEmpresa({ data, onUpdate, onNext }) {
  const [formData, setFormData] = useState({
    nomeEmpresa: data?.nomeEmpresa || '',
    cnpj: data?.cnpj || '',
    logoEmpresa: data?.logoEmpresa || null
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeEmpresa.trim()) {
      newErrors.nomeEmpresa = 'Nome da empresa é obrigatório';
    } else if (formData.nomeEmpresa.trim().length < 3) {
      newErrors.nomeEmpresa = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (formData.cnpj && formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCNPJChange = (value) => {
    // Máscara para CNPJ: XX.XXX.XXX/XXXX-XX
    const cnpj = value.replace(/\D/g, '');
    let maskedCNPJ = '';
    
    if (cnpj.length <= 2) {
      maskedCNPJ = cnpj;
    } else if (cnpj.length <= 5) {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    } else if (cnpj.length <= 8) {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    } else if (cnpj.length <= 12) {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
    } else {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
    }

    handleInputChange('cnpj', maskedCNPJ);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          logoEmpresa: e.target.result
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
        <h2>Informações da Empresa</h2>
        <p>Vamos começar com as informações básicas da sua empresa</p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.field}>
          <label className={styles.label}>
            Nome do Negócio/Empresa *
          </label>
          <input
            type="text"
            className={`${styles.input} ${errors.nomeEmpresa ? styles.error : ''}`}
            value={formData.nomeEmpresa}
            onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
            placeholder="Digite o nome da sua empresa"
          />
          {errors.nomeEmpresa && (
            <div className={styles.errorText}>
              {errors.nomeEmpresa}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            CNPJ (Opcional)
          </label>
          <input
            type="text"
            className={`${styles.input} ${errors.cnpj ? styles.error : ''}`}
            value={formData.cnpj}
            onChange={(e) => handleCNPJChange(e.target.value)}
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
          {errors.cnpj && (
            <div className={styles.errorText}>
              {errors.cnpj}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Logo da Empresa (Opcional)
          </label>
          <div className={styles.uploadArea}>
            {formData.logoEmpresa ? (
              <div className={styles.previewContainer}>
                <img 
                  src={formData.logoEmpresa} 
                  alt="Logo Preview" 
                  className={styles.preview}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleInputChange('logoEmpresa', null)}
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
                  id="logoEmpresa"
                />
                <label htmlFor="logoEmpresa" className={styles.uploadLabel}>
                  <i className="fas fa-image"></i>
                  <span>Clique para adicionar o logo da empresa</span>
                  <small>Formatos aceitos: JPG, PNG, GIF (máx. 2MB)</small>
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