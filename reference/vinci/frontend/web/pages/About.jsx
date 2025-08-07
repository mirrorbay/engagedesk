import React from "react";
import "../styles/global.css";
import styles from "../styles/about.module.css";

function About() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Help your child achieve the school success they deserve
          </h1>
          <p className={styles.heroSubtitle}>
            DaVinci Focus builds your child's focus and confidence through
            personalized math practice. Our system helps children with attention
            challenges, including those with ADHD-like difficulties, develop
            stronger attention skills, master essential concepts, and feel proud
            of their achievements while building lifelong learning success.
          </p>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroGraphic}>
            <div className={styles.heroText}>Focus + Learning</div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className={styles.innovation}>
        <div className={styles.innovationContent}>
          <div className={styles.innovationHeader}>
            <h2>How your child benefits</h2>
            <p>
              While other solutions force you to choose between focus training
              or academics, DaVinci Focus delivers both simultaneously through
              personalized learning that adapts to your child's unique learning
              patterns and builds lasting confidence. Kids love it, you see
              clear progress, grades improve in weeks.
            </p>
          </div>

          <div className={styles.personalizationSection}>
            <h3>Three-layer personalization system</h3>
            <p className={styles.personalizationDescription}>
              Your child receives continuous attention monitoring, adaptive
              difficulty adjustments, and motivational support, all working
              together to build sustained focus while mastering essential math
              skills and developing academic confidence. 87% show improved focus
              within 2 weeks.
            </p>

            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureNumber}>01</div>
                <h4>Attention Monitoring</h4>
                <p>Tracks focus patterns in real-time</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureNumber}>02</div>
                <h4>Smart Adaptation</h4>
                <p>Adjusts difficulty & pacing automatically</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureNumber}>03</div>
                <h4>Progress Motivation</h4>
                <p>Celebrates achievements & builds confidence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Math Section */}
      <section className={styles.mathFocus}>
        <div className={styles.mathContent}>
          <h2>Why math? Because attention and academics are inseparable</h2>
          <p>
            Mathematics requires sustained attention, working memory, and
            cognitive control, which are the exact skills that attention
            training develops. Children with attention struggles often struggle
            with math, making this the perfect foundation for building both
            focus skills and academic confidence simultaneously. Our system
            works in just 10-15 minutes daily.
          </p>
        </div>
        <div className={styles.mathVisual}>
          <div className={styles.mathStatistic}>
            <div className={styles.statisticNumber}>87%</div>
            <div className={styles.statisticLabel}>
              Show improved focus
              <br />
              within 2 weeks
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className={styles.valueProposition}>
        <div className={styles.valueGrid}>
          <div className={styles.valueCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>FOR FAMILIES</span>
            </div>
            <h3>Build stronger kids and family positivity</h3>
            <p>
              Traditional approaches force families to choose between focus
              training and academic progress. We deliver both simultaneously,
              creating positive family moments and academic success. Start free
              - see results in days.
            </p>
            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <span>Save thousands in specialized tutoring costs</span>
              </div>
              <div className={styles.benefitItem}>
                <span>Build attention skills & math confidence</span>
              </div>
              <div className={styles.benefitItem}>
                <span>Create positive learning experiences</span>
              </div>
            </div>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>PROVEN APPROACH</span>
            </div>
            <h3>Evidence-based learning system</h3>
            <p>
              DaVinci Focus combines proven attention training methods with
              adaptive technology, helping children achieve measurable progress
              in both focus skills and academic performance. Our approach is
              designed for attention challenges, including ADHD, and works
              quickly and effectively.
            </p>
            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <span>Real-time attention tracking</span>
              </div>
              <div className={styles.benefitItem}>
                <span>Personalized learning paths</span>
              </div>
              <div className={styles.benefitItem}>
                <span>Measurable progress reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Team */}
      <section className={styles.mission}>
        <h2>What this means for your family</h2>
        <p>
          DaVinci Focus was created by parents who understand the daily
          challenges of supporting children with learning difficulties. Every
          feature is designed with your family's success and happiness in mind.
        </p>

        <div className={styles.missionGrid}>
          <div className={styles.missionItem}>
            <h3>Transform homework time into success time</h3>
            <p>
              Your child develops sustained focus naturally through engaging
              math practice, creating positive family moments and reducing daily
              stress for everyone.
            </p>
          </div>

          <div className={styles.missionItem}>
            <h3>Professional-grade learning support</h3>
            <p>
              Evidence-based attention training techniques adapted for home use,
              giving you expert-level support that builds both focus and
              academic skills.
            </p>
          </div>

          <div className={styles.missionItem}>
            <h3>Built for real families</h3>
            <p>
              Designed by parents who know that practical solutions matter more
              than perfect theories. This actually works in daily life and fits
              your family's routine.
            </p>
          </div>

          <div className={styles.missionItem}>
            <h3>Achieve lifelong learning success</h3>
            <p>
              Skills your child develops with DaVinci Focus transfer to all
              areas of learning, setting them up for lifelong academic
              confidence and school success.
            </p>
          </div>
        </div>
      </section>

      {/* About CarePivot */}
      <section className={styles.company}>
        <div className={styles.companyContent}>
          <h2>About CarePivot</h2>
          <p className={styles.companyIntro}>
            Based in Oregon, CarePivot is a team of passionate educators with
            diverse backgrounds united by a shared mission: helping children
            with learning challenges reach their full potential and achieve
            school success. As parents and professionals, we understand the
            daily struggles families face and are committed to creating
            solutions that truly work.
          </p>

          <div className={styles.teamPhoto}>
            <img
              src="/team.jpeg"
              alt="CarePivot team - passionate educators helping children succeed"
              className={styles.teamImage}
            />
          </div>

          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <h3>Elementary Education Specialist</h3>
              <p>
                Our experienced elementary school teacher brings years of
                classroom expertise and deep understanding of how children learn
                best, ensuring our approach works in real educational settings
                and builds lasting confidence.
              </p>
            </div>

            <div className={styles.teamMember}>
              <h3>Licensed Learning Specialist</h3>
              <p>
                Our licensed counselor specializes in attention and learning
                challenges, providing evidence-based approaches and clinical
                expertise that helps children develop focus skills and academic
                confidence.
              </p>
            </div>

            <div className={styles.teamMember}>
              <h3>Technology Developer</h3>
              <p>
                Our tech developer creates the adaptive systems that make
                personalized learning possible, bringing professional-grade
                attention training directly into your home with ease and
                reliability.
              </p>
            </div>
          </div>

          <p className={styles.companyMission}>
            Together, we combine classroom experience, clinical expertise, and
            innovative technology to create solutions that work for real
            families. We're supporting parents and empowering children to
            achieve the school success they deserve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
