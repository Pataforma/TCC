import React from "react";
import { Card } from "react-bootstrap";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "primary",
  trend = null,
  trendLabel = "",
  subtitle = "",
  className = "",
}) => {
  const getColorClass = (color) => {
    const colorMap = {
      primary: "text-primary",
      success: "text-success",
      danger: "text-danger",
      warning: "text-warning",
      info: "text-info",
      secondary: "text-secondary",
      dark: "text-dark",
    };
    return colorMap[color] || "text-primary";
  };

  const getTrendIcon = (trend) => {
    if (trend === null || trend === 0) return null;
    return trend > 0 ? <FaArrowUp /> : <FaArrowDown />;
  };

  const getTrendColor = (trend) => {
    if (trend === null || trend === 0) return "text-muted";
    return trend > 0 ? "text-success" : "text-danger";
  };

  const formatTrend = (trend) => {
    if (trend === null || trend === 0) return "";
    const sign = trend > 0 ? "+" : "";
    return `${sign}${trend}%`;
  };

  return (
    <Card className={`border-0 shadow-sm h-100 ${className}`}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <div className={`${getColorClass(color)} me-2`}>
                {Icon && <Icon size={20} />}
              </div>
              <h6
                className="text-muted mb-0 fw-semibold"
                style={{ fontSize: "14px" }}
              >
                {title}
              </h6>
            </div>

            <h3 className="fw-bold mb-2" style={{ fontSize: "28px" }}>
              {value}
            </h3>

            {subtitle && (
              <p className="text-muted mb-2" style={{ fontSize: "13px" }}>
                {subtitle}
              </p>
            )}

            {/* Tendência/Comparativo */}
            {(trend !== null || trendLabel) && (
              <div className="d-flex align-items-center">
                {trend !== null && (
                  <span
                    className={`${getTrendColor(
                      trend
                    )} me-2 d-flex align-items-center`}
                    style={{ fontSize: "13px" }}
                  >
                    {getTrendIcon(trend)}
                    <span className="ms-1 fw-semibold">
                      {formatTrend(trend)}
                    </span>
                  </span>
                )}
                {trendLabel && (
                  <small className="text-muted" style={{ fontSize: "12px" }}>
                    {trendLabel}
                  </small>
                )}
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
