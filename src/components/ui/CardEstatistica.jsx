import React from "react";
import { Card } from "react-bootstrap";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "primary",
  trend,
  trendValue,
  onClick,
}) => {
  const colorMap = {
    primary: "#0DB2AC",
    secondary: "#FABA32",
    danger: "#FC694D",
    success: "#28a745",
    info: "#17a2b8",
    warning: "#ffc107",
  };

  const bgColor = colorMap[color] || colorMap.primary;

  return (
    <Card
      className="h-100 border-0 shadow-sm hover-lift cursor-pointer"
      style={{
        borderRadius: 16,
        transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h6
              className="text-muted mb-2 fw-semibold"
              style={{ fontSize: 14 }}
            >
              {title}
            </h6>
            <h3
              className="mb-2 fw-bold"
              style={{ color: bgColor, fontSize: 28 }}
            >
              {value}
            </h3>
            {trend && (
              <div className="d-flex align-items-center gap-1">
                <span
                  className={`fw-semibold ${
                    trend === "up" ? "text-success" : "text-danger"
                  }`}
                  style={{ fontSize: 13 }}
                >
                  {trend === "up" ? "↗" : "↘"} {trendValue}
                </span>
                <span className="text-muted" style={{ fontSize: 12 }}>
                  vs mês anterior
                </span>
              </div>
            )}
          </div>
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 48,
              height: 48,
              backgroundColor: `${bgColor}15`,
              color: bgColor,
            }}
          >
            <Icon size={20} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
