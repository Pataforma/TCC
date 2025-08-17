import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "../utils/supabase";

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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        dispatch({ type: ACTIONS.SET_USER, payload: null });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return;
      }

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from("usuario")
        .select("*")
        .eq("email", session.user.email)
        .eq("status", "ativo")
        .single();

      if (userError && userError.code !== "PGRST116") {
        throw userError;
      }

      const user = userData || { email: session.user.email };
      dispatch({ type: ACTIONS.SET_USER, payload: user });

      // Verificar se perfil está completo
      // Prioriza o campo booleano `perfil_completo` quando existir
      const perfilCompleto =
        userData?.perfil_completo === true ||
        !!(
          userData?.nome &&
          userData?.telefone &&
          userData?.tipo_usuario &&
          userData?.tipo_usuario !== "pendente"
        );
      dispatch({ type: ACTIONS.SET_PERFIL_COMPLETO, payload: perfilCompleto });

      // Se usuário existe, buscar dados em paralelo para melhor performance
      if (userData?.id_usuario) {
        await Promise.all([
          fetchPets(userData.id_usuario),
          fetchConsultas(userData.id_usuario),
          fetchLembretes(userData.id_usuario),
        ]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Buscar pets do usuário
  const fetchPets = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("usuario_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      dispatch({ type: ACTIONS.SET_PETS, payload: data || [] });
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Buscar consultas do usuário
  const fetchConsultas = async (userId) => {
    try {
      // Mock data por enquanto - substituir por query real
      const consultasMock = [
        {
          id: 1,
          data: "2024-01-20",
          horario: "14:30",
          pet: "Thor",
          veterinario: "Dr. André Silva",
          clinica: "Clínica Veterinária Pataforma",
          tipo: "Consulta de Rotina",
          valor: "R$ 120,00",
          isTelemedicina: true,
        },
      ];
      dispatch({ type: ACTIONS.SET_CONSULTAS, payload: consultasMock });
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
    }
  };

  // Buscar lembretes do usuário
  const fetchLembretes = async (userId) => {
    try {
      // Mock data por enquanto - substituir por query real
      const lembretesMock = [
        {
          id: 1,
          tipo: "vacina",
          titulo: "Vacina Antirrábica",
          pet: "Luna",
          data: "2024-01-20",
          urgente: true,
          descricao: "Vacina antirrábica está pendente há 5 dias",
        },
      ];
      dispatch({ type: ACTIONS.SET_LEMBRETES, payload: lembretesMock });
    } catch (error) {
      console.error("Erro ao buscar lembretes:", error);
    }
  };

  // Adicionar pet
  const addPet = async (petData) => {
    try {
      const { data, error } = await supabase
        .from("pets")
        .insert(petData)
        .select()
        .single();

      if (error) throw error;
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
      const { data, error } = await supabase
        .from("pets")
        .update(petData)
        .eq("id", petId)
        .select()
        .single();

      if (error) throw error;
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
      const { error } = await supabase.from("pets").delete().eq("id", petId);

      if (error) throw error;
      dispatch({ type: ACTIONS.DELETE_PET, payload: petId });
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Limpar dados (logout)
  const clearData = () => {
    dispatch({ type: ACTIONS.CLEAR_DATA });
  };

  // Atualizar perfil do usuário
  const updateUserProfile = async (profileData) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("usuario")
        .update(profileData)
        .eq("email", session.user.email)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: ACTIONS.SET_USER, payload: data });
      dispatch({
        type: ACTIONS.SET_PERFIL_COMPLETO,
        payload:
          data.perfil_completo === true ||
          !!(
            data.nome &&
            data.telefone &&
            data.tipo_usuario &&
            data.tipo_usuario !== "pendente"
          ),
      });

      return data;
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
