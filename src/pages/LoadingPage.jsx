import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingTransition from '../components/LoadingTransition';

function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);
  
  // Extrai o próximo destino dos parâmetros da URL (se disponível)
  const params = new URLSearchParams(location.search);
  const nextRoute = params.get('next') || '/';
  const message = params.get('message') || 'Carregando...';
  const timeout = parseInt(params.get('timeout') || '2000', 10);
  
  // Gerencia a transição após o carregamento
  const handleLoadingComplete = () => {
    setShowLoader(false);
    // Pequeno atraso para permitir a animação de saída
    setTimeout(() => {
      navigate(nextRoute);
    }, 300);
  };
  
  return (
    <div className="loading-page">
      {showLoader && (
        <LoadingTransition 
          onComplete={handleLoadingComplete}
          message={message}
          timeout={timeout}
          color="secondary"
          size="large"
        />
      )}
    </div>
  );
}

export default LoadingPage; 