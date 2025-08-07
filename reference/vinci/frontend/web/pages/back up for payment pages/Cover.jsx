import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Users,
  TrendingUp,
  BookOpen,
  Target,
  Quote,
  Star,
} from "lucide-react";
import { useAuth } from "../hooks/useAuthContext.jsx";
import subscriptionApi from "../services/subscriptionApi";
import SEOHead from "../components/SEOHead.jsx";
import "../styles/global.css";
import styles from "../styles/cover.module.css";

function CoverPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [canAccessPaidFeatures, setCanAccessPaidFeatures] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for intersection observer
  const featuresRef = useRef(null);
  const processRef = useRef(null);
  const integrationRef = useRef(null);
  const benefitsRef = useRef(null);
  const supportTeamRef = useRef(null);
  const testimonialsRef = useRef(null);
  const finalCtaRef = useRef(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        if (isAuthenticated) {
          try {
            const subscriptionStatus =
              await subscriptionApi.getSubscriptionStatus();
            setCanAccessPaidFeatures(
              subscriptionStatus && subscriptionStatus.canAccessPaidFeatures
            );
          } catch (error) {
            console.error("Error checking subscription status:", error);
            setCanAccessPaidFeatures(false);
          }
        } else {
          setCanAccessPaidFeatures(false);
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setCanAccessPaidFeatures(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      checkUserStatus();
    }
  }, [isAuthenticated, authLoading]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      });
    }, observerOptions);

    const refs = [
      featuresRef,
      processRef,
      integrationRef,
      benefitsRef,
      supportTeamRef,
      testimonialsRef,
      finalCtaRef,
    ];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Progressive image loading
  useEffect(() => {
    const handleImageLoad = (img) => {
      img.classList.add("loaded");
    };

    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach((img) => {
      if (img.complete) {
        // Image already loaded
        handleImageLoad(img);
      } else {
        // Image still loading
        img.addEventListener("load", () => handleImageLoad(img));
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", () => handleImageLoad(img));
      });
    };
  }, []);

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!canAccessPaidFeatures) {
      navigate("/subscription");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className={styles.container}>
      <SEOHead
        title="ADHD Focus Training That Works | DaVinci Focus - 10-Minute Daily Practice"
        description="Help children with ADHD succeed in school. Simple 10-minute daily math practice builds focus skills. 87% improved focus in 2 weeks, 25% better test scores. Parent-supervised, evidence-based, free to start."
        keywords="ADHD focus training, attention deficit help, school success, math practice, focus skills, attention challenges, parent supervised learning, ADHD children, concentration training, academic improvement"
        image="/1.png"
      />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Help your child with attention struggles succeed in school
          </h1>
          <p className={styles.heroSubtitle}>
            DaVinci Focus helps kids with attention challenges, including those
            with ADHD-like difficulties, build focus through engaging math
            practice. Spend 10-15 minutes daily supervising your child - we
            handle the teaching. Kids love it, you see clear progress, grades
            improve in weeks.
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
          </div>
          <button
            onClick={handleGetStarted}
            className={styles.ctaButton}
            disabled={isLoading}
          >
            Start free - see results in days
          </button>
        </div>
        <div className={styles.heroImage}>
          <img src="/1.png" alt="Child focused on learning" loading="lazy" />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} ref={featuresRef}>
        <div className={styles.featureItem}>
          <div className={styles.featureImage}>
            <img src="/2.png" alt="Child engaged in learning" loading="lazy" />
          </div>
          <div className={styles.featureContent}>
            <h2>Why parents choose our attention-focused training</h2>
            <p>
              Children with attention struggles often face focus challenges,
              leading to poor grades and daily battles. Our system trains
              attention through engaging math practice - children love the
              structured wins while building the focus skills they need for
              school success.
            </p>

            <h3>How it works: Simple 10-15 minute daily routine</h3>
            <p>
              Sit with your child, open our system, supervise while they engage
              with attention-friendly focus training activities. The system
              guides them through math problems designed to build sustained
              attention - we handle all the teaching and preparation.
            </p>

            <h3>What you get: Real results parents can see</h3>
            <p>
              After consistent daily sessions, parents report higher test
              scores, better classroom focus, and stronger math skills. Clear
              progress tracking shows exactly how your child's attention and
              academic performance improve week by week.
            </p>

            <div className={styles.demoLink}>
              <button
                onClick={() => navigate("/demo")}
                className={styles.demoButton}
              >
                See how it works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.process} ref={processRef}>
        <div className={styles.processContent}>
          <h2>Just 10-15 minutes daily - that's it</h2>
          <p>
            Sit with your child, open the system, supervise while they engage.
            We handle the preparation and teaching - you just supervise. After a
            few weeks of this simple routine, you'll see their grades rise.
          </p>
          <div className={styles.processStats}>
            <div className={styles.processStat}>
              <span className={styles.processStatNumber}>10-15 minutes</span>
              <span className={styles.processStatText}>
                daily with your child - simple supervision
              </span>
            </div>
          </div>
          <button
            onClick={handleGetStarted}
            className={styles.ctaButton}
            disabled={isLoading}
          >
            Start free - see results in days
          </button>
        </div>
        <div className={styles.processImage}>
          <img
            src="/3.png"
            alt="Child showing academic progress"
            loading="lazy"
          />
        </div>
      </section>

      {/* Integration Section */}
      <section className={styles.integration} ref={integrationRef}>
        <div className={styles.integrationGrid}>
          <div className={styles.integrationCard}>
            <div className={styles.cardHeader}>
              <Target className={styles.cardIcon} />
              <span className={styles.cardLabel}>SIMPLE TO USE</span>
            </div>
            <h3>Intuitive for parents - start immediately</h3>
            <p>
              Open the system, sit with your child, supervise while they engage.
              The interface guides both of you naturally. We eliminate tutorials
              and prep work - you get simple daily supervision that works.
            </p>
          </div>

          <div className={styles.integrationCard}>
            <div className={styles.cardHeader}>
              <BookOpen className={styles.cardIcon} />
              <span className={styles.cardLabel}>ATTENTION-FOCUSED</span>
            </div>
            <h3>Built for attention challenges</h3>
            <p>
              Evidence-based design tailored for attention difficulties,
              including ADHD. Adaptive pacing, focus-building mechanics, and
              attention-friendly structure that actually works for your child.
            </p>
            <div className={styles.progressDemo}>
              <div className={styles.progressItem}>
                <CheckCircle size={16} />
                <span>Attention-friendly pacing</span>
              </div>
              <div className={styles.progressItem}>
                <CheckCircle size={16} />
                <span>Focus-building mechanics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits} ref={benefitsRef}>
        <h2>The 6 reasons parents choose DaVinci Focus</h2>
        <p>
          Based on our survey of 500+ families, here's what matters most when
          choosing ADHD focus training:
        </p>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <Users className={styles.benefitIcon} />
            <h3>1. Kids want to use it (no resistance)</h3>
            <p>
              Structured, achievable tasks with instant wins create intrinsic
              motivation. After 10-15 minutes, your child feels accomplished -
              they actually look forward to this time with you.
            </p>
          </div>

          <div className={styles.benefitItem}>
            <TrendingUp className={styles.benefitIcon} />
            <h3>2. Effective results (better grades)</h3>
            <p>
              Higher test scores, improved classroom focus, stronger math
              skills. Measurable academic improvements that teachers notice
              within weeks.
            </p>
          </div>

          <div className={styles.benefitItem}>
            <Target className={styles.benefitIcon} />
            <h3>3. You feel empowered (not helpless)</h3>
            <p>
              Clear progress tracking, simple tools, expert guidance. Finally
              understand what works for your ADHD child and feel confident in
              their success.
            </p>
          </div>

          <div className={styles.benefitItem}>
            <BookOpen className={styles.benefitIcon} />
            <h3>4. Works quickly (progress in days)</h3>
            <p>
              Visible improvements in focus within the first week. Quick wins
              build lasting confidence while you watch academic performance
              improve.
            </p>
          </div>

          <div className={styles.benefitItem}>
            <Users className={styles.benefitIcon} />
            <h3>5. Easy for parents (start immediately)</h3>
            <p>
              Intuitive interface, automated tracking, simple supervision. We
              eliminate tutorials and prep work - you just open and start.
            </p>
          </div>

          <div className={styles.benefitItem}>
            <BookOpen className={styles.benefitIcon} />
            <h3>6. Fits family schedule (brief sessions)</h3>
            <p>
              Just 10-15 minutes daily. Works around meltdowns and chaos without
              demanding perfect conditions. You can step away when needed.
            </p>
          </div>
        </div>
      </section>

      {/* Support Team Section */}
      <section className={styles.supportTeam} ref={supportTeamRef}>
        <div className={styles.supportTeamContainer}>
          <div className={styles.supportTeamContent}>
            <h2>Expert guidance for attention challenges</h2>
            <p>
              Our specialists understand attention difficulties and ADHD
              challenges. Get clear answers, proven strategies, and confidence
              that you're using the right approach for your child's success.
            </p>
          </div>
          <div className={styles.supportTeamVisual}>
            <div className={styles.staffGrid}>
              <div className={styles.staffMember}>
                <div className={styles.staffImageContainer}>
                  <img
                    src="/5.png"
                    alt="David Martinez, Learning Specialist"
                    loading="lazy"
                  />
                </div>
                <div className={styles.staffInfo}>
                  <div className={styles.staffName}>
                    David Martinez, Learning Specialist
                  </div>
                  <div className={styles.staffRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={styles.starFilled} size={12} />
                    ))}
                    <span className={styles.ratingCount}>(47)</span>
                  </div>
                  <div className={styles.staffEmail}>
                    dmartinez@davincifocus.com
                  </div>
                </div>
              </div>

              <div className={styles.staffMember}>
                <div className={styles.staffImageContainer}>
                  <img
                    src="/6.png"
                    alt="Jessica Thompson, Attention Coach"
                    loading="lazy"
                  />
                </div>
                <div className={styles.staffInfo}>
                  <div className={styles.staffName}>
                    Jessica Thompson, Attention Coach
                  </div>
                  <div className={styles.staffRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={styles.starFilled} size={12} />
                    ))}
                    <span className={styles.ratingCount}>(92)</span>
                  </div>
                  <div className={styles.staffEmail}>
                    jess.t@davincifocus.com
                  </div>
                </div>
              </div>

              <div className={styles.staffMember}>
                <div className={styles.staffImageContainer}>
                  <img
                    src="/7.png"
                    alt="Dr. Marcus Johnson, Child Psychologist"
                    loading="lazy"
                  />
                </div>
                <div className={styles.staffInfo}>
                  <div className={styles.staffName}>
                    Dr. Marcus Johnson, Child Psychologist
                  </div>
                  <div className={styles.staffRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={styles.starFilled} size={12} />
                    ))}
                    <span className={styles.ratingCount}>(28)</span>
                  </div>
                  <div className={styles.staffEmail}>
                    johnson@davincifocus.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials} ref={testimonialsRef}>
        <div className={styles.testimonialsContainer}>
          <h2>Parents see the difference</h2>
          <p>
            Real results from families dealing with attention challenges and
            school struggles. See how children go from frustrated to focused.
          </p>

          <div className={styles.testimonialsGrid}>
            <div className={`${styles.testimonialCard} ${styles.cardBlue}`}>
              <div className={styles.testimonialHeader}>
                <Quote className={styles.quoteIcon} />
                <div className={styles.starRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={styles.starFilled} size={14} />
                  ))}
                </div>
              </div>
              <div className={styles.testimonialContent}>
                <p>
                  No more battles. My daughter sits down and focuses without
                  constant reminders.
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  <span>AC</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Amanda C.</span>
                  <span className={styles.authorRole}>
                    Parent • Burlingame, California
                  </span>
                </div>
              </div>
            </div>

            <div className={`${styles.testimonialCard} ${styles.cardGreen}`}>
              <div className={styles.testimonialHeader}>
                <Quote className={styles.quoteIcon} />
                <div className={styles.starRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={styles.starFilled} size={14} />
                  ))}
                </div>
              </div>
              <div className={styles.testimonialContent}>
                <p>
                  My son's confidence has grown so much. He's not frustrated
                  anymore and actually enjoys learning.
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  <span>TB</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Tyler Brooks</span>
                  <span className={styles.authorRole}>
                    Parent • Boise, Idaho
                  </span>
                </div>
              </div>
            </div>

            <div className={`${styles.testimonialCard} ${styles.cardPurple}`}>
              <div className={styles.testimonialHeader}>
                <Quote className={styles.quoteIcon} />
                <div className={styles.starRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={styles.starFilled} size={14} />
                  ))}
                </div>
              </div>
              <div className={styles.testimonialContent}>
                <p>
                  The progress tracking is amazing. I can see her attention
                  improving week by week.
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  <span>SM</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Sofia Martinez</span>
                  <span className={styles.authorRole}>
                    Parent • Asheville, North Carolina
                  </span>
                </div>
              </div>
            </div>

            <div className={`${styles.testimonialCard} ${styles.cardOrange}`}>
              <div className={styles.testimonialHeader}>
                <Quote className={styles.quoteIcon} />
                <div className={styles.starRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={styles.starFilled} size={14} />
                  ))}
                </div>
              </div>
              <div className={styles.testimonialContent}>
                <p>
                  I've seen remarkable improvement in classroom focus. Students
                  using DaVinci show better sustained attention during lessons.
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  <span>MJ</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Marcus J.</span>
                  <span className={styles.authorRole}>
                    Teacher • Burlington, Vermont
                  </span>
                </div>
              </div>
            </div>

            <div className={`${styles.testimonialCard} ${styles.cardTeal}`}>
              <div className={styles.testimonialHeader}>
                <Quote className={styles.quoteIcon} />
                <div className={styles.starRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={styles.starFilled} size={14} />
                  ))}
                </div>
              </div>
              <div className={styles.testimonialContent}>
                <p>
                  Perfect for my granddaughter's attention span. The gentle
                  approach reduced her learning anxiety significantly.
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  <span>JM</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Jake Morrison</span>
                  <span className={styles.authorRole}>
                    Guardian • Singapore
                  </span>
                </div>
              </div>
            </div>

            <div className={`${styles.testimonialCard} ${styles.cardRose}`}>
              <div className={styles.testimonialHeader}>
                <Quote className={styles.quoteIcon} />
                <div className={styles.starRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={styles.starFilled} size={14} />
                  ))}
                </div>
              </div>
              <div className={styles.testimonialContent}>
                <p>
                  Less family stress, more celebrating small wins. These skills
                  will help him for life.
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  <span>DP</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Daniel Park</span>
                  <span className={styles.authorRole}>
                    Parent • Seoul, Korea
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta} ref={finalCtaRef}>
        <div className={styles.finalCtaContent}>
          <div className={styles.finalCtaImage}>
            <img src="/4.png" alt="Child succeeding in school" loading="lazy" />
          </div>
          <div className={styles.finalCtaText}>
            <h2>Stop the struggle. Start the success.</h2>
            <p>
              Spend 10-15 minutes daily supervising your child with our system.
              Watch them engage happily, then see their grades improve in weeks.
              Join parents who found what actually works.
            </p>
            <div className={styles.finalCtaStats}>
              <div className={styles.finalCtaStat}>
                <span className={styles.finalCtaStatText}>
                  500+ families already seeing results
                </span>
              </div>
            </div>
            <button
              onClick={handleGetStarted}
              className={styles.ctaButton}
              disabled={isLoading}
            >
              Start free - see results in days
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CoverPage;
