import React from "react";
import { Card } from "react-bootstrap";
import styles from "./StatCard.module.css";

const StatCard = ({ 
  title, 
  value, 
  color = "primary", 
  icon: Icon,
  subtitle,
  className = "" 
}) => {
  return (
    <Card className={`${styles.statCard} ${className}`}>
      <Card.Body className="text-center">
        {Icon && <Icon className={`text-${color} mb-2`} size={24} />}
        <h3 className={`fw-bold text-${color} mb-1`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <small className="text-muted">{title}</small>
        {subtitle && <div className="text-muted mt-1"><small>{subtitle}</small></div>}
      </Card.Body>
    </Card>
  );
};

export default StatCard; 