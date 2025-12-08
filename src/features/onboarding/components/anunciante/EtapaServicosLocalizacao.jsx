import React, { useState, useEffect } from "react";
import styles from "./EtapaServicosLocalizacao.module.css";

const categoriasServico = [
  "Pet Shop",
  "Banho e Tosa",
  "Hotel para Pets",
  "Veterinário",
  "Adestramento",
  "Pet Sitter",
  "Loja de Produtos",
  "Eventos Pet",
  "ONG/Abrigo",
  "Outro",
];

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

export default function EtapaServicosLocalizacao({ data, onUpdate, onNext }) {
  const [formData, setFormData] = useState({
    categorias: data?.categorias || [],
    cep: data?.cep || "",
    endereco: data?.endereco || "",
    numero: data?.numero || "",
    complemento: data?.complemento || "",
    bairro: data?.bairro || "",
    cidade: data?.cidade || "",
    estado: data?.estado || "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.categorias.length === 0) {
      newErrors.categorias = "Selecione pelo menos uma categoria";
    }

    if (!formData.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
    } else if (formData.cep.replace(/\D/g, "").length !== 8) {
      newErrors.cep = "CEP deve ter 8 dígitos";
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = "Endereço é obrigatório";
    }

    if (!formData.numero.trim()) {
      newErrors.numero = "Número é obrigatório";
    }

    if (!formData.bairro.trim()) {
      newErrors.bairro = "Bairro é obrigatório";
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

  const handleCategoriaChange = (categoria) => {
    setFormData((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter((c) => c !== categoria)
        : [...prev.categorias, categoria],
    }));
  };

  const handleCEPChange = (value) => {
    // Máscara para CEP: XXXXX-XXX
    const cep = value.replace(/\D/g, "");
    let maskedCEP = "";

    if (cep.length <= 5) {
      maskedCEP = cep;
    } else {
      maskedCEP = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    }

    handleInputChange("cep", maskedCEP);

    // Buscar CEP automaticamente quando tiver 8 dígitos
    if (cep.length === 8) {
      buscarCEP(cep);
    }
  };

  const buscarCEP = async (cep) => {
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setLoadingCep(false);
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
        <h2>Serviços e Localização</h2>
        <p>
          Conte-nos sobre os serviços que você oferece e onde está localizado
        </p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.section}>
          <h3>Categoria do Serviço</h3>
          <div className={styles.categoriasGrid}>
            {categoriasServico.map((categoria) => (
              <label key={categoria} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={formData.categorias.includes(categoria)}
                  onChange={() => handleCategoriaChange(categoria)}
                />
                <span className={styles.checkboxText}>{categoria}</span>
              </label>
            ))}
          </div>
          {errors.categorias && (
            <div className={styles.errorText}>{errors.categorias}</div>
          )}
        </div>

        <div className={styles.section}>
          <h3>Endereço Físico</h3>

          <div className={styles.field}>
            <label className={styles.label}>CEP *</label>
            <div className={styles.cepContainer}>
              <input
                type="text"
                className={`${styles.input} ${errors.cep ? styles.error : ""}`}
                value={formData.cep}
                onChange={(e) => handleCEPChange(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
              />
              {loadingCep && (
                <div className={styles.loadingCep}>
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              )}
            </div>
            {errors.cep && <div className={styles.errorText}>{errors.cep}</div>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Endereço *</label>
              <input
                type="text"
                className={`${styles.input} ${
                  errors.endereco ? styles.error : ""
                }`}
                value={formData.endereco}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                placeholder="Rua, Avenida, etc."
              />
              {errors.endereco && (
                <div className={styles.errorText}>{errors.endereco}</div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Número *</label>
              <input
                type="text"
                className={`${styles.input} ${
                  errors.numero ? styles.error : ""
                }`}
                value={formData.numero}
                onChange={(e) => handleInputChange("numero", e.target.value)}
                placeholder="123"
              />
              {errors.numero && (
                <div className={styles.errorText}>{errors.numero}</div>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Complemento</label>
            <input
              type="text"
              className={styles.input}
              value={formData.complemento}
              onChange={(e) => handleInputChange("complemento", e.target.value)}
              placeholder="Apartamento, sala, etc."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Bairro *</label>
              <input
                type="text"
                className={`${styles.input} ${
                  errors.bairro ? styles.error : ""
                }`}
                value={formData.bairro}
                onChange={(e) => handleInputChange("bairro", e.target.value)}
                placeholder="Nome do bairro"
              />
              {errors.bairro && (
                <div className={styles.errorText}>{errors.bairro}</div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Cidade *</label>
              <input
                type="text"
                className={`${styles.input} ${
                  errors.cidade ? styles.error : ""
                }`}
                value={formData.cidade}
                onChange={(e) => handleInputChange("cidade", e.target.value)}
                placeholder="Nome da cidade"
              />
              {errors.cidade && (
                <div className={styles.errorText}>{errors.cidade}</div>
              )}
            </div>
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
