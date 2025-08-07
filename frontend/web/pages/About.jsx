import React from "react";
import HomepageHeader from "../components/homepage/HomepageHeader";
import HomepageFooter from "../components/homepage/HomepageFooter";
import styles from "../styles/legal.module.css";

const About = () => {
  return (
    <div className={styles.legalPage}>
      <HomepageHeader />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>About Us</h1>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              EngageDesk empowers businesses to build stronger client
              relationships through intelligent client management. We provide
              the tools and insights needed to track interactions, manage
              communications, and deliver exceptional client experiences.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What We Do</h2>
            <p>
              EngageDesk is a comprehensive client relationship management
              platform designed for modern businesses. Our solution helps teams:
            </p>
            <ul>
              <li>
                Track and organize client interactions across all touchpoints
              </li>
              <li>Manage client communications efficiently</li>
              <li>Store and access client information securely</li>
              <li>Collaborate effectively on client accounts</li>
              <li>Gain insights into client engagement patterns</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Our Approach</h2>
            <p>
              We believe that successful client relationships are built on
              consistent, meaningful interactions. Our platform is designed with
              simplicity and effectiveness in mind, ensuring that teams can
              focus on what matters most: serving their clients.
            </p>
            <p>
              Every feature we build is guided by real-world feedback from
              businesses who understand the importance of client engagement. We
              prioritize security, reliability, and ease of use in everything we
              do.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Our Values</h2>
            <ul>
              <li>
                <strong>Client-Centric:</strong> We put client success at the
                center of everything we do
              </li>
              <li>
                <strong>Simplicity:</strong> We believe powerful tools should be
                easy to use
              </li>
              <li>
                <strong>Security:</strong> We protect your data with
                enterprise-grade security measures
              </li>
              <li>
                <strong>Reliability:</strong> We build systems you can depend on
              </li>
              <li>
                <strong>Innovation:</strong> We continuously improve to meet
                evolving business needs
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Why Choose EngageDesk</h2>
            <p>
              In today's competitive business environment, maintaining strong
              client relationships is essential for growth. EngageDesk provides
              the foundation for building these relationships by ensuring no
              client interaction goes untracked and no opportunity is missed.
            </p>
            <p>
              Our platform scales with your business, from small teams to large
              enterprises, providing the flexibility and features needed to
              manage client relationships effectively at any stage of growth.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Get Started</h2>
            <p>
              Ready to transform how you manage client relationships? EngageDesk
              is designed to get you up and running quickly, with intuitive
              features that require minimal training.
            </p>
            <p>
              Join businesses worldwide who trust EngageDesk to help them build
              stronger, more profitable client relationships.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Us</h2>
            <p>
              Have questions about EngageDesk or want to learn more about how we
              can help your business? We'd love to hear from you.
            </p>
            <p>
              Email us at{" "}
              <a href="mailto:hello@engagedesk.io">hello@engagedesk.io</a> or
              visit our website at{" "}
              <a href="https://engagedesk.io">engagedesk.io</a>.
            </p>
          </section>
        </div>
      </div>
      <HomepageFooter />
    </div>
  );
};

export default About;
