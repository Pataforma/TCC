import React from "react";
import styles from "./DashboardCEO.module.css";

// Dados mockados
const kpis = [
  { label: "Veterinários", value: 42 },
  { label: "Tutores", value: 320 },
  { label: "Pets cadastrados", value: 870 },
  { label: "Consultas este mês", value: 128 },
];

const faturamento = [
  { mes: "Jan", valor: 12000 },
  { mes: "Fev", valor: 13500 },
  { mes: "Mar", valor: 14200 },
  { mes: "Abr", valor: 15800 },
  { mes: "Mai", valor: 17000 },
];

const parceiros = [
  { nome: "Clínica VetVida", cidade: "São Paulo", status: "Ativo" },
  { nome: "PetCare", cidade: "Campinas", status: "Ativo" },
  { nome: "AmigoPet", cidade: "Ribeirão Preto", status: "Pendente" },
];

export default function DashboardCEO() {
  return (
    <div className={styles.container}>
      <h1>Dashboard Administrativo (CEO)</h1>
      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <span className={styles.kpiValue}>{kpi.value}</span>
            <span className={styles.kpiLabel}>{kpi.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h2>Faturamento Mensal</h2>
          <div className={styles.barChart}>
            {faturamento.map((item) => (
              <div key={item.mes} className={styles.barItem}>
                <div
                  className={styles.bar}
                  style={{ height: `${item.valor / 200}px` }}
                  title={`R$ ${item.valor}`}
                />
                <span className={styles.barLabel}>{item.mes}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.mapCard}>
          <h2>Parceiros por Cidade</h2>
          <ul className={styles.partnerList}>
            {parceiros.map((p) => (
              <li key={p.nome}>
                <strong>{p.nome}</strong> - {p.cidade}{" "}
                <span
                  className={
                    styles.status + " " + styles[p.status.toLowerCase()]
                  }
                >
                  ({p.status})
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.mapPlaceholder}>
            <span>Mapa (mock)</span>
          </div>
        </div>
      </div>
      <div className={styles.tableSection}>
        <h2>Parceiros Recentes</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {parceiros.map((p) => (
              <tr key={p.nome}>
                <td>{p.nome}</td>
                <td>{p.cidade}</td>
                <td>
                  <span
                    className={
                      styles.status + " " + styles[p.status.toLowerCase()]
                    }
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
