import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Play } from "lucide-react";
import subscriptionApi from "../services/subscriptionApi";
import "../styles/global.css";
import styles from "../styles/subscription.module.css";

function SubscriptionSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const planType = searchParams.get("plan");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    if (sessionId) {
      // Handle paid subscription success
      handleSuccessfulPayment();
    } else if (planType === "free") {
      // Handle free plan activation success
      handleFreePlanSuccess();
    } else {
      setError("No session ID or plan type found. Please try again.");
      setLoading(false);
    }
  }, [sessionId, planType]);

  // Track Purchase event when subscription data is loaded
  useEffect(() => {
    if (subscriptionData && subscriptionData.amount_paid > 0) {
      if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
        window.fbq("track", "Purchase", {
          content_name: "DaVinci Focus Subscription",
          content_category: "Education",
          value: subscriptionData.amount_paid,
          currency: "USD",
        });
        console.log(
          "[Facebook Pixel] Purchase event tracked for amount:",
          subscriptionData.amount_paid
        );
      }
    }
  }, [subscriptionData]);

  const handleSuccessfulPayment = async () => {
    try {
      setLoading(true);
      const result = await subscriptionApi.handleSuccessfulPayment(sessionId);
      setSubscriptionData(result.subscription);
      // Auth context will be automatically refreshed via subscriptionUpdated event
    } catch (err) {
      console.error("Error processing payment:", err);
      setError(
        err.message || "Failed to process payment. Please contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFreePlanSuccess = async () => {
    try {
      setLoading(true);
      // For free plan, we just need to get the current subscription status
      const result = await subscriptionApi.getSubscriptionStatus();
      setSubscriptionData({
        plan: "free",
        amount_paid: 0,
        trial_end: null,
        current_period_end: result.current_period_end,
      });
      // Auth context will be automatically refreshed via subscriptionUpdated event
    } catch (err) {
      console.error("Error getting free plan status:", err);
      setError(
        err.message ||
          "Failed to get subscription status. Please contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanDisplayName = (plan) => {
    const planNames = {
      free: "Free Plan",
      quarterly: "Quarterly Plan",
      unlimited: "Unlimited Plan",
    };
    return planNames[plan] || plan;
  };

  if (loading) {
    return (
      <div className={styles.subscriptionContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Processing your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.subscriptionContainer}>
        <div className={styles.subscriptionHeader}>
          <h1 className={styles.subscriptionTitle}>Payment Error</h1>
          <div className={styles.errorMessage}>{error}</div>
          <div className={styles.backToHome}>
            <button
              onClick={() => navigate("/subscription")}
              className={styles.backButton}
            >
              ← Back to Subscription
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.subscriptionContainer}>
      <div className={styles.subscriptionHeader}>
        <div className={styles.successIcon}>
          <Check size={64} />
        </div>
        <h1 className={styles.subscriptionTitle}>
          {subscriptionData?.plan === "free"
            ? "Free Plan Activated!"
            : "Payment Successful!"}
        </h1>
        <p className={styles.subscriptionSubtitle}>
          Your child's personalized learning journey begins now
        </p>
      </div>

      {subscriptionData && (
        <div className={styles.successDetails}>
          <div className={styles.successCard}>
            <h2>Subscription Details</h2>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Plan:</span>
              <span className={styles.detailValue}>
                {getPlanDisplayName(subscriptionData.plan)}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Amount Paid:</span>
              <span className={styles.detailValue}>
                {formatPrice(subscriptionData.amount_paid)}
              </span>
            </div>

            {subscriptionData.trial_end && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Refund Period Ends:</span>
                <span className={styles.detailValue}>
                  {formatDate(subscriptionData.trial_end)}
                </span>
              </div>
            )}

            <div className={styles.successMessage}>
              <p>
                🎉 Your child now has access to all premium features! Help them
                start their learning journey with unlimited study sessions,
                personalized learning paths, and detailed progress tracking.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.successActions}>
        <button
          onClick={() => navigate("/user-info")}
          className={styles.startLearningButton}
        >
          <Play size={18} />
          START LEARNING
        </button>
      </div>
    </div>
  );
}

export default SubscriptionSuccessPage;
