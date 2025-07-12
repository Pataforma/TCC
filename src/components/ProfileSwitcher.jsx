import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveProfile } from "../contexts/ActiveProfileContext";
import styles from "./ProfileSwitcher.module.css";

export default function ProfileSwitcher() {
  const { activeProfile, userProfiles, switchProfile } = useActiveProfile();
  const [isOpen, setIsOpen] = useState(false);
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

  const handleProfileSwitch = (profile) => {
    switchProfile(profile.id);
    setIsOpen(false);

    // Redirecionar para o dashboard do perfil selecionado
    navigate(`/dashboard/${profile.type}`);
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

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        title="Trocar perfil"
      >
        <div className={styles.profileInfo}>
          <div
            className={styles.profileIcon}
            style={{ backgroundColor: getProfileColor(activeProfile.type) }}
          >
            <i className={getProfileIcon(activeProfile.type)}></i>
          </div>
          <div className={styles.profileDetails}>
            <span className={styles.profileName}>{activeProfile.name}</span>
            <span className={styles.profileType}>
              {activeProfile.type.charAt(0).toUpperCase() +
                activeProfile.type.slice(1)}
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
            {userProfiles.map((profile) => (
              <button
                key={profile.id}
                className={`${styles.profileOption} ${
                  profile.id === activeProfile.id ? styles.active : ""
                }`}
                onClick={() => handleProfileSwitch(profile)}
              >
                <div
                  className={styles.profileIcon}
                  style={{ backgroundColor: getProfileColor(profile.type) }}
                >
                  <i className={getProfileIcon(profile.type)}></i>
                </div>
                <div className={styles.profileDetails}>
                  <span className={styles.profileName}>{profile.name}</span>
                  <span className={styles.profileType}>
                    {profile.type.charAt(0).toUpperCase() +
                      profile.type.slice(1)}
                  </span>
                </div>
                {profile.id === activeProfile.id && (
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
