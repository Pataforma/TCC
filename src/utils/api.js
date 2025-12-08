// Utilitário para chamadas à API do backend
// Alterado para usar caminho relativo e passar pelo proxy do Nginx (evita CORS)
const API_BASE_URL = '/api';

// Função para fazer requisições autenticadas
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  // Se for FormData, não definir Content-Type (deixar o browser definir com boundary)
  const isFormData = options.body instanceof FormData;

  // Preparar headers - remover Content-Type se for FormData
  const headers = { ...options.headers };
  if (isFormData) {
    // Remover Content-Type para FormData - o browser define automaticamente com boundary
    delete headers['Content-Type'];
  } else if (!headers['Content-Type']) {
    // Apenas definir Content-Type se não for FormData e não foi definido manualmente
    headers['Content-Type'] = 'application/json';
  }

  // Adicionar token de autenticação
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Se não conseguir parsear JSON, usar statusText
      errorMessage = response.statusText || errorMessage;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  // Se a resposta estiver vazia, retornar null
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }

  return response.json();
};

// Métodos HTTP helpers
export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => {
    // Se data for FormData, usar diretamente, senão fazer JSON.stringify
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body,
    });
  },
  put: (endpoint, data, options) => apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

// Auth helpers
export const auth = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },
  loginGoogle: async (token) => {
    const response = await api.post('/auth/google-login', { token });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

