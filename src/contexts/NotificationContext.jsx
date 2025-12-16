import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUser } from './UserContext';
import { connectSocket, getSocket, disconnectSocket } from '../utils/socket';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUser();

  // Adicionar notificação
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      ...notification,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
    
    // Auto-remover após 5 segundos (opcional)
    if (notification.autoClose !== false) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration || 5000);
    }
    
    return newNotification.id;
  }, []);

  // Remover notificação
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  // Marcar como lida
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id && !n.read) {
          setUnreadCount((count) => Math.max(0, count - 1));
          return { ...n, read: true };
        }
        return n;
      })
    );
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Limpar todas as notificações
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Escutar mensagens via WebSocket
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Usar socket existente ou conectar
    const socket = getSocket() || connectSocket(token);
    if (!socket) return;

    // Escutar novas mensagens
    const handleNewMessage = (mensagem) => {
      console.log('[NotificationContext] Nova mensagem recebida:', mensagem);
      
      // Determinar tipo de notificação baseado no remetente
      const isFromVeterinario = mensagem.remetente_tipo === 'veterinario';
      const isFromTutor = mensagem.remetente_tipo === 'tutor';
      
      // Verificar se o usuário atual é o destinatário
      // O usuário pode ter múltiplos perfis, então verificamos ambos
      const userIsTutor = user.tipos?.some(t => t.tipo === 'tutor') || user.tipo_usuario === 'tutor';
      const userIsVeterinario = user.tipos?.some(t => t.tipo === 'veterinario') || user.tipo_usuario === 'veterinario';
      
      const isDestinatario = 
        (isFromVeterinario && userIsTutor) ||
        (isFromTutor && userIsVeterinario);
      
      if (isDestinatario) {
        const tipoNotificacao = isFromVeterinario 
          ? 'mensagem_veterinario' 
          : 'mensagem_tutor';
        
        const titulo = isFromVeterinario
          ? 'Nova mensagem de veterinário'
          : 'Nova mensagem de tutor';
        
        const mensagemTexto = mensagem.conteudo 
          ? (mensagem.conteudo.length > 50 
              ? mensagem.conteudo.substring(0, 50) + '...' 
              : mensagem.conteudo)
          : 'Nova mensagem recebida';
        
        addNotification({
          type: tipoNotificacao,
          title: titulo,
          message: mensagemTexto,
          icon: 'message',
          onClick: () => {
            // Navegar para a página de mensagens/chat baseado no tipo atual do usuário
            const tipoAtual = user.tipo_usuario;
            if (tipoAtual === 'tutor') {
              window.location.href = '/dashboard/tutor/mensagens';
            } else if (tipoAtual === 'veterinario') {
              window.location.href = '/dashboard/veterinario/chat';
            }
          },
          data: {
            conversa_id: mensagem.conversa_id,
            mensagem_id: mensagem.id,
          },
        });
      }
    };

    socket.on('new:message', handleNewMessage);

    return () => {
      // Não desconectar o socket aqui, pois pode estar sendo usado por outros componentes
      socket.off('new:message', handleNewMessage);
    };
  }, [user, addNotification]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

