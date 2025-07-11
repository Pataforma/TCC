import React from "react";
import { Card } from "react-bootstrap";

const SimpleChart = ({
  title,
  data,
  color = "#0DB2AC",
  height = 200,
  showLegend = true,
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
      <Card.Body className="p-4">
        <h6 className="fw-semibold text-dark mb-3">{title}</h6>

        <div className="d-flex align-items-end gap-2" style={{ height }}>
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-grow-1 d-flex flex-column align-items-center"
            >
              <div
                className="rounded-top"
                style={{
                  width: "100%",
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color,
                  minHeight: 4,
                  transition: "all 0.3s ease",
                }}
              />
              <span className="text-muted mt-2" style={{ fontSize: 12 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {showLegend && (
          <div className="mt-3 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted" style={{ fontSize: 13 }}>
                Total: {data.reduce((sum, item) => sum + item.value, 0)}
              </span>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: color,
                  }}
                />
                <span className="text-muted" style={{ fontSize: 13 }}>
                  {title}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SimpleChart;
