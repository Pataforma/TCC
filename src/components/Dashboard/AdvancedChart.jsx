import React from "react";
import { Card } from "react-bootstrap";

const AdvancedChart = ({
  data,
  xKey,
  yKeys,
  height = 300,
  title = "",
  type = "bar",
  showLegend = true,
}) => {
  // Função para calcular valores máximos para escalas
  const getMaxValue = () => {
    let max = 0;
    data.forEach((item) => {
      yKeys.forEach((yKey) => {
        if (item[yKey.key] > max) {
          max = item[yKey.key];
        }
      });
    });
    return max;
  };

  const maxValue = getMaxValue();
  const chartHeight = height - 60; // Espaço para legendas e labels

  // Função para calcular posição Y
  const getYPosition = (value) => {
    return chartHeight - (value / maxValue) * chartHeight;
  };

  // Função para calcular largura da barra
  const getBarWidth = () => {
    return (100 / data.length) * 0.8; // 80% da largura disponível
  };

  const renderBarChart = () => {
    const barWidth = getBarWidth();

    return (
      <div className="position-relative" style={{ height: chartHeight }}>
        {/* Linhas de grade */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <div
            key={percent}
            className="position-absolute border-bottom"
            style={{
              top: `${percent}%`,
              left: 0,
              right: 0,
              borderColor: "#e9ecef",
              zIndex: 1,
            }}
          />
        ))}

        {/* Barras */}
        <div className="d-flex align-items-end justify-content-between h-100 px-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="d-flex flex-column align-items-center"
              style={{ width: `${barWidth}%` }}
            >
              {yKeys.map((yKey, yIndex) => (
                <div
                  key={yKey.key}
                  className="position-relative mb-1"
                  style={{
                    width: "100%",
                    height: `${(item[yKey.key] / maxValue) * 100}%`,
                    backgroundColor: yKey.color,
                    borderRadius: "4px 4px 0 0",
                    minHeight: "4px",
                  }}
                  title={`${yKey.label}: ${item[yKey.key]}`}
                />
              ))}
              <small
                className="text-muted mt-2"
                style={{ fontSize: "11px", transform: "rotate(-45deg)" }}
              >
                {item[xKey]}
              </small>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const pointRadius = 4;

    return (
      <div className="position-relative" style={{ height: chartHeight }}>
        {/* Linhas de grade */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <div
            key={percent}
            className="position-absolute border-bottom"
            style={{
              top: `${percent}%`,
              left: 0,
              right: 0,
              borderColor: "#e9ecef",
              zIndex: 1,
            }}
          />
        ))}

        {/* Linhas e pontos */}
        <svg
          width="100%"
          height="100%"
          className="position-absolute"
          style={{ zIndex: 2 }}
        >
          {yKeys.map((yKey, yIndex) => {
            const points = data
              .map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = getYPosition(item[yKey.key]);
                return `${x}%,${y}%`;
              })
              .join(" ");

            return (
              <g key={yKey.key}>
                {/* Linha */}
                <polyline
                  fill="none"
                  stroke={yKey.color}
                  strokeWidth="2"
                  points={points}
                />
                {/* Pontos */}
                {data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = getYPosition(item[yKey.key]);
                  return (
                    <circle
                      key={index}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r={pointRadius}
                      fill={yKey.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Labels do eixo X */}
        <div className="d-flex justify-content-between px-3 mt-2">
          {data.map((item, index) => (
            <small
              key={index}
              className="text-muted"
              style={{ fontSize: "11px" }}
            >
              {item[xKey]}
            </small>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: chartHeight }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const radius = 80;
            const centerX = 100;
            const centerY = 100;

            const x1 =
              centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
            const y1 =
              centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
            const x2 =
              centerX +
              radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 =
              centerY +
              radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ");

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div style={{ height }}>
      {title && (
        <div className="mb-3">
          <h6 className="mb-0">{title}</h6>
        </div>
      )}

      {renderChart()}

      {showLegend && yKeys.length > 1 && (
        <div className="d-flex justify-content-center gap-4 mt-3">
          {yKeys.map((yKey, index) => (
            <div key={yKey.key} className="d-flex align-items-center">
              <div
                className="me-2"
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: yKey.color,
                  borderRadius: "2px",
                }}
              />
              <small className="text-muted">{yKey.label}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedChart;
