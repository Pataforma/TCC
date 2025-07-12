import React, { useState, useEffect } from "react";
import styles from "./EtapaInformacoesProfissionais.module.css";

const especialidades = [
  "Clínico Geral",
  "Cirurgia",
  "Dermatologia",
  "Cardiologia",
  "Ortopedia",
  "Neurologia",
  "Oftalmologia",
  "Oncologia",
  "Endocrinologia",
  "Nutrição",
  "Comportamento",
  "Fisioterapia",
  "Acupuntura",
  "Homeopatia",
];

export default function EtapaInformacoesProfissionais({
  data,
  onUpdate,
  onNext,
}) {
  const [formData, setFormData] = useState({
    crmv: data.crmv || "",
    especialidades: data.especialidades || [],
    nomeClinica: data.nomeClinica || "",
    endereco: data.endereco || "",
    cidade: data.cidade || "",
    estado: data.estado || "",
    cep: data.cep || "",
    telefone: data.telefone || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Máscaras
    if (name === "cep") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
    } else if (name === "telefone") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleEspecialidadeChange = (especialidade) => {
    setFormData((prev) => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidade)
        ? prev.especialidades.filter((esp) => esp !== especialidade)
        : [...prev.especialidades, especialidade],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.crmv.trim()) {
      newErrors.crmv = "CRMV é obrigatório";
    }

    if (formData.especialidades.length === 0) {
      newErrors.especialidades = "Selecione pelo menos uma especialidade";
    }

    if (!formData.nomeClinica.trim()) {
      newErrors.nomeClinica = "Nome da clínica é obrigatório";
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = "Endereço é obrigatório";
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }

    if (!formData.estado) {
      newErrors.estado = "Estado é obrigatório";
    }

    if (!formData.cep) {
      newErrors.cep = "CEP é obrigatório";
    } else if (formData.cep.replace(/\D/g, "").length !== 8) {
      newErrors.cep = "CEP inválido";
    }

    if (!formData.telefone) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (formData.telefone.replace(/\D/g, "").length < 10) {
      newErrors.telefone = "Telefone inválido";
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
        <h2>Informações Profissionais</h2>
        <p>Configure seus dados profissionais e da clínica</p>
      </div>

      <div className={styles.form}>
        <div className={styles.section}>
          <h3>Dados Profissionais</h3>

          <div className={styles.field}>
            <label htmlFor="crmv" className={styles.label}>
              CRMV *
            </label>
            <input
              type="text"
              id="crmv"
              name="crmv"
              value={formData.crmv}
              onChange={handleChange}
              className={`${styles.input} ${errors.crmv ? styles.error : ""}`}
              placeholder="Digite seu CRMV"
            />
            {errors.crmv && (
              <span className={styles.errorText}>{errors.crmv}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Especialidades *</label>
            <div className={styles.especialidadesGrid}>
              {especialidades.map((esp) => (
                <label key={esp} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.especialidades.includes(esp)}
                    onChange={() => handleEspecialidadeChange(esp)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>{esp}</span>
                </label>
              ))}
            </div>
            {errors.especialidades && (
              <span className={styles.errorText}>{errors.especialidades}</span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Dados da Clínica</h3>

          <div className={styles.field}>
            <label htmlFor="nomeClinica" className={styles.label}>
              Nome da Clínica *
            </label>
            <input
              type="text"
              id="nomeClinica"
              name="nomeClinica"
              value={formData.nomeClinica}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.nomeClinica ? styles.error : ""
              }`}
              placeholder="Nome da sua clínica ou consultório"
            />
            {errors.nomeClinica && (
              <span className={styles.errorText}>{errors.nomeClinica}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="endereco" className={styles.label}>
              Endereço *
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.endereco ? styles.error : ""
              }`}
              placeholder="Rua, número, complemento"
            />
            {errors.endereco && (
              <span className={styles.errorText}>{errors.endereco}</span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="cidade" className={styles.label}>
                Cidade *
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.cidade ? styles.error : ""
                }`}
                placeholder="Cidade"
              />
              {errors.cidade && (
                <span className={styles.errorText}>{errors.cidade}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="estado" className={styles.label}>
                Estado *
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.estado ? styles.error : ""
                }`}
              >
                <option value="">Selecione o estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
              {errors.estado && (
                <span className={styles.errorText}>{errors.estado}</span>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="cep" className={styles.label}>
                CEP *
              </label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                className={`${styles.input} ${errors.cep ? styles.error : ""}`}
                placeholder="00000-000"
                maxLength="9"
              />
              {errors.cep && (
                <span className={styles.errorText}>{errors.cep}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="telefone" className={styles.label}>
                Telefone *
              </label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.telefone ? styles.error : ""
                }`}
                placeholder="(00) 00000-0000"
                maxLength="15"
              />
              {errors.telefone && (
                <span className={styles.errorText}>{errors.telefone}</span>
              )}
            </div>
          </div>
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
