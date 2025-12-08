import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

// Cria o contexto
const ActiveProfileContext = createContext();

// Hook para usar o contexto
export function useActiveProfile() {
  return useContext(ActiveProfileContext);
}

// Provider do contexto
export function ActiveProfileProvider({ children }) {
  const { user } = useUser();
  const [userProfiles, setUserProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    if (user) {
      const profiles = [];
      const tipos = user.tipos || [];

      // Perfil de Tutor
      if (user.tutor_id || tipos.some(t => t.tipo === 'tutor')) {
        profiles.push({
          id: user.tutor_id, // Pode ser null se ainda não tiver ID mas tiver role (raro com minhas mudanças)
          type: "tutor",
          name: user.nome ? `${user.nome} (Tutor)` : "Perfil Tutor",
          isActive: user.tipo_usuario === 'tutor'
        });
      }

      // Perfil de Veterinário
      if (user.veterinario_id || tipos.some(t => t.tipo === 'veterinario')) {
        profiles.push({
          id: user.veterinario_id,
          type: "veterinario",
          name: user.nome ? `Dr(a). ${user.nome}` : "Perfil Veterinário",
          isActive: user.tipo_usuario === 'veterinario'
        });
      }

      // Perfil de Anunciante (se houver lógica futura)
      if (tipos.some(t => t.tipo === 'anunciante')) {
        profiles.push({
          id: 'anunciante_id_placeholder',
          type: "anunciante",
          name: "Perfil Anunciante",
          isActive: user.tipo_usuario === 'anunciante'
        });
      }

      // Parceiro
      if (tipos.some(t => t.tipo === 'parceiro')) {
        profiles.push({
          id: 'parceiro_id_placeholder',
          type: "parceiro",
          name: "Perfil Parceiro",
          isActive: user.tipo_usuario === 'parceiro'
        });
      }

      setUserProfiles(profiles);

      // Define perfil ativo baseado no tipo atual do usuário
      const current = profiles.find(p => p.type === user.tipo_usuario) || profiles[0];
      setActiveProfile(current || null);
    } else {
      setUserProfiles([]);
      setActiveProfile(null);
    }
  }, [user]);

  // Função para trocar de perfil
  const switchProfile = (profileType) => {
    const newActiveProfile = userProfiles.find((p) => p.type === profileType);
    if (newActiveProfile) {
      setActiveProfile(newActiveProfile);
      console.log("Trocando para perfil:", newActiveProfile);
      // Aqui idealmente chamaria uma API para atualizar o 'tipo_usuario' atual na sessão/banco se persistente
    }
  };

  return (
    <ActiveProfileContext.Provider
      value={{
        activeProfile,
        userProfiles,
        switchProfile,
      }}
    >
      {children}
    </ActiveProfileContext.Provider>
  );
}
