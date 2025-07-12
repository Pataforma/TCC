import React, { createContext, useContext, useState } from "react";

// Cria o contexto
const ActiveProfileContext = createContext();

// Hook para usar o contexto
export function useActiveProfile() {
  return useContext(ActiveProfileContext);
}

// Provider do contexto
export function ActiveProfileProvider({ children }) {
  // Dados mockados de perfis do usuário
  const [userProfiles] = useState([
    { id: 1, type: "veterinario", name: "Dr. João Silva", isActive: true },
    { id: 2, type: "tutor", name: "João Silva (Pessoal)", isActive: false },
    { id: 3, type: "anunciante", name: "PetShop do João", isActive: false },
  ]);

  const [activeProfile, setActiveProfile] = useState(
    userProfiles.find((p) => p.isActive) || userProfiles[0]
  );

  // Função para trocar de perfil
  const switchProfile = (profileId) => {
    const newActiveProfile = userProfiles.find((p) => p.id === profileId);
    if (newActiveProfile) {
      setActiveProfile(newActiveProfile);

      // TODO: Atualizar perfil ativo no backend
      console.log("Trocando para perfil:", newActiveProfile);
    }
  };

  // Função para adicionar novo perfil
  const addProfile = (profileData) => {
    // TODO: Adicionar novo perfil no backend
    console.log("Adicionando novo perfil:", profileData);
  };

  // Função para remover perfil
  const removeProfile = (profileId) => {
    // TODO: Remover perfil no backend
    console.log("Removendo perfil:", profileId);
  };

  return (
    <ActiveProfileContext.Provider
      value={{
        activeProfile,
        userProfiles,
        switchProfile,
        addProfile,
        removeProfile,
      }}
    >
      {children}
    </ActiveProfileContext.Provider>
  );
}
