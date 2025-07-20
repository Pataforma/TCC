import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function TransitionWrapper({ children }) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    // Se a rota mudou, iniciar transição
    if (location.pathname !== currentPath) {
      setIsTransitioning(true);

      // Pequeno delay para permitir que a transição seja visível
      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        setIsTransitioning(false);
      }, 150); // Reduzido de 100ms para 150ms para transição mais suave

      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPath]);

  // Aplicar classe CSS baseada no estado de transição
  const transitionClass = isTransitioning
    ? "page-transitioning"
    : "page-loaded";

  return (
    <div className={`transition-wrapper ${transitionClass}`}>{children}</div>
  );
}

export default TransitionWrapper;
