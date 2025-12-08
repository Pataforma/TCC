import React from "react";

const ErrorDisplay = ({
  title = "Erro",
  message,
  type = "danger",
  showRetry = true,
  showConfig = false,
  onRetry,
  onConfig,
  className = "",
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleConfig = () => {
    if (onConfig) {
      onConfig();
    } else {
      window.location.href = "/tipo-usuario";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return "fas fa-exclamation-triangle";
      case "info":
        return "fas fa-info-circle";
      case "success":
        return "fas fa-check-circle";
      default:
        return "fas fa-exclamation-triangle";
    }
  };

  const getAlertClass = () => {
    switch (type) {
      case "warning":
        return "alert-warning";
      case "info":
        return "alert-info";
      case "success":
        return "alert-success";
      default:
        return "alert-danger";
    }
  };

  return (
    <div className={`container text-center py-5 ${className}`}>
      <div className={`alert ${getAlertClass()}`} role="alert">
        <h4 className="alert-heading">
          <i className={`${getIcon()} me-2`}></i>
          {title}
        </h4>
        <p className="mb-3">{message}</p>
        <hr />
        <div className="d-flex justify-content-center gap-2">
          {showRetry && (
            <button className="btn btn-outline-primary" onClick={handleRetry}>
              <i className="fas fa-redo me-2"></i>
              Tentar Novamente
            </button>
          )}
          {showConfig && (
            <button
              className="btn btn-outline-secondary"
              onClick={handleConfig}
            >
              <i className="fas fa-user-cog me-2"></i>
              Configurar Perfil
            </button>
          )}
        </div>
        <p className="mb-0 mt-3 small text-muted">
          Entre em contato com o suporte se o problema persistir.
        </p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
