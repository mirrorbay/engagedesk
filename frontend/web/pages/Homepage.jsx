import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  FileSpreadsheet,
  Mail,
  Calendar,
  FolderOpen,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  Star,
} from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import HomepageHeader from "../components/homepage/HomepageHeader";
import HomepageFooter from "../components/homepage/HomepageFooter";
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
      icon: <FileSpreadsheet size={20} />,
      title: "Worksheet Data Manager",
      description: "Spreadsheet-like interface for client data organization",
    },
    {
      icon: <Mail size={20} />,
      title: "Intelligent Communication",
      description: "Email sending with open/click tracking and fast templates",
    },
    {
      icon: <Calendar size={20} />,
      title: "Calendar & Actions",
      description: "Scheduling and task management in one place",
    },
    {
      icon: <FolderOpen size={20} />,
      title: "Client Storage Folders",
      description: "Organized file management by client",
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp size={24} />,
      title: "Raise Client Traction",
      description:
        "Stay on top of follow-ups and identify engagement opportunities early to keep clients engaged and coming back.",
    },
    {
      icon: <Users size={24} />,
      title: "Save Time Daily",
      description:
        "Streamline tracking and centralize communications to focus on what matters most - serving clients.",
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Free & Flexible",
      description:
        "Access professional-grade tools at zero cost while adapting workflows to your business needs.",
    },
  ];

  const testimonials = [
    {
      name: "Susan Oliver",
      role: "Car Dealership Manager",
      company: "Premier Auto Group",
      quote:
        "EngageDesk transformed how we track customer interactions. Our follow-up rate increased 40% and customer satisfaction scores are at an all-time high.",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Landscape Contractor",
      company: "GreenScape Solutions",
      quote:
        "Managing project timelines and client communications used to be chaos. Now everything is organized in one place, and clients love the professional updates.",
      rating: 5,
    },
    {
      name: "Jennifer Walsh",
      role: "Property Manager",
      company: "Coastal Properties",
      quote:
        "The client folders feature is a game-changer. I can instantly access any tenant document or maintenance record. It's saved me hours every week.",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Independent Coach",
      company: "Peak Performance Coaching",
      quote:
        "The email templates and tracking help me stay connected with clients between sessions. My client retention has improved significantly.",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      role: "Wellness Practitioner",
      company: "Radiant Skin & Wellness",
      quote:
        "Scheduling and client progress tracking are seamless now. My clients appreciate the organized approach and consistent communication.",
      rating: 5,
    },
    {
      name: "Robert Martinez",
      role: "Loan Broker",
      company: "Secure Lending Partners",
      quote:
        "EngageDesk keeps all client documentation organized and helps me stay on top of application deadlines. My closing rate has increased 25%.",
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
            <h1 className={styles.heroTitle}>
              Transform Client Interactions Into Lasting Business Relationships
            </h1>
            <p className={styles.heroSubtitle}>
              EngageDesk equips service professionals with essential tools -
              intelligent communication, progress tracking, scheduling, and file
              management - to create consistent client journeys that drive
              retention and growth.
            </p>

            <div className={styles.heroMeta}>
              <span className={styles.metaItem}>Intuitive</span>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.metaItem}>Intelligent</span>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.metaItem}>Free</span>
            </div>

            <form onSubmit={handleSubmit} className={styles.heroForm}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.ctaButton}>
                Get Started
                <ArrowRight size={16} />
              </button>
            </form>
            <div className={styles.heroLinks}>
              <button
                onClick={() => navigate("/demo")}
                className={styles.demoLink}
              >
                See Demo
              </button>
            </div>
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
        </div>
      </section>

      {/* Benefits */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Built for Client Engagement Success
          </h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Trusted by Service Professionals
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

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Transform Your Client Relationships?
            </h2>
            <p className={styles.ctaDescription}>
              Join service professionals who have streamlined their operations
              and increased client retention with EngageDesk.
            </p>
            <div className={styles.ctaActions}>
              <button
                onClick={handleGetStarted}
                className={styles.finalCtaButton}
              >
                Start Your Free Account
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/demo")}
                className={styles.demoLink}
              >
                See Demo
              </button>
            </div>
          </div>
        </div>
      </section>
      <HomepageFooter />
    </div>
  );
};

export default Homepage;
