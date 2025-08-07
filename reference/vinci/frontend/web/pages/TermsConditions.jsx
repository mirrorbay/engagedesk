import React from "react";
import "../styles/global.css";
import styles from "../styles/legal.module.css";

function TermsConditions() {
  return (
    <div className={styles.legalContainer}>
      {/* Header */}
      <div className={styles.legalHeader}>
        <div className={styles.legalInfo}>
          <h1 className={styles.legalTitle}>Terms & Conditions</h1>
          <div className={styles.legalSubtitle}>Carepivot Inc</div>
        </div>

        <div className={styles.lastUpdated}>
          <div className={styles.lastUpdatedLabel}>Last Updated</div>
          <div className={styles.lastUpdatedDate}>Dec 25, 2024</div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className={styles.tableOfContents}>
        <h2 className={styles.tocTitle}>Table of Contents</h2>
        <ul className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#acceptance" className={styles.tocLink}>
              1. Acceptance of Terms
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#description" className={styles.tocLink}>
              2. Description of Service
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#user-accounts" className={styles.tocLink}>
              3. User Accounts and Registration
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#acceptable-use" className={styles.tocLink}>
              4. Acceptable Use Policy
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#intellectual-property" className={styles.tocLink}>
              5. Intellectual Property Rights
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#privacy" className={styles.tocLink}>
              6. Privacy and Data Protection
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#limitation-liability" className={styles.tocLink}>
              7. Limitation of Liability
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#termination" className={styles.tocLink}>
              8. Termination
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#changes" className={styles.tocLink}>
              9. Changes to Terms
            </a>
          </li>
        </ul>
      </div>

      {/* Content Sections */}
      <div className={styles.legalContent}>
        {/* Section 1: Acceptance of Terms */}
        <div id="acceptance" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <div className={styles.sectionContent}>
            <p>
              By accessing and using our service, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
            <p>
              These Terms of Service constitute a legally binding agreement
              between you and our company regarding your use of the Service.
              Your use of the Service is also governed by our Privacy Policy,
              which is incorporated herein by reference.
            </p>
            <p>
              <strong>Important:</strong> By using our Service, you represent
              that you are at least 13 years of age, or if you are under 13,
              that you are using the Service under the supervision of a parent
              or guardian who has agreed to these Terms.
            </p>
          </div>
        </div>

        {/* Section 2: Description of Service */}
        <div id="description" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>2. Description of Service</h2>
          <div className={styles.sectionContent}>
            <p>
              We are an online learning platform that provides educational
              content, interactive exercises, and assessment tools designed to
              enhance mathematical learning and problem-solving skills.
            </p>
            <p>Our Service includes, but is not limited to:</p>
            <ul>
              <li>Interactive mathematical problem-solving exercises</li>
              <li>
                Adaptive learning algorithms that adjust difficulty based on
                performance
              </li>
              <li>Progress tracking and performance analytics</li>
              <li>Educational content and instructional materials</li>
              <li>Session management and time tracking features</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect
              of the Service at any time, with or without notice. We may also
              impose limits on certain features or restrict access to parts or
              all of the Service without notice or liability.
            </p>
          </div>
        </div>

        {/* Section 3: User Accounts and Registration */}
        <div id="user-accounts" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            3. User Accounts and Registration
          </h2>
          <div className={styles.sectionContent}>
            <p>
              To access certain features of our Service, you may be required to
              create an account. When creating an account, you agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>
                Maintain the security and confidentiality of your login
                credentials
              </li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
            </ul>
            <p>
              You are responsible for safeguarding the password and all
              activities that happen under your account. We cannot and will not
              be liable for any loss or damage from your failure to comply with
              this security obligation.
            </p>
            <p>
              <strong>For Users Under 18:</strong> If you are under 18 years of
              age, you represent that your parent or legal guardian has reviewed
              and agreed to these Terms on your behalf.
            </p>
          </div>
        </div>

        {/* Section 4: Acceptable Use Policy */}
        <div id="acceptable-use" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>4. Acceptable Use Policy</h2>
          <div className={styles.sectionContent}>
            <p>
              You agree to use the Service only for lawful purposes and in
              accordance with these Terms. You agree not to use the Service:
            </p>
            <ul>
              <li>
                In any way that violates any applicable federal, state, local,
                or international law or regulation
              </li>
              <li>
                To transmit, or procure the sending of, any advertising or
                promotional material, including "junk mail," "chain letters,"
                "spam," or similar solicitations
              </li>
              <li>
                To impersonate or attempt to impersonate the Company, a Company
                employee, another user, or any other person or entity
              </li>
              <li>
                To engage in any other conduct that restricts or inhibits
                anyone's use or enjoyment of the Service
              </li>
              <li>
                To attempt to gain unauthorized access to, interfere with,
                damage, or disrupt any parts of the Service
              </li>
              <li>
                To use any automated system, including "robots," "spiders," or
                "offline readers," to access the Service
              </li>
            </ul>
            <p>
              We reserve the right to terminate or suspend your account and
              access to the Service immediately, without prior notice or
              liability, for any reason whatsoever, including without limitation
              if you breach the Terms.
            </p>
          </div>
        </div>

        {/* Section 5: Intellectual Property Rights */}
        <div id="intellectual-property" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            5. Intellectual Property Rights
          </h2>
          <div className={styles.sectionContent}>
            <p>
              The Service and its original content, features, and functionality
              are and will remain our exclusive property and its licensors. The
              Service is protected by copyright, trademark, and other laws.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with
              any product or service without our prior written consent. Nothing
              in these Terms constitutes a transfer of any intellectual property
              rights from us to you.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable license
              to access and use the Service for your personal, educational use
              only. This license does not include any right to:
            </p>
            <ul>
              <li>
                Resell or make commercial use of the Service or its contents
              </li>
              <li>
                Collect and use any product listings, descriptions, or prices
              </li>
              <li>Make derivative use of the Service or its contents</li>
              <li>
                Download or copy account information for the benefit of another
                merchant
              </li>
            </ul>
          </div>
        </div>

        {/* Section 6: Privacy and Data Protection */}
        <div id="privacy" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            6. Privacy and Data Protection
          </h2>
          <div className={styles.sectionContent}>
            <p>
              Your privacy is important to us. Our Privacy Policy explains how
              we collect, use, and protect your information when you use our
              Service. By using our Service, you agree to the collection and use
              of information in accordance with our Privacy Policy.
            </p>
            <p>
              We are committed to protecting the privacy of students and comply
              with applicable privacy laws, including the Family Educational
              Rights and Privacy Act (FERPA) and the Children's Online Privacy
              Protection Act (COPPA) where applicable.
            </p>
            <p>
              <strong>Educational Records:</strong> Any educational records
              created through your use of the Service remain under the control
              of the educational institution or parent/guardian, as applicable
              under law.
            </p>
          </div>
        </div>

        {/* Section 7: Limitation of Liability */}
        <div id="limitation-liability" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
          <div className={styles.sectionContent}>
            <p>
              The information on this Service is provided on an "as is" basis.
              To the fullest extent permitted by law, this Company excludes all
              representations, warranties, conditions and terms whether express
              or implied.
            </p>
            <p>
              In no event shall our company, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your use of
              the Service.
            </p>
            <p>
              <strong>Educational Disclaimer:</strong> While we strive to
              provide accurate and helpful educational content, we make no
              guarantees about the effectiveness of our educational methods or
              your academic performance. Educational outcomes depend on many
              factors beyond our control.
            </p>
          </div>
        </div>

        {/* Section 8: Termination */}
        <div id="termination" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>8. Termination</h2>
          <div className={styles.sectionContent}>
            <p>
              We may terminate or suspend your account and bar access to the
              Service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>
            <p>
              If you wish to terminate your account, you may simply discontinue
              using the Service or contact us to request account deletion.
            </p>
            <p>
              Upon termination, your right to use the Service will cease
              immediately. If you wish to terminate your account, you may simply
              discontinue using the Service.
            </p>
            <p>
              <strong>Data Retention:</strong> Upon termination, we may retain
              certain information as required by law or for legitimate business
              purposes, as outlined in our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Section 9: Changes to Terms */}
        <div id="changes" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>9. Changes to Terms</h2>
          <div className={styles.sectionContent}>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least 30 days notice prior to any new terms taking
              effect.
            </p>
            <p>
              What constitutes a material change will be determined at our sole
              discretion. By continuing to access or use our Service after any
              revisions become effective, you agree to be bound by the revised
              terms.
            </p>
            <p>
              We encourage you to review these Terms periodically to stay
              informed of any changes. Your continued use of the Service
              following the posting of any changes constitutes acceptance of
              those changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;
