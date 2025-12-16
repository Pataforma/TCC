import React from "react";
import { Dropdown, Badge } from "react-bootstrap";
import {
  FaBell,
  FaEnvelope,
  FaUserMd,
  FaUser,
} from "react-icons/fa";
import { useNotifications } from "../../contexts/NotificationContext";

const NotificationsDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  const getIconColor = (type) => {
    switch (type) {
      case "mensagem_veterinario":
        return "text-primary";
      case "mensagem_tutor":
        return "text-info";
      default:
        return "text-muted";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "mensagem_veterinario":
        return FaUserMd;
      case "mensagem_tutor":
        return FaUser;
      default:
        return FaEnvelope;
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'agora';
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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.onClick) {
      notification.onClick();
    }
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="link"
        className="btn btn-link text-muted p-2 position-relative"
        style={{ textDecoration: "none" }}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle rounded-pill"
            style={{
              fontSize: "10px",
              transform: "translate(-50%, -50%)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="shadow-lg border-0"
        style={{ minWidth: 320, maxHeight: 400, overflowY: "auto" }}
      >
        <Dropdown.Header className="fw-bold text-dark d-flex justify-content-between align-items-center">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Badge bg="primary" className="ms-2">
              {unreadCount} nova{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
        </Dropdown.Header>

        <Dropdown.Divider />

        {notifications.length === 0 ? (
          <Dropdown.Item className="text-center text-muted py-3">
            Nenhuma notificação
          </Dropdown.Item>
        ) : (
          <>
            {notifications.slice(0, 10).map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <Dropdown.Item
                  key={notification.id}
                  className={`py-3 ${!notification.read ? "bg-light" : ""}`}
                  style={{ 
                    borderBottom: "1px solid #f0f0f0",
                    cursor: notification.onClick ? 'pointer' : 'default'
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="d-flex align-items-start gap-3">
                    <div className={`${getIconColor(notification.type)} mt-1`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6
                          className="mb-1 fw-semibold"
                          style={{ fontSize: "14px" }}
                        >
                          {notification.title}
                        </h6>
                        {!notification.read && (
                          <div
                            className="bg-primary rounded-circle ms-2"
                            style={{ width: 8, height: 8, minWidth: 8 }}
                          />
                        )}
                      </div>
                      <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
                        {notification.message}
                      </p>
                      <small className="text-muted">{formatTime(notification.timestamp)}</small>
                    </div>
                  </div>
                </Dropdown.Item>
              );
            })}
            {notifications.length > 10 && (
              <Dropdown.Item className="text-center text-muted py-2" disabled>
                +{notifications.length - 10} notificações antigas
              </Dropdown.Item>
            )}
          </>
        )}

        {notifications.length > 0 && (
          <>
            <Dropdown.Divider />
            <Dropdown.Item 
              className="text-center text-primary fw-semibold"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;
