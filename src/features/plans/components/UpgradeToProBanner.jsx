import React from "react";
import { useSubscription } from "../contexts/SubscriptionContext";
import styles from "./UpgradeToProBanner.module.css";

export default function UpgradeToProBanner() {
  const { plan, upgradeToAdvanced } = useSubscription();

  if (plan === "advanced") return null;

  return (
    <div className={styles.banner}>
      <span>Desbloqueie recursos avançados para sua clínica!</span>
      <button onClick={upgradeToAdvanced} className={styles.button}>
        Fazer upgrade para Advanced
      </button>
    </div>
  );
}
