import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

  // Extrai o próximo destino dos parâmetros da URL (se disponível)
  const params = new URLSearchParams(location.search);
  const nextRoute = params.get("next") || "/";
  const message = params.get("message") || "Carregando...";
  const timeout = parseInt(params.get("timeout") || "2000", 10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      navigate(nextRoute);
    }, timeout);

    return () => clearTimeout(timer);
  }, [navigate, nextRoute, timeout]);

  return showLoader ? (
    <LoadingSpinner
      size="large"
      variant="primary"
      fullscreen={true}
      text={message}
    />
  ) : null;
}

export default LoadingPage;
