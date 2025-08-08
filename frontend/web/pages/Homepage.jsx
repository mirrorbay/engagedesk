import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Calendar,
  FolderOpen,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Star,
} from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import HomepageHeader from "../components/homepage/HomepageHeader";
import HomepageFooter from "../components/homepage/HomepageFooter";
import WorksheetScreenshot from "../components/homepage/WorksheetScreenshot";
import EmailScreenshot from "../components/homepage/EmailScreenshot";
import CalendarScreenshot from "../components/homepage/CalendarScreenshot";
import styles from "../styles/homepage.module.css";

const Homepage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { isAuthenticated, logout } = useAuth();

  // Automatically log out authenticated users when they visit homepage
  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  const handleGetStarted = () => {
    if (email.trim()) {
      // Navigate to register with email as URL parameter
      navigate(`/register?email=${encodeURIComponent(email.trim())}`);
    } else {
      // If no email provided, just go to register page
      navigate("/register");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGetStarted();
  };

  const coreFeatures = [
    {
      icon: <Mail size={24} />,
      title: "Email Tracking & Templates",
      description: "See opens and clicks in real-time",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Smart Pipeline Manager",
      description: "Automatic lead scoring and updates",
    },
    {
      icon: <Calendar size={24} />,
      title: "Calendar Integration",
      description: "Seamless appointment scheduling",
    },
    {
      icon: <FolderOpen size={24} />,
      title: "Client File Storage",
      description: "Instant access to any document",
    },
  ];

  const problemSolutions = [
    {
      icon: <CheckCircle size={20} />,
      title: "Know exactly when clients engage with your emails",
    },
    {
      icon: <CheckCircle size={20} />,
      title: "Automatic pipeline updates save 10+ hours weekly",
    },
    {
      icon: <CheckCircle size={20} />,
      title: "Smart lead scoring shows you who's ready to buy",
    },
  ];

  const testimonials = [
    {
      name: "Marcus Johnson",
      role: "Car Dealership Manager",
      company: "Premier Auto Sales",
      quote:
        "Follow-up rate increased from 30% to 85%. We're closing deals that would have walked away before. The email tracking shows exactly when customers are ready to buy.",
      rating: 5,
    },
    {
      name: "Jennifer Walsh",
      role: "Gym Manager",
      company: "FitLife Wellness Center",
      quote:
        "Member retention improved dramatically, 40% more signups from better follow-ups. I can see who's engaged and who needs attention. The automated sequences converted trial members consistently.",
      rating: 5,
    },
    {
      name: "Robert Martinez",
      role: "Mortgage Broker",
      company: "Secure Home Lending",
      quote:
        "Closed 3 extra deals last month from better timing. Game changer for managing my pipeline. The client file storage keeps everything organized and accessible.",
      rating: 5,
    },
    {
      name: "Amanda Foster",
      role: "Pest Control Manager",
      company: "Guardian Pest Solutions",
      quote:
        "Customer callbacks increased 60% with automated reminders. Seasonal follow-ups are automatic now and our recurring service retention is at an all-time high.",
      rating: 5,
    },
  ];

  return (
    <div className={styles.homepage}>
      <HomepageHeader onLogin={handleGetStarted} />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroMeta}>
              <span className={styles.metaItem}>Intuitive</span>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.metaItem}>Intelligent</span>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.metaItem}>Free</span>
            </div>

            <h1 className={styles.heroTitle}>
              Free CRM That Tracks Every Client Interaction
            </h1>
            <p className={styles.heroSubtitle}>
              See exactly when clients open your emails. Know who's ready to
              buy. No cost, no limits.
            </p>

            <form onSubmit={handleSubmit} className={styles.heroForm}>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  placeholder="Enter email for instant access"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  required
                />
                <button type="submit" className={styles.ctaButton}>
                  Start Now
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className={styles.socialProofLine}>
                Join 2,800+ professionals
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Moved to position #2 */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Proven Results for Professionals
          </h2>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <div className={styles.testimonialRating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className={styles.starIcon} />
                  ))}
                </div>
                <blockquote className={styles.testimonialQuote}>
                  "{testimonial.quote}"
                </blockquote>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>{testimonial.name}</div>
                    <div className={styles.authorRole}>
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className={styles.problemSolution}>
        <div className={styles.container}>
          <h2 className={styles.problemTitle}>
            Track Every Client Interaction That Matters
          </h2>
          <div className={styles.solutionsList}>
            {problemSolutions.map((solution, index) => (
              <div key={index} className={styles.solutionItem}>
                <div className={styles.solutionIcon}>{solution.icon}</div>
                <span className={styles.solutionText}>{solution.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Essential Tools for Service Professionals
          </h2>
          <div className={styles.featuresGrid}>
            {coreFeatures.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.demoLinkContainer}>
            <button
              onClick={() => navigate("/demo")}
              className={styles.demoLinkButton}
            >
              See How It Works
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className={styles.screenshots}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>See Your CRM in Action</h2>
          <div className={styles.screenshotsGrid}>
            <div className={styles.screenshotItem}>
              <WorksheetScreenshot />
              <div className={styles.screenshotCaption}>
                <h3>Client Data Manager</h3>
                <p>
                  Track all your clients in one organized view with real-time
                  updates
                </p>
              </div>
            </div>
            <div className={styles.screenshotItem}>
              <EmailScreenshot />
              <div className={styles.screenshotCaption}>
                <h3>Email Tracking</h3>
                <p>
                  See exactly when clients open your emails and click your links
                </p>
              </div>
            </div>
            <div className={styles.screenshotItem}>
              <CalendarScreenshot />
              <div className={styles.screenshotCaption}>
                <h3>Calendar & Actions</h3>
                <p>
                  Never miss a follow-up with integrated calendar and task
                  management
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Start Tracking Client Engagement Today
            </h2>
            <p className={styles.ctaDescription}>
              Join 2,800+ professionals who track every client interaction
            </p>
            <div className={styles.ctaActions}>
              <button
                onClick={handleGetStarted}
                className={styles.finalCtaButton}
              >
                Start Now
                <ArrowRight size={16} />
              </button>
            </div>
            <div className={styles.ctaMeta}>
              <span className={styles.metaItem}>Free</span>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.metaItem}>Easy Setup</span>
            </div>
          </div>
        </div>
      </section>
      <HomepageFooter />
    </div>
  );
};

export default Homepage;
