import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api, auth } from "../utils/api";

// Estado inicial
const initialState = {
  user: null,
  pets: [],
  consultas: [],
  lembretes: [],
  loading: true,
  error: null,
  perfilCompleto: false,
};

// Tipos de ações
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
  SET_PETS: "SET_PETS",
  SET_CONSULTAS: "SET_CONSULTAS",
  SET_LEMBRETES: "SET_LEMBRETES",
  SET_ERROR: "SET_ERROR",
  SET_PERFIL_COMPLETO: "SET_PERFIL_COMPLETO",
  ADD_PET: "ADD_PET",
  UPDATE_PET: "UPDATE_PET",
  DELETE_PET: "DELETE_PET",
  CLEAR_DATA: "CLEAR_DATA",
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };

    case ACTIONS.SET_PETS:
      return { ...state, pets: action.payload };

    case ACTIONS.SET_CONSULTAS:
      return { ...state, consultas: action.payload };

    case ACTIONS.SET_LEMBRETES:
      return { ...state, lembretes: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.SET_PERFIL_COMPLETO:
      return { ...state, perfilCompleto: action.payload };

    case ACTIONS.ADD_PET:
      return { ...state, pets: [...state.pets, action.payload] };

    case ACTIONS.UPDATE_PET:
      return {
        ...state,
        pets: state.pets.map((pet) =>
          pet.id === action.payload.id ? action.payload : pet
        ),
      };

    case ACTIONS.DELETE_PET:
      return {
        ...state,
        pets: state.pets.filter((pet) => pet.id !== action.payload),
      };

    case ACTIONS.CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};

// Context
const UserContext = createContext();

// Provider
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Buscar dados do usuário
  const fetchUserData = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      // Verificar se há token
      if (!auth.isAuthenticated()) {
        dispatch({ type: ACTIONS.SET_USER, payload: null });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return;
      }

      // Buscar dados do usuário
      const userData = await api.get("/auth/me");

      if (!userData) {
        dispatch({ type: ACTIONS.SET_USER, payload: null });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return;
      }

      // Garantir que tipos seja um array
      const tipos = userData.tipos || [];
      
      dispatch({ type: ACTIONS.SET_USER, payload: { ...userData, tipos } });

      // Verificar se perfil está completo
      // Primeiro, verificar se o tipo atual tem perfil_completo = true em usuario_tipos
      const tipoAtual = tipos.find(t => t.tipo === userData.tipo_usuario);
      let perfilCompleto = false;
      
      if (tipoAtual && tipoAtual.perfil_completo === true) {
        // Se o tipo atual tem perfil_completo = true, usar esse valor
        perfilCompleto = true;
        console.log('✅ [UserContext] Perfil completo baseado em usuario_tipos para tipo:', userData.tipo_usuario);
      } else {
        // Fallback: verificar perfil_completo geral ou campos obrigatórios
        perfilCompleto =
          userData.perfil_completo === true ||
          !!(
            userData.nome &&
            userData.telefone &&
            userData.tipo_usuario &&
            userData.tipo_usuario !== "pendente"
          );
        console.log('ℹ️  [UserContext] Perfil completo calculado via fallback:', perfilCompleto);
      }
      
      dispatch({ type: ACTIONS.SET_PERFIL_COMPLETO, payload: perfilCompleto });

      // Se usuário existe, buscar dados em paralelo
      if (userData.id_usuario) {
        await Promise.all([
          fetchPets(),
          fetchConsultas(),
          fetchLembretes(),
        ]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      // Se erro 401 ou 403, limpar token
      if (error.status === 401 || error.status === 403 || 
          error.message.includes("401") || error.message.includes("403") || 
          error.message.includes("Token") || error.message.includes("não autenticado")) {
        auth.logout();
        dispatch({ type: ACTIONS.SET_USER, payload: null });
      }
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Buscar pets do usuário
  const fetchPets = async () => {
    try {
      const data = await api.get("/pets");
      dispatch({ type: ACTIONS.SET_PETS, payload: data || [] });
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Buscar consultas do usuário
  const fetchConsultas = async () => {
    try {
      const data = await api.get("/consultas");
      dispatch({ type: ACTIONS.SET_CONSULTAS, payload: data || [] });
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
      // Não é crítico, pode continuar sem consultas
    }
  };

  // Buscar lembretes do usuário
  const fetchLembretes = async () => {
    try {
      const data = await api.get("/lembretes");
      dispatch({ type: ACTIONS.SET_LEMBRETES, payload: data || [] });
    } catch (error) {
      console.error("Erro ao buscar lembretes:", error);
      // Não é crítico, pode continuar sem lembretes
    }
  };

  // Adicionar pet
  const addPet = async (petData) => {
    try {
      const response = await api.post("/pets", petData);
      const data = response.pet || response;
      dispatch({ type: ACTIONS.ADD_PET, payload: data });
      return data;
    } catch (error) {
      console.error("Erro ao adicionar pet:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Atualizar pet
  const updatePet = async (petId, petData) => {
    try {
      const response = await api.put(`/pets/${petId}`, petData);
      const data = response.pet || response;
      dispatch({ type: ACTIONS.UPDATE_PET, payload: data });
      return data;
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Deletar pet
  const deletePet = async (petId) => {
    try {
      await api.delete(`/pets/${petId}`);
      dispatch({ type: ACTIONS.DELETE_PET, payload: petId });
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Limpar dados (logout)
  const clearData = () => {
    auth.logout();
    dispatch({ type: ACTIONS.CLEAR_DATA });
  };

  // Atualizar perfil do usuário
  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put("/usuarios/perfil", profileData);
      const data = response.user || response;

      // Garantir que tipos seja um array
      const tipos = data.tipos || [];
      const userData = { ...data, tipos };
      
      dispatch({ type: ACTIONS.SET_USER, payload: userData });
      
      // Verificar se perfil está completo baseado no tipo atual
      const tipoAtual = tipos.find(t => t.tipo === data.tipo_usuario);
      let perfilCompleto = false;
      
      if (tipoAtual && tipoAtual.perfil_completo === true) {
        perfilCompleto = true;
      } else {
        perfilCompleto =
          data.perfil_completo === true ||
          !!(
            data.nome &&
            data.telefone &&
            data.tipo_usuario &&
            data.tipo_usuario !== "pendente"
          );
      }
      
      dispatch({ type: ACTIONS.SET_PERFIL_COMPLETO, payload: perfilCompleto });

      return userData;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Efeito para buscar dados iniciais
  useEffect(() => {
    fetchUserData();
  }, []);

  const value = {
    ...state,
    fetchUserData,
    fetchPets,
    fetchConsultas,
    fetchLembretes,
    addPet,
    updatePet,
    deletePet,
    updateUserProfile,
    clearData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook personalizado
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
