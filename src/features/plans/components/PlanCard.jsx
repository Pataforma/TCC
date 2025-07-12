import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import styles from "./PlanCard.module.css";

export default function PlanCard({ planData, onSelect }) {
  return (
    <div
      className={`${styles.card} ${planData.isFeatured ? styles.featured : ""}`}
    >
      {planData.isFeatured && (
        <div className={styles.featuredBadge}>Mais Popular</div>
      )}

      <div className={styles.header}>
        <h2 className={styles.planName}>{planData.name}</h2>
        <div className={styles.priceContainer}>
          <span className={styles.price}>{planData.price}</span>
          <span className={styles.billingCycle}>{planData.billingCycle}</span>
        </div>
        <p className={styles.description}>{planData.description}</p>
      </div>

      <div className={styles.features}>
        <h3>Funcionalidades incluídas:</h3>
        <ul>
          {planData.features.map((feature, index) => (
            <li
              key={index}
              className={`${styles.feature} ${
                !feature.available ? styles.unavailable : ""
              }`}
            >
              <span className={styles.icon}>
                {feature.available ? (
                  <FaCheck className={styles.checkIcon} />
                ) : (
                  <FaTimes className={styles.timesIcon} />
                )}
              </span>
              <span className={styles.featureText}>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.cta}>
        <button
          className={`${styles.ctaButton} ${
            planData.isFeatured ? styles.featuredButton : ""
          }`}
          onClick={onSelect}
        >
          {planData.ctaText}
        </button>
      </div>
    </div>
  );
}
