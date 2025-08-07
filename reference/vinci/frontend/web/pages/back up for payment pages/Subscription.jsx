import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Star,
  Gift,
  Calendar,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import subscriptionApi from "../services/subscriptionApi";
import { useAuth } from "../hooks/useAuthContext.jsx";
import styles from "../styles/subscription.module.css";

function SubscriptionPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State
  const [plans, setPlans] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [canceling, setCanceling] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Testimonials data
  const testimonials = [
    {
      quote:
        "My son's confidence has grown so much. He's not frustrated anymore and actually enjoys learning.",
      author: "Tyler Brooks",
      location: "Parent • Boise, Idaho",
    },
    {
      quote:
        "No more battles. My daughter sits down and focuses without constant reminders.",
      author: "Amanda C.",
      location: "Parent • Burlingame, California",
    },
    {
      quote:
        "I've seen remarkable improvement in classroom focus. Students show better sustained attention during lessons.",
      author: "Marcus J.",
      location: "Teacher • Burlington, Vermont",
    },
    {
      quote:
        "Perfect for my granddaughter's attention span. The gentle approach reduced her learning anxiety significantly.",
      author: "Jake Morrison",
      location: "Guardian • Singapore",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Carousel navigation functions
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Load data on component mount
  useEffect(() => {
    loadInitialData();

    // Track ViewContent event for landing page (where Facebook ads direct users)
    if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
      window.fbq("track", "ViewContent", {
        content_name: "DaVinci Focus Subscription Page",
        content_category: "Education",
        value: 0.0,
        currency: "USD",
      });
      console.log(
        "[Facebook Pixel] ViewContent event tracked for subscription landing page"
      );
    }

    // Check if user was redirected back with a selected plan or expired subscription
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlan = urlParams.get("selectedPlan");
    const isExpired = urlParams.get("expired") === "true";

    if (selectedPlan) {
      // Auto-select the plan they were trying to choose
      setTimeout(() => {
        handleSelectPlan(selectedPlan);
      }, 1000); // Small delay to ensure page is loaded

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    if (isExpired) {
      // Show expired subscription message
      setError(
        "Your subscription has expired. Please select a plan to renew and continue using the features."
      );

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      // Always show plans to everyone (authenticated or not)
      let plansData, statusData;

      if (isAuthenticated) {
        // Get subscription status for authenticated users
        [plansData, statusData] = await Promise.all([
          subscriptionApi.getPlans(),
          subscriptionApi.getSubscriptionStatus(),
        ]);
        setSubscriptionStatus(statusData);
      } else {
        // Just get plans for unauthenticated users
        plansData = await subscriptionApi.getPlans();
        setSubscriptionStatus(null);
      }

      setPlans(plansData);
    } catch (err) {
      console.error("Error loading subscription data:", err);
      setError("Failed to load subscription information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId, retryCount = 0) => {
    const maxRetries = 2;

    try {
      setProcessingPlan(planId);
      setError("");

      // Track InitiateCheckout event when user selects a plan
      if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
        const planConfig = plans.find((p) => p.id === planId);
        window.fbq("track", "InitiateCheckout", {
          content_name: planConfig
            ? planConfig.name
            : "DaVinci Focus Subscription",
          content_category: "Education",
          value: planConfig ? planConfig.price : 0.0,
          currency: "USD",
        });
        console.log(
          "[Facebook Pixel] InitiateCheckout event tracked for plan:",
          planId
        );
      }

      // Check authentication before proceeding (both dev and production)
      if (!isAuthenticated) {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        navigate(`/login?redirect=${returnUrl}&plan=${planId}`);
        return;
      }

      // Process plan selection (free plan or paid plan)
      const result = await subscriptionApi.createCheckoutSession(planId);

      // Handle free plan activation
      if (result.freePlanActivated) {
        // Track CompleteRegistration for free plan signup
        if (
          typeof window !== "undefined" &&
          typeof window.fbq !== "undefined"
        ) {
          window.fbq("track", "CompleteRegistration", {
            content_name: "Free Trial Signup",
            content_category: "Education",
            value: 0.0,
            currency: "USD",
          });
          console.log(
            "[Facebook Pixel] CompleteRegistration event tracked for free plan"
          );
        }

        // Redirect to success page for free plan (consistent with paid plans)
        navigate("/subscription/success?plan=free");
        return;
      }

      // Handle paid plans - redirect to Stripe Checkout
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Error processing plan selection:", err);

      // Retry for network errors
      if (
        retryCount < maxRetries &&
        (err.message.includes("Connection error") ||
          err.message.includes("temporarily unavailable"))
      ) {
        console.log(`Retrying plan selection ${retryCount + 1}/${maxRetries}`);
        setTimeout(() => {
          handleSelectPlan(planId, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }

      // Show user-friendly error message
      let errorMessage = err.message;
      if (err.message.includes("log in again")) {
        // Redirect to login if authentication failed
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (err.message.includes("already have an active subscription")) {
        // Refresh page to show current subscription
        setTimeout(() => {
          loadInitialData();
        }, 1000);
      }

      setError(
        errorMessage || "Failed to process plan selection. Please try again."
      );
      setProcessingPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    const isInTrial = subscriptionStatus?.isInTrialPeriod;
    const confirmMessage = isInTrial
      ? "Are you sure you want to cancel your subscription (you will receive a full refund)?"
      : "Are you sure you want to cancel your subscription?";

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setCanceling(true);
      setError("");
      setSuccess("");

      const response = await subscriptionApi.cancelSubscription();

      // Show success message based on whether refund was issued
      if (response.refunded) {
        setSuccess(
          "✅ Subscription canceled successfully! Your refund has been processed and you will see it in your account within 5-10 business days."
        );
      } else {
        setSuccess("✅ Subscription canceled successfully!");
      }

      // Refresh data to show updated status
      await loadInitialData();
    } catch (err) {
      console.error("Error canceling subscription:", err);
      setError(
        err.message || "Failed to cancel subscription. Please try again."
      );
    } finally {
      setCanceling(false);
    }
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case "free":
        return <Gift size={24} />;
      case "quarterly":
        return <Calendar size={24} />;
      default:
        return <Gift size={24} />;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  const determineSubscriptionState = (subscription) => {
    if (!subscription)
      return {
        state: "none",
        displayText: "No Subscription",
        cssClass: "none",
      };

    if (subscription.canAccessPaidFeatures) {
      return subscription.isInTrialPeriod
        ? { state: "trial", displayText: "Trial Active", cssClass: "trial" }
        : { state: "active", displayText: "Active", cssClass: "active" };
    }

    return subscription.plan
      ? { state: "expired", displayText: "Expired", cssClass: "expired" }
      : { state: "none", displayText: "No Subscription", cssClass: "none" };
  };

  const getSubscriptionDisplayInfo = () => {
    return determineSubscriptionState(subscriptionStatus);
  };

  if (loading) {
    return (
      <div className={styles.subscriptionContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.subscriptionContainer}>
      {/* Header */}
      <div className={styles.subscriptionHeader}>
        <h1 className={styles.subscriptionTitle}>
          Help your child with attention struggles succeed in school
        </h1>
        <p className={styles.subscriptionSubtitle}>
          DaVinci Focus helps kids with attention challenges, including those
          with ADHD-like difficulties, build focus through math practice. Spend
          10-15 minutes daily supervising your child - we handle the teaching.
          Kids love it, you see clear progress, grades improve in weeks.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>87%</span>
            <span className={styles.statText}>
              improved focus within 2 weeks
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>25%</span>
            <span className={styles.statText}>
              better test scores in first month
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>5 min</span>
            <span className={styles.statText}>
              daily sessions fit any schedule
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Success Message */}
      {success && <div className={styles.successMessage}>{success}</div>}

      {/* Current Subscription Status */}
      {subscriptionStatus?.plan && (
        <div className={styles.currentSubscription}>
          <h2>Current Subscription</h2>
          <div className={styles.subscriptionCard}>
            <div className={styles.subscriptionInfo}>
              <div className={styles.subscriptionPlan}>
                {subscriptionStatus?.plan && (
                  <span className={styles.planName}>
                    {plans.find((p) => p.id === subscriptionStatus.plan)
                      ?.name || subscriptionStatus.plan}
                  </span>
                )}
                <span
                  className={`${styles.subscriptionStatus} ${
                    styles[getSubscriptionDisplayInfo().cssClass]
                  }`}
                >
                  {getSubscriptionDisplayInfo().displayText.toUpperCase()}
                </span>
              </div>

              {subscriptionStatus.trial_end &&
                subscriptionStatus.isInTrialPeriod && (
                  <p className={styles.trialInfo}>
                    Risk-free refund period ends on{" "}
                    {formatDate(subscriptionStatus.trial_end)}
                  </p>
                )}
            </div>

            <div className={styles.subscriptionActions}>
              {subscriptionStatus.canAccessPaidFeatures && (
                <>
                  {subscriptionStatus.isInTrialPeriod && (
                    <button
                      onClick={handleCancelSubscription}
                      className={styles.cancelButton}
                      disabled={canceling}
                    >
                      {canceling ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          Canceling...
                        </>
                      ) : (
                        "Cancel & Refund (Trial Period)"
                      )}
                    </button>
                  )}
                  {!subscriptionStatus.isInTrialPeriod &&
                    subscriptionStatus.plan === "free" && (
                      <button
                        onClick={handleCancelSubscription}
                        className={styles.cancelButton}
                        disabled={canceling}
                      >
                        {canceling ? (
                          <>
                            <div className={styles.buttonSpinner}></div>
                            Canceling...
                          </>
                        ) : (
                          "Cancel Free Plan"
                        )}
                      </button>
                    )}
                  {!subscriptionStatus.isInTrialPeriod &&
                    subscriptionStatus.plan !== "free" && (
                      <p className={styles.noRefundMessage}>
                        Cancellation with refund is only available during the
                        trial period
                      </p>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Value Proposition Section */}
      {(!subscriptionStatus?.plan ||
        !subscriptionStatus?.canAccessPaidFeatures) && (
        <div className={styles.valueSection}>
          <h2 className={styles.valueTitle}>Why parents choose us</h2>
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>1</div>
              <h3>Children love it</h3>
              <p>Instant wins build confidence. Children eagerly engage.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>2</div>
              <h3>Grades improve</h3>
              <p>
                Higher test scores, better focus. Teachers notice the
                difference.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>3</div>
              <h3>You feel in control</h3>
              <p>
                Clear tracking, simple tools. Finally a solution that works.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>4</div>
              <h3>See results fast</h3>
              <p>
                Progress in days, not months. Quick wins build lasting habits.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>5</div>
              <h3>Simple to use</h3>
              <p>No setup or tutorials. Works without adding stress.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>6</div>
              <h3>Fits busy life</h3>
              <p>5-minute sessions. Works around meltdowns and chaos.</p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      {(!subscriptionStatus?.plan ||
        !subscriptionStatus?.canAccessPaidFeatures) && (
        <div className={styles.plansSection}>
          <h2 className={styles.plansTitle}>
            Choose the plan that works for your family
          </h2>
          <p className={styles.plansSubtitle}>
            Start with our free trial to see immediate results, then continue
            with the plan that fits your needs.
          </p>
          <div className={styles.plansGrid}>
            {plans
              .filter((plan) => plan.id !== "unlimited") // Remove unlimited plan display
              .map((plan) => {
                // Check if free plan is disabled (already used)
                const isFreePlanDisabled =
                  plan.id === "free" &&
                  subscriptionStatus &&
                  !subscriptionStatus.canUseFreeplan;

                return (
                  <div
                    key={plan.id}
                    className={`${styles.planCard} ${
                      plan.recommended ? styles.recommended : ""
                    } ${isFreePlanDisabled ? styles.disabled : ""}`}
                    onClick={() =>
                      !isFreePlanDisabled &&
                      processingPlan !== plan.id &&
                      handleSelectPlan(plan.id)
                    }
                    style={{
                      cursor:
                        isFreePlanDisabled || processingPlan === plan.id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {/* Recommended Badge */}
                    {plan.recommended && (
                      <div className={styles.recommendedBadge}>
                        <Star size={12} className={styles.badgeIcon} />
                        <span>We Recommend Starting Here</span>
                      </div>
                    )}

                    {/* Plan Content */}
                    <div className={styles.planContent}>
                      {/* Plan Header */}
                      <div className={styles.planHeader}>
                        <div className={styles.planIcon}>
                          {getPlanIcon(plan.id)}
                        </div>
                        <h3 className={styles.planName}>{plan.name}</h3>
                        <p className={styles.planDescription}>
                          {plan.description}
                        </p>
                      </div>

                      {/* Plan Pricing */}
                      <div className={styles.planPricing}>
                        <div className={styles.planPrice}>
                          {formatPrice(plan.price)}
                          {plan.id === "quarterly" && (
                            <span className={styles.planInterval}>
                              /quarter
                            </span>
                          )}
                          {plan.recurring && plan.id !== "quarterly" && (
                            <span className={styles.planInterval}>
                              /
                              {plan.recurring.interval_count > 1
                                ? `${plan.recurring.interval_count} ${plan.recurring.interval}s`
                                : plan.recurring.interval}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Plan Features */}
                      <div className={styles.planFeatures}>
                        {plan.id === "free" && (
                          <>
                            <div className={styles.feature}>
                              <Check size={16} className={styles.featureIcon} />
                              <span>
                                Focus training for attention challenges
                              </span>
                            </div>
                            <div className={styles.feature}>
                              <Check size={16} className={styles.featureIcon} />
                              <span>Math skills that improve grades</span>
                            </div>
                            <div className={styles.feature}>
                              <Check size={16} className={styles.featureIcon} />
                              <span>5-minute daily sessions</span>
                            </div>
                            <div className={styles.feature}>
                              <Check size={16} className={styles.featureIcon} />
                              <span>Parent progress dashboard</span>
                            </div>
                          </>
                        )}
                        {plan.id === "quarterly" && (
                          <>
                            <div className={styles.feature}>
                              <Check size={16} className={styles.featureIcon} />
                              <span>Everything in free plan</span>
                            </div>
                            <div className={styles.featureDivider}>PLUS</div>
                            <div className={styles.feature}>
                              <Check size={16} className={styles.featureIcon} />
                              <span>Expert ADHD guidance</span>
                            </div>
                            <div className={styles.feature}>
                              <Check size={16} className={styles.featureIcon} />
                              <span>Personalized learning path</span>
                            </div>
                            <div className={styles.feature}>
                              <Check size={16} className={styles.featureIcon} />
                              <span>Priority parent support</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Plan Footer */}
                      <div className={styles.planFooter}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPlan(plan.id);
                          }}
                          disabled={
                            processingPlan === plan.id || isFreePlanDisabled
                          }
                          className={`${styles.selectPlanButton} ${
                            isFreePlanDisabled ? styles.disabled : ""
                          }`}
                        >
                          {processingPlan === plan.id ? (
                            <>
                              <div className={styles.buttonSpinner}></div>
                              Processing...
                            </>
                          ) : isFreePlanDisabled ? (
                            "Already Used"
                          ) : (
                            "Get started"
                          )}
                        </button>

                        {plan.cancelPeriodDays > 0 &&
                          !isFreePlanDisabled &&
                          plan.id !== "free" && (
                            <p className={styles.cancelPolicy}>
                              Try risk-free for {plan.cancelPeriodDays} days
                            </p>
                          )}

                        {plan.id === "free" &&
                          plan.cancelPeriodDays > 0 &&
                          !isFreePlanDisabled && (
                            <p className={styles.cancelPolicy}>
                              Try risk-free for {plan.cancelPeriodDays} days
                            </p>
                          )}

                        {isFreePlanDisabled && (
                          <p className={styles.cancelPolicy}>
                            You've experienced the value - continue with premium
                            features
                          </p>
                        )}

                        {plan.id === "free" && !isFreePlanDisabled && (
                          <p className={styles.cancelPolicy}>
                            No payment info needed, start immediately
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      {(!subscriptionStatus?.plan ||
        !subscriptionStatus?.canAccessPaidFeatures) && (
        <div className={styles.testimonialsSection}>
          <h2 className={styles.testimonialsTitle}>
            Parents see the difference
          </h2>
          <p className={styles.testimonialsSubtitle}>
            Real results from families dealing with attention challenges and
            school struggles.
          </p>

          <div className={styles.testimonialsContainer}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.starRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={styles.starFilled} size={16} />
                  ))}
                </div>
                <Quote className={styles.quoteIcon} size={32} />
              </div>

              <div className={styles.testimonialContent}>
                <p className={styles.testimonialQuote}>
                  {testimonials[currentTestimonial].quote}
                </p>
              </div>

              <div className={styles.testimonialFooter}>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>
                    <span>
                      {testimonials[currentTestimonial].author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>
                      {testimonials[currentTestimonial].author}
                    </span>
                    <span className={styles.authorLocation}>
                      {testimonials[currentTestimonial].location}
                    </span>
                  </div>
                </div>

                <div className={styles.carouselControls}>
                  <a
                    onClick={prevTestimonial}
                    className={styles.carouselButton}
                    aria-label="Previous testimonial"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        prevTestimonial();
                      }
                    }}
                  >
                    <ChevronLeft size={18} />
                  </a>
                  <span className={styles.carouselCounter}>
                    {currentTestimonial + 1} / {testimonials.length}
                  </span>
                  <a
                    onClick={nextTestimonial}
                    className={styles.carouselButton}
                    aria-label="Next testimonial"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        nextTestimonial();
                      }
                    }}
                  >
                    <ChevronRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final CTA Section */}
      {(!subscriptionStatus?.plan ||
        !subscriptionStatus?.canAccessPaidFeatures) && (
        <div className={styles.finalCta}>
          <h2 className={styles.finalCtaTitle}>
            Stop the struggle. Start the success.
          </h2>
          <p className={styles.finalCtaText}>
            Your child with attention struggles can focus, learn, and succeed.
            See results in days, not months. Join parents who finally found what
            works.
          </p>
          <div className={styles.finalCtaStats}>
            <span className={styles.finalCtaStat}>
              500+ families already seeing results
            </span>
          </div>
          <div className={styles.finalCtaButtons}>
            <button
              onClick={() => handleSelectPlan("free")}
              className={styles.primaryCtaButton}
              disabled={loading}
            >
              Start free - see results in days
            </button>
          </div>
          <div className={styles.finalGuarantee}>
            <span>Risk-free trial • No payment required • Cancel anytime</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionPage;
