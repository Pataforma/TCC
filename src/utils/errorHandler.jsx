import React from "react";

// Sistema centralizado de tratamento de erros

// Tipos de erro
export const ERROR_TYPES = {
  NETWORK: "NETWORK",
  AUTH: "AUTH",
  VALIDATION: "VALIDATION",
  DATABASE: "DATABASE",
  UPLOAD: "UPLOAD",
  UNKNOWN: "UNKNOWN",
};

// Mapeamento de códigos de erro do Supabase
const SUPABASE_ERROR_MAP = {
  PGRST116: "Nenhum registro encontrado",
  23505: "Registro já existe",
  23503: "Erro de referência - registro relacionado não existe",
  23514: "Violação de restrição de dados",
  "42P01": "Tabela não encontrada",
  42703: "Coluna não encontrada",
  42601: "Erro de sintaxe SQL",
  28000: "Erro de autenticação",
  "28P01": "Credenciais inválidas",
  "3D000": "Banco de dados não existe",
  "57P01": "Conexão cancelada",
  "57P02": "Conexão perdida",
  "57P03": "Conexão não pode ser estabelecida",
};

// Função para classificar o tipo de erro
export const classifyError = (error) => {
  if (error.message?.includes("network") || error.message?.includes("fetch")) {
    return ERROR_TYPES.NETWORK;
  }

  if (error.message?.includes("auth") || error.message?.includes("login")) {
    return ERROR_TYPES.AUTH;
  }

  if (
    error.message?.includes("validation") ||
    error.message?.includes("required")
  ) {
    return ERROR_TYPES.VALIDATION;
  }

  if (error.message?.includes("upload") || error.message?.includes("file")) {
    return ERROR_TYPES.UPLOAD;
  }

  if (error.code && SUPABASE_ERROR_MAP[error.code]) {
    return ERROR_TYPES.DATABASE;
  }

  return ERROR_TYPES.UNKNOWN;
};

// Função para obter mensagem amigável do erro
export const getErrorMessage = (error) => {
  const errorType = classifyError(error);

  // Erros do Supabase
  if (error.code && SUPABASE_ERROR_MAP[error.code]) {
    return SUPABASE_ERROR_MAP[error.code];
  }

  // Mensagens específicas por tipo
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      return "Erro de conexão. Verifique sua internet e tente novamente.";

    case ERROR_TYPES.AUTH:
      if (error.message?.includes("Invalid login credentials")) {
        return "Email ou senha incorretos.";
      }
      if (error.message?.includes("User already registered")) {
        return "Já existe um usuário cadastrado com este email.";
      }
      return "Erro de autenticação. Faça login novamente.";

    case ERROR_TYPES.VALIDATION:
      return "Dados inválidos. Verifique as informações e tente novamente.";

    case ERROR_TYPES.UPLOAD:
      return "Erro ao fazer upload do arquivo. Tente novamente.";

    case ERROR_TYPES.DATABASE:
      return "Erro no banco de dados. Tente novamente em alguns instantes.";

    default:
      return error.message || "Ocorreu um erro inesperado. Tente novamente.";
  }
};

// Função para log de erro (para monitoramento)
export const logError = (error, context = "") => {
  const errorInfo = {
    message: error.message,
    code: error.code,
    type: classifyError(error),
    context,
    timestamp: new Date().toISOString(),
    stack: error.stack,
  };

  // Log no console em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    console.error("Erro capturado:", errorInfo);
  }

  // Aqui você pode integrar com serviços como Sentry, LogRocket, etc.
  // Sentry.captureException(error, { extra: errorInfo });

  return errorInfo;
};

// Hook para tratamento de erros
export const useErrorHandler = () => {
  const handleError = (error, context = "") => {
    const errorInfo = logError(error, context);
    const userMessage = getErrorMessage(error);

    // Retorna informações para o componente usar
    return {
      userMessage,
      errorInfo,
      type: classifyError(error),
    };
  };

  return handleError;
};

// Componente Error Boundary
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, "ErrorBoundary");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="container text-center py-5">
            <h2>Ops! Algo deu errado</h2>
            <p>Ocorreu um erro inesperado. Por favor, recarregue a página.</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Função para mostrar notificações de erro
export const showErrorNotification = (message, type = "error") => {
  // Aqui você pode integrar com qualquer biblioteca de notificações
  // como react-toastify, react-hot-toast, etc.

  // Por enquanto, usando alert (substituir por notificação mais elegante)
  if (type === "error") {
    alert(`Erro: ${message}`);
  } else {
    alert(message);
  }
};

// Função para mostrar notificações de sucesso
export const showSuccessNotification = (message) => {
  // Mesmo que acima, integrar com biblioteca de notificações
  alert(`Sucesso: ${message}`);
};

// Função para validar campos obrigatórios
export const validateRequiredFields = (data, requiredFields) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      errors[field] = `${field} é obrigatório`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Função para validar email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar telefone brasileiro
export const validatePhone = (phone) => {
  const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};
