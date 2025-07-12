import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import LoadingPage from "../pages/LoadingPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

// HOC para proteção de rotas
export const withAuth = (Component, requiredRole = null) => {
  return (props) => {
    const { user, loading, perfilCompleto } = useUser();
    const location = useLocation();

    // Mostrar loading enquanto carrega
    if (loading) {
      return <LoadingPage />;
    }

    // Se não há usuário, redirecionar para login
    if (!user) {
      return <Navigate to="/telalogin" state={{ from: location }} replace />;
    }

    // Se perfil não está completo, redirecionar para completar perfil
    if (
      !perfilCompleto &&
      location.pathname !== "/tutor/perfil" &&
      location.pathname !== "/veterinario/perfil"
    ) {
      return <Navigate to="/tipo-usuario" replace />;
    }

    // Se há role específica requerida
    if (requiredRole && user.tipo_usuario !== requiredRole) {
      return <UnauthorizedPage />;
    }

    // Se tudo está ok, renderizar o componente
    return <Component {...props} />;
  };
};

// Componente para rotas públicas (que não precisam de auth)
export const PublicRoute = ({ children }) => {
  // Antes: redirecionava usuários autenticados para o dashboard
  // Agora: permite que todos vejam a Home normalmente
  return children;
};

// Componente para rotas que precisam de perfil completo
export const CompleteProfileRoute = ({ children }) => {
  const { user, loading, perfilCompleto } = useUser();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/telalogin" replace />;
  }

  if (!perfilCompleto) {
    return <Navigate to="/tipo-usuario" replace />;
  }

  return children;
};

// Componente para verificar se usuário é tutor
export const TutorRoute = ({ children }) => {
  // Durante o desenvolvimento, permitir acesso irrestrito
  return children;
};

// Componente para verificar se usuário é veterinário
export const VeterinarioRoute = ({ children }) => {
  // Durante o desenvolvimento, permitir acesso irrestrito
  return children;
};

// Componente para verificar se usuário é anunciante
export const AnuncianteRoute = ({ children }) => {
  // Durante o desenvolvimento, permitir acesso irrestrito
  return children;
};

// Componente para verificar se usuário é parceiro
export const ParceiroRoute = ({ children }) => {
  // Durante o desenvolvimento, permitir acesso irrestrito
  return children;
};

// Hook para verificar permissões
export const useAuth = () => {
  const { user, loading, perfilCompleto } = useUser();

  const isAuthenticated = !!user;
  const isProfileComplete = perfilCompleto;
  const userRole = user?.tipo_usuario;

  const hasRole = (role) => userRole === role;
  const hasAnyRole = (roles) => roles.includes(userRole);

  const isTutor = hasRole("tutor");
  const isVeterinario = hasRole("veterinario");
  const isAnunciante = hasRole("anunciante");
  const isParceiro = hasRole("parceiro");

  return {
    user,
    loading,
    isAuthenticated,
    isProfileComplete,
    userRole,
    hasRole,
    hasAnyRole,
    isTutor,
    isVeterinario,
    isAnunciante,
    isParceiro,
  };
};
