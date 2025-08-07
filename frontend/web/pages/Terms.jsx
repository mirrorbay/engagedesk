import React from "react";
import HomepageHeader from "../components/homepage/HomepageHeader";
import HomepageFooter from "../components/homepage/HomepageFooter";
import styles from "../styles/legal.module.css";

const Terms = () => {
  return (
    <div className={styles.legalPage}>
      <HomepageHeader />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Terms of Use</h1>
          <p className={styles.lastUpdated}>Last updated: January 8, 2025</p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using EngageDesk.io ("Service"), you accept and
              agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Description of Service</h2>
            <p>
              EngageDesk is a client relationship management platform that helps
              businesses track client interactions, manage communications, and
              organize client data.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You must notify us immediately of any unauthorized use of
              your account.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Use the Service for any unlawful purpose or in violation of any
                applicable laws
              </li>
              <li>
                Upload, transmit, or distribute any malicious code or harmful
                content
              </li>
              <li>
                Attempt to gain unauthorized access to our systems or other
                users' accounts
              </li>
              <li>
                Interfere with or disrupt the Service or servers connected to
                the Service
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Data and Privacy</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy. By
              using the Service, you consent to the collection and use of
              information as outlined in our Privacy Policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality
              are owned by EngageDesk and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice, for conduct that we believe
              violates these Terms of Use or is harmful to other users, us, or
              third parties.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" without any representations or
              warranties, express or implied. We make no representations or
              warranties in relation to the Service or the information and
              activities on the Service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Limitation of Liability</h2>
            <p>
              In no event shall EngageDesk be liable for any indirect,
              incidental, special, consequential, or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes by posting the new Terms of
              Use on this page with a new effective date.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Use, please contact
              us at legal@engagedesk.io.
            </p>
          </section>
        </div>
      </div>
      <HomepageFooter />
    </div>
  );
};

export default Terms;
