import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FaEnvelope, FaUserMd, FaUser, FaTimes } from 'react-icons/fa';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationToast = () => {
  const { notifications, removeNotification, markAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'mensagem_veterinario':
        return <FaUserMd className="text-primary" />;
      case 'mensagem_tutor':
        return <FaUser className="text-info" />;
      default:
        return <FaEnvelope className="text-secondary" />;
    }
  };

  const getVariant = (type) => {
    switch (type) {
      case 'mensagem_veterinario':
        return 'primary';
      case 'mensagem_tutor':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) {
      return 'agora';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min atrás`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else {
      return time.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const handleClick = (notification) => {
    markAsRead(notification.id);
    if (notification.onClick) {
      notification.onClick();
    }
  };

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{ zIndex: 9999 }}
    >
      {notifications
        .filter((n) => !n.read && n.showToast !== false)
        .slice(0, 5) // Máximo 5 toasts visíveis
        .map((notification) => (
          <Toast
            key={notification.id}
            onClose={() => removeNotification(notification.id)}
            onClick={() => handleClick(notification)}
            delay={notification.duration || 5000}
            autohide={notification.autoClose !== false}
            bg={getVariant(notification.type)}
            className="mb-2 shadow-lg"
            style={{ cursor: notification.onClick ? 'pointer' : 'default', minWidth: 300 }}
          >
            <Toast.Header className="bg-transparent border-0 text-white">
              <div className="me-2">{getIcon(notification.type)}</div>
              <strong className="me-auto text-white">{notification.title}</strong>
              <small className="text-white-50">{formatTime(notification.timestamp)}</small>
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                aria-label="Close"
              />
            </Toast.Header>
            <Toast.Body className="text-white">
              {notification.message}
            </Toast.Body>
          </Toast>
        ))}
    </ToastContainer>
  );
};

export default NotificationToast;


