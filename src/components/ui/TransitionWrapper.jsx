import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoadingTransition from "./LoadingTransition";

function TransitionWrapper({ children }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    // Se a rota mudou, iniciar transição
    if (location.pathname !== currentPath) {
      setIsTransitioning(true);
      setIsLoading(true);

      // Pequeno delay para permitir que a transição seja visível
      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        setIsTransitioning(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPath]);

  const handleTransitionComplete = () => {
    setIsLoading(false);
  };

  // Se estiver carregando, mostrar LoadingTransition
  if (isLoading) {
    return (
      <LoadingTransition
        onComplete={handleTransitionComplete}
        timeout={500}
        message="Carregando página..."
        color="primary"
        size="large"
      />
    );
  }

  // Se estiver em transição, aplicar classe CSS
  const transitionClass = isTransitioning
    ? "page-transitioning"
    : "page-loaded";

  return (
    <div className={`transition-wrapper ${transitionClass}`}>{children}</div>
  );
}

export default TransitionWrapper;
