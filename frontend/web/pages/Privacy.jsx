import React from "react";
import HomepageHeader from "../components/homepage/HomepageHeader";
import HomepageFooter from "../components/homepage/HomepageFooter";
import styles from "../styles/legal.module.css";

const Privacy = () => {
  return (
    <div className={styles.legalPage}>
      <HomepageHeader />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: January 8, 2025</p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>
              We collect information you provide directly to us, such as when
              you create an account, use our services, or contact us for
              support.
            </p>
            <ul>
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Client data you input into the system</li>
              <li>Communication records and preferences</li>
            </ul>

            <h3>Usage Information</h3>
            <p>
              We automatically collect certain information about your use of our
              services, including:
            </p>
            <ul>
              <li>Log data and usage patterns</li>
              <li>Device information and IP addresses</li>
              <li>Browser type and operating system</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Detect and prevent fraudulent activities</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties except as described in this policy:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to
              provide our services and fulfill the purposes outlined in this
              policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
              <li>Withdraw consent where applicable</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your
              experience, analyze usage, and provide personalized content. You
              can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Third-Party Services</h2>
            <p>
              Our service may contain links to third-party websites or integrate
              with third-party services. We are not responsible for the privacy
              practices of these external services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page with an updated effective date.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at privacy@engagedesk.io.
            </p>
          </section>
        </div>
      </div>
      <HomepageFooter />
    </div>
  );
};

export default Privacy;
