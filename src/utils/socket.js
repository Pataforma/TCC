import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token = null) => {
  if (socket?.connected) {
    return socket;
  }

  const authToken = token || localStorage.getItem('token');
  if (!authToken) {
    console.warn('Token não encontrado para conectar socket');
    return null;
  }

  // Determinar URL do WebSocket baseado no ambiente
  let SOCKET_URL;
  if (import.meta.env.VITE_API_URL) {
    // Se tiver variável de ambiente, usar ela
    SOCKET_URL = import.meta.env.VITE_API_URL.replace(/^http/, 'ws');
  } else if (window.location.protocol === 'https:') {
    // Produção: usar wss://backend.pataformapet.com.br
    SOCKET_URL = 'wss://backend.pataformapet.com.br';
  } else {
    // Desenvolvimento local
    SOCKET_URL = 'ws://localhost:3487';
  }
  
  socket = io(SOCKET_URL, {
    auth: {
      token: authToken,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('[Socket] Conectado:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Desconectado');
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Erro de conexão:', error);
  });
  
  socket.on('new:message', (mensagem) => {
    console.log('[Socket] Nova mensagem recebida (listener global):', mensagem);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

export default socket;

