import React from "react";
import { useNavigate } from "react-router-dom";
import { X, CreditCard } from "lucide-react";
import "../styles/global.css";
import styles from "../styles/subscription.module.css";

function SubscriptionCancelPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.subscriptionContainer}>
      <div className={styles.subscriptionHeader}>
        <div className={styles.cancelIcon}>
          <X size={64} />
        </div>
        <h1 className={styles.subscriptionTitle}>Payment Cancelled</h1>
        <p className={styles.subscriptionSubtitle}>
          No worries! You can try again anytime.
        </p>
      </div>

      <div className={styles.cancelDetails}>
        <div className={styles.successCard}>
          <h2>What happened?</h2>
          <p>
            Your payment was cancelled and no charges were made to your account.
            You can return to the subscription page to try again or choose a
            different plan.
          </p>

          <div className={styles.cancelReasons}>
            <h3>Common reasons for cancellation:</h3>
            <ul>
              <li>Changed your mind about the plan</li>
              <li>Want to compare different options</li>
              <li>Payment method issues</li>
              <li>Need to discuss with family/team</li>
            </ul>
          </div>

          <div className={styles.cancelHelp}>
            <p>
              <strong>Need help?</strong> If you experienced any technical
              issues during checkout, please contact our support team and we'll
              be happy to assist you.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.successActions}>
        <button
          onClick={() => navigate("/login")}
          className={styles.tryAgainButton}
        >
          <CreditCard size={18} />
          CONTINUE
        </button>
      </div>
    </div>
  );
}

export default SubscriptionCancelPage;
