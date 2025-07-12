import React, { useState, useEffect } from "react";
import styles from "./EtapaPets.module.css";

const especies = ["Cão", "Gato", "Ave", "Peixe", "Réptil", "Roedor", "Outro"];

const racasCaes = [
  "Labrador",
  "Golden Retriever",
  "Bulldog",
  "Poodle",
  "Pastor Alemão",
  "Rottweiler",
  "Beagle",
  "Dachshund",
  "Chihuahua",
  "Yorkshire",
  "Pug",
  "Husky",
  "Border Collie",
  "Outra",
];

const racasGatos = [
  "Persa",
  "Siamês",
  "Maine Coon",
  "Ragdoll",
  "Bengala",
  "Sphynx",
  "British Shorthair",
  "Abissínio",
  "Birmanês",
  "Outra",
];

export default function EtapaPets({ data, onUpdate, onNext }) {
  const [formData, setFormData] = useState({
    pets: data?.pets || [],
  });

  const [currentPet, setCurrentPet] = useState({
    nome: "",
    especie: "",
    raca: "",
    dataNascimento: "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    validateForm();
  }, [currentPet]);

  const validateForm = () => {
    const newErrors = {};

    if (currentPet.nome && !currentPet.nome.trim()) {
      newErrors.nome = "Nome do pet é obrigatório";
    }

    if (currentPet.especie && !currentPet.raca) {
      newErrors.raca = "Raça é obrigatória";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const getRacas = () => {
    switch (currentPet.especie) {
      case "Cão":
        return racasCaes;
      case "Gato":
        return racasGatos;
      default:
        return ["Outra"];
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentPet((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddPet = () => {
    if (currentPet.nome && currentPet.especie) {
      const newPet = {
        id: Date.now(),
        ...currentPet,
      };

      setFormData((prev) => ({
        ...prev,
        pets: [...prev.pets, newPet],
      }));

      setCurrentPet({
        nome: "",
        especie: "",
        raca: "",
        dataNascimento: "",
      });
    }
  };

  const handleRemovePet = (petId) => {
    setFormData((prev) => ({
      ...prev,
      pets: prev.pets.filter((pet) => pet.id !== petId),
    }));
  };

  const handleSkip = () => {
    onUpdate(formData);
    onNext();
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Vamos conhecer seu(s) companheiro(s)!</h2>
        <p>
          Cadastre seus pets para personalizar ainda mais sua experiência na
          Pataforma
        </p>
      </div>

      <div className={styles.content}>
        {/* Lista de pets cadastrados */}
        {formData.pets.length > 0 && (
          <div className={styles.petsList}>
            <h3>Seus Pets Cadastrados</h3>
            <div className={styles.petsGrid}>
              {formData.pets.map((pet) => (
                <div key={pet.id} className={styles.petCard}>
                  <div className={styles.petInfo}>
                    <h4>{pet.nome}</h4>
                    <p>
                      {pet.especie} • {pet.raca}
                    </p>
                    {pet.dataNascimento && (
                      <p className={styles.birthDate}>
                        Nascido em:{" "}
                        {new Date(pet.dataNascimento).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.removePetBtn}
                    onClick={() => handleRemovePet(pet.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário para adicionar novo pet */}
        <div className={styles.addPetSection}>
          <h3>Adicionar Novo Pet</h3>
          <div className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Nome do Pet *</label>
                <input
                  type="text"
                  className={`${styles.input} ${
                    errors.nome ? styles.error : ""
                  }`}
                  value={currentPet.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Digite o nome do seu pet"
                />
                {errors.nome && (
                  <div className={styles.errorText}>{errors.nome}</div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Espécie *</label>
                <select
                  className={styles.input}
                  value={currentPet.especie}
                  onChange={(e) => handleInputChange("especie", e.target.value)}
                >
                  <option value="">Selecione a espécie</option>
                  {especies.map((especie) => (
                    <option key={especie} value={especie}>
                      {especie}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Raça</label>
                <select
                  className={`${styles.input} ${
                    errors.raca ? styles.error : ""
                  }`}
                  value={currentPet.raca}
                  onChange={(e) => handleInputChange("raca", e.target.value)}
                  disabled={!currentPet.especie}
                >
                  <option value="">Selecione a raça</option>
                  {getRacas().map((raca) => (
                    <option key={raca} value={raca}>
                      {raca}
                    </option>
                  ))}
                </select>
                {errors.raca && (
                  <div className={styles.errorText}>{errors.raca}</div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Data de Nascimento (Aproximada)
                </label>
                <input
                  type="date"
                  className={styles.input}
                  value={currentPet.dataNascimento}
                  onChange={(e) =>
                    handleInputChange("dataNascimento", e.target.value)
                  }
                />
              </div>
            </div>

            <div className={styles.addPetActions}>
              <button
                type="button"
                className={styles.btnAddPet}
                onClick={handleAddPet}
                disabled={!currentPet.nome || !currentPet.especie}
              >
                <i className="fas fa-plus"></i>
                Adicionar Pet
              </button>
            </div>
          </div>
        </div>

        {/* Opção de pular */}
        <div className={styles.skipSection}>
          <div className={styles.skipCard}>
            <i className="fas fa-heart"></i>
            <div className={styles.skipContent}>
              <h4>Quer adotar um pet?</h4>
              <p>
                Se você ainda não tem um pet mas gostaria de adotar um, podemos
                te ajudar a encontrar o companheiro perfeito!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnSkip} onClick={handleSkip}>
          Pular por enquanto
          <i className="fas fa-arrow-right"></i>
        </button>

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
    </div>
  );
}
