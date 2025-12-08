import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { api } from "../utils/api";
import styles from "./ProfileSwitcher.module.css";

export default function ProfileSwitcher() {
  const { user, fetchUserData } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Obter tipos do usuário
  const tipos = user?.tipos || [];
  const tipoAtual = user?.tipo_usuario || "pendente";

  // Se não tem múltiplos tipos, não mostrar o switcher
  if (!user || tipos.length <= 1) {
    return null;
  }

  const handleProfileSwitch = async (tipo) => {
    if (tipo === tipoAtual || switching) return;

    setSwitching(true);
    setIsOpen(false);

    try {
      // Alternar tipo no backend
      await api.post("/usuarios/switch-tipo", { tipo_usuario: tipo });
      
      // Atualizar contexto
      await fetchUserData();

      // Redirecionar para o dashboard do tipo selecionado
      navigate(`/dashboard/${tipo}/perfil`, { replace: true });
    } catch (error) {
      console.error("Erro ao alternar tipo:", error);
      alert("Erro ao alternar perfil: " + (error.message || "Tente novamente"));
    } finally {
      setSwitching(false);
    }
  };

  const handleCreateNewProfile = () => {
    setIsOpen(false);
    navigate("/tipo-usuario");
  };

  const getProfileIcon = (type) => {
    switch (type) {
      case "veterinario":
        return "fas fa-user-md";
      case "tutor":
        return "fas fa-user";
      case "anunciante":
        return "fas fa-store";
      case "parceiro":
        return "fas fa-handshake";
      default:
        return "fas fa-user";
    }
  };

  const getProfileColor = (type) => {
    switch (type) {
      case "veterinario":
        return "#0DB2AC";
      case "tutor":
        return "#FABA32";
      case "anunciante":
        return "#089691";
      case "parceiro":
        return "#fa745a";
      default:
        return "#6c757d";
    }
  };

  const getProfileName = (type) => {
    const names = {
      veterinario: "Veterinário",
      tutor: "Tutor",
      anunciante: "Anunciante",
      parceiro: "Parceiro",
    };
    return names[type] || type;
  };

  const activeProfile = tipos.find(t => t.tipo === tipoAtual) || tipos[0];

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        title="Trocar perfil"
        disabled={switching}
      >
        <div className={styles.profileInfo}>
          <div
            className={styles.profileIcon}
            style={{ backgroundColor: getProfileColor(tipoAtual) }}
          >
            <i className={getProfileIcon(tipoAtual)}></i>
          </div>
          <div className={styles.profileDetails}>
            <span className={styles.profileName}>
              {user.nome || user.email?.split("@")[0] || "Usuário"}
            </span>
            <span className={styles.profileType}>
              {getProfileName(tipoAtual)}
            </span>
          </div>
        </div>
        <i
          className={`fas fa-chevron-down ${styles.arrow} ${
            isOpen ? styles.rotated : ""
          }`}
        ></i>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h4>Seus Perfis</h4>
            <p>Escolha um perfil para continuar</p>
          </div>

          <div className={styles.profilesList}>
            {tipos.map((tipo) => (
              <button
                key={tipo.tipo}
                className={`${styles.profileOption} ${
                  tipo.tipo === tipoAtual ? styles.active : ""
                }`}
                onClick={() => handleProfileSwitch(tipo.tipo)}
                disabled={switching}
              >
                <div
                  className={styles.profileIcon}
                  style={{ backgroundColor: getProfileColor(tipo.tipo) }}
                >
                  <i className={getProfileIcon(tipo.tipo)}></i>
                </div>
                <div className={styles.profileDetails}>
                  <span className={styles.profileName}>
                    {user.nome || user.email?.split("@")[0] || "Usuário"}
                  </span>
                  <span className={styles.profileType}>
                    {getProfileName(tipo.tipo)}
                  </span>
                </div>
                {tipo.tipo === tipoAtual && (
                  <i className="fas fa-check"></i>
                )}
              </button>
            ))}
          </div>

          <div className={styles.dropdownFooter}>
            <button
              className={styles.createProfileBtn}
              onClick={handleCreateNewProfile}
            >
              <i className="fas fa-plus"></i> Criar novo perfil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
