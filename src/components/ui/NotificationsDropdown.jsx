import React, { useState } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import {
  FaBell,
  FaEnvelope,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const NotificationsDropdown = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: "message",
      title: "Nova mensagem",
      message: "Você recebeu uma nova mensagem do Dr. Silva",
      time: "2 min atrás",
      read: false,
      icon: FaEnvelope,
    },
    {
      id: 2,
      type: "appointment",
      title: "Consulta confirmada",
      message: "Sua consulta para amanhã foi confirmada",
      time: "1 hora atrás",
      read: false,
      icon: FaCalendarAlt,
    },
    {
      id: 3,
      type: "alert",
      title: "Vacina vencendo",
      message: "A vacina do seu pet Luna vence em 7 dias",
      time: "3 horas atrás",
      read: true,
      icon: FaExclamationTriangle,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIconColor = (type) => {
    switch (type) {
      case "message":
        return "text-primary";
      case "appointment":
        return "text-success";
      case "alert":
        return "text-warning";
      default:
        return "text-muted";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return FaEnvelope;
      case "appointment":
        return FaCalendarAlt;
      case "alert":
        return FaExclamationTriangle;
      default:
        return FaBell;
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
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <Dropdown.Item
                key={notification.id}
                className={`py-3 ${!notification.read ? "bg-light" : ""}`}
                style={{ borderBottom: "1px solid #f0f0f0" }}
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
                    <small className="text-muted">{notification.time}</small>
                  </div>
                </div>
              </Dropdown.Item>
            );
          })
        )}

        <Dropdown.Divider />

        <Dropdown.Item className="text-center text-primary fw-semibold">
          Ver todas as notificações
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;
