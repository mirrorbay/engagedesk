import React from "react";
import "../styles/global.css";
import styles from "../styles/legal.module.css";

function PrivacyPolicy() {
  return (
    <div className={styles.legalContainer}>
      {/* Header */}
      <div className={styles.legalHeader}>
        <div className={styles.legalInfo}>
          <h1 className={styles.legalTitle}>Privacy Policy</h1>
          <div className={styles.legalSubtitle}>Carepivot Inc</div>
        </div>

        <div className={styles.lastUpdated}>
          <div className={styles.lastUpdatedLabel}>Last Updated</div>
          <div className={styles.lastUpdatedDate}>June 25, 2025</div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className={styles.tableOfContents}>
        <h2 className={styles.tocTitle}>Table of Contents</h2>
        <ul className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#overview" className={styles.tocLink}>
              1. Privacy Policy Overview
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#information-collection" className={styles.tocLink}>
              2. Information We Collect
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#information-use" className={styles.tocLink}>
              3. How We Use Your Information
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#information-sharing" className={styles.tocLink}>
              4. Information Sharing and Disclosure
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#data-security" className={styles.tocLink}>
              5. Data Security and Protection
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#student-privacy" className={styles.tocLink}>
              6. Student Privacy and COPPA Compliance
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#cookies" className={styles.tocLink}>
              7. Cookies and Tracking Technologies
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#user-rights" className={styles.tocLink}>
              8. Your Rights and Choices
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#data-retention" className={styles.tocLink}>
              9. Data Retention
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#international-transfers" className={styles.tocLink}>
              10. International Data Transfers
            </a>
          </li>
          <li className={styles.tocItem}>
            <a href="#policy-changes" className={styles.tocLink}>
              11. Changes to This Privacy Policy
            </a>
          </li>
        </ul>
      </div>

      {/* Content Sections */}
      <div className={styles.legalContent}>
        {/* Section 1: Privacy Policy Overview */}
        <div id="overview" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>1. Privacy Policy Overview</h2>
          <div className={styles.sectionContent}>
            <p>
              We are committed to protecting your privacy and ensuring the
              security of your personal information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our educational platform and services.
            </p>
            <p>
              We take student privacy seriously and comply with applicable
              privacy laws, including the Family Educational Rights and Privacy
              Act (FERPA), the Children's Online Privacy Protection Act (COPPA),
              and other relevant data protection regulations.
            </p>
            <p>
              <strong>Key Principles:</strong>
            </p>
            <ul>
              <li>
                We collect only the information necessary to provide our
                educational services
              </li>
              <li>
                We never sell student data or personal information to third
                parties
              </li>
              <li>
                We use industry-standard security measures to protect your data
              </li>
              <li>We provide transparency about our data practices</li>
              <li>
                We respect your rights to access, correct, and delete your
                information
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Information We Collect */}
        <div id="information-collection" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
          <div className={styles.sectionContent}>
            <p>
              We collect information in several ways when you use our Service:
            </p>

            <p>
              <strong>Information You Provide Directly:</strong>
            </p>
            <ul>
              <li>
                Account registration information (name, email address, grade
                level)
              </li>
              <li>Profile information and preferences</li>
              <li>Responses to educational exercises and assessments</li>
              <li>Communications with our support team</li>
              <li>Feedback and survey responses</li>
            </ul>

            <p>
              <strong>Information We Collect Automatically:</strong>
            </p>
            <ul>
              <li>Learning progress and performance data</li>
              <li>Time spent on activities and session duration</li>
              <li>Device information (browser type, operating system)</li>
              <li>Usage patterns and interaction data</li>
              <li>IP address and general location information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <p>
              <strong>Information from Educational Institutions:</strong>
            </p>
            <ul>
              <li>Student roster information (when provided by schools)</li>
              <li>Class assignment and grade level information</li>
              <li>Educational records as permitted by FERPA</li>
            </ul>

            <p>
              <strong>Note for Students Under 13:</strong> We collect minimal
              information from children under 13 and only with verifiable
              parental consent or under the school official exception as
              permitted by COPPA.
            </p>
          </div>
        </div>

        {/* Section 3: How We Use Your Information */}
        <div id="information-use" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            3. How We Use Your Information
          </h2>
          <div className={styles.sectionContent}>
            <p>
              We use the information we collect for the following educational
              purposes:
            </p>

            <p>
              <strong>Educational Services:</strong>
            </p>
            <ul>
              <li>Providing personalized learning experiences</li>
              <li>Adapting difficulty levels based on performance</li>
              <li>Tracking learning progress and generating reports</li>
              <li>Providing feedback on student performance</li>
              <li>
                Facilitating communication between students, teachers, and
                parents
              </li>
            </ul>

            <p>
              <strong>Platform Improvement:</strong>
            </p>
            <ul>
              <li>
                Analyzing usage patterns to improve our educational content
              </li>
              <li>Developing new features and functionality</li>
              <li>
                Conducting educational research (with aggregated, de-identified
                data)
              </li>
              <li>Ensuring platform security and preventing misuse</li>
            </ul>

            <p>
              <strong>Communication:</strong>
            </p>
            <ul>
              <li>
                Sending important updates about your account or our services
              </li>
              <li>Responding to your questions and support requests</li>
              <li>
                Providing educational tips and resources (with your consent)
              </li>
            </ul>

            <p>
              <strong>Legal Basis:</strong> We process your information based on
              legitimate educational interests, contractual necessity, legal
              compliance, and with your consent where required.
            </p>
          </div>
        </div>

        {/* Section 4: Information Sharing and Disclosure */}
        <div id="information-sharing" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            4. Information Sharing and Disclosure
          </h2>
          <div className={styles.sectionContent}>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information only in the following
              limited circumstances:
            </p>

            <p>
              <strong>Educational Stakeholders:</strong>
            </p>
            <ul>
              <li>
                Teachers and school administrators (for their students only)
              </li>
              <li>Parents or guardians (for their children's information)</li>
              <li>Educational institutions (as permitted by FERPA)</li>
            </ul>

            <p>
              <strong>Service Providers:</strong>
            </p>
            <ul>
              <li>
                Trusted third-party service providers who assist in operating
                our platform
              </li>
              <li>Cloud hosting and data storage providers</li>
              <li>
                Analytics providers (with aggregated, de-identified data only)
              </li>
            </ul>

            <p>
              <strong>Legal Requirements:</strong>
            </p>
            <ul>
              <li>When required by law, court order, or government request</li>
              <li>To protect the rights, property, or safety of our users</li>
              <li>
                To investigate potential violations of our Terms of Service
              </li>
            </ul>

            <p>
              <strong>Business Transfers:</strong>
            </p>
            <p>
              In the event of a merger, acquisition, or sale of assets, user
              information may be transferred as part of the transaction, subject
              to the same privacy protections outlined in this policy.
            </p>

            <p>
              <strong>Important:</strong> All third parties who receive your
              information are contractually obligated to protect it and use it
              only for the specified educational purposes.
            </p>
          </div>
        </div>

        {/* Section 5: Data Security and Protection */}
        <div id="data-security" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            5. Data Security and Protection
          </h2>
          <div className={styles.sectionContent}>
            <p>
              We implement comprehensive security measures to protect your
              personal information:
            </p>

            <p>
              <strong>Technical Safeguards:</strong>
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>
                Secure server infrastructure with regular security updates
              </li>
              <li>Multi-factor authentication for administrative access</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Intrusion detection and monitoring systems</li>
            </ul>

            <p>
              <strong>Administrative Safeguards:</strong>
            </p>
            <ul>
              <li>
                Limited access to personal information on a need-to-know basis
              </li>
              <li>Employee training on privacy and security practices</li>
              <li>
                Background checks for employees with access to student data
              </li>
              <li>Incident response procedures for potential data breaches</li>
            </ul>

            <p>
              <strong>Physical Safeguards:</strong>
            </p>
            <ul>
              <li>Secure data centers with restricted physical access</li>
              <li>Environmental controls and monitoring</li>
              <li>
                Secure disposal of hardware containing personal information
              </li>
            </ul>

            <p>
              <strong>Data Breach Response:</strong> In the unlikely event of a
              data breach, we will notify affected users and relevant
              authorities as required by law, typically within 72 hours of
              discovery.
            </p>

            <p>
              While we implement strong security measures, no system is
              completely secure. We encourage users to protect their account
              credentials and report any suspicious activity immediately.
            </p>
          </div>
        </div>

        {/* Section 6: Student Privacy and COPPA Compliance */}
        <div id="student-privacy" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            6. Student Privacy and COPPA Compliance
          </h2>
          <div className={styles.sectionContent}>
            <p>
              We are committed to protecting student privacy and comply with the
              Children's Online Privacy Protection Act (COPPA) and other
              applicable student privacy laws.
            </p>

            <p>
              <strong>Children Under 13:</strong>
            </p>
            <ul>
              <li>
                We collect minimal personal information from children under 13
              </li>
              <li>
                We obtain verifiable parental consent before collecting
                information from children under 13, except when operating under
                the school official exception
              </li>
              <li>
                Parents have the right to review, delete, and refuse further
                collection of their child's information
              </li>
              <li>
                We do not require children to provide more information than
                necessary to participate in educational activities
              </li>
            </ul>

            <p>
              <strong>FERPA Compliance:</strong>
            </p>
            <ul>
              <li>
                We act as a school official with legitimate educational
                interests when providing services to educational institutions
              </li>
              <li>
                We use student educational records only for authorized
                educational purposes
              </li>
              <li>
                We do not re-disclose educational records without proper
                authorization
              </li>
              <li>
                We maintain appropriate security measures for educational
                records
              </li>
            </ul>

            <p>
              <strong>Student Data Protection Pledge:</strong>
            </p>
            <ul>
              <li>Student data is used only for educational purposes</li>
              <li>We do not sell student data or use it for advertising</li>
              <li>We do not create profiles for non-educational purposes</li>
              <li>We provide clear data governance and security practices</li>
            </ul>

            <p>
              <strong>Parental Rights:</strong> Parents have the right to access
              their child's information, request corrections, and request
              deletion of their child's account and associated data.
            </p>
          </div>
        </div>

        {/* Section 7: Cookies and Tracking Technologies */}
        <div id="cookies" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            7. Cookies and Tracking Technologies
          </h2>
          <div className={styles.sectionContent}>
            <p>
              We use cookies and similar technologies to enhance your experience
              on our platform:
            </p>

            <p>
              <strong>Types of Cookies We Use:</strong>
            </p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Required for basic platform
                functionality and security
              </li>
              <li>
                <strong>Performance Cookies:</strong> Help us understand how
                users interact with our platform
              </li>
              <li>
                <strong>Functional Cookies:</strong> Remember your preferences
                and settings
              </li>
              <li>
                <strong>Educational Cookies:</strong> Track learning progress
                and adapt content accordingly
              </li>
            </ul>

            <p>
              <strong>Third-Party Cookies:</strong>
            </p>
            <p>
              We may use third-party analytics services that place cookies on
              your device. These services help us understand platform usage and
              improve our educational content. We ensure that any third-party
              services comply with our privacy standards.
            </p>

            <p>
              <strong>Managing Cookies:</strong>
            </p>
            <ul>
              <li>You can control cookies through your browser settings</li>
              <li>
                Disabling certain cookies may affect platform functionality
              </li>
              <li>
                Essential cookies cannot be disabled while using our service
              </li>
            </ul>

            <p>
              <strong>Do Not Track:</strong> We respect Do Not Track signals and
              do not track users across third-party websites for advertising
              purposes.
            </p>
          </div>
        </div>

        {/* Section 8: Your Rights and Choices */}
        <div id="user-rights" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>8. Your Rights and Choices</h2>
          <div className={styles.sectionContent}>
            <p>You have several rights regarding your personal information:</p>

            <p>
              <strong>Access and Portability:</strong>
            </p>
            <ul>
              <li>Request a copy of your personal information</li>
              <li>Export your learning data in a portable format</li>
              <li>Review your account settings and privacy preferences</li>
            </ul>

            <p>
              <strong>Correction and Updates:</strong>
            </p>
            <ul>
              <li>Update your profile information at any time</li>
              <li>Correct inaccurate information in your account</li>
              <li>Modify your communication preferences</li>
            </ul>

            <p>
              <strong>Deletion and Restriction:</strong>
            </p>
            <ul>
              <li>Request deletion of your account and associated data</li>
              <li>
                Restrict processing of your information for specific purposes
              </li>
              <li>Object to certain uses of your information</li>
            </ul>

            <p>
              <strong>Communication Preferences:</strong>
            </p>
            <ul>
              <li>Opt out of non-essential communications</li>
              <li>Choose how you receive notifications</li>
              <li>Manage email subscription preferences</li>
            </ul>

            <p>
              <strong>How to Exercise Your Rights:</strong>
            </p>
            <p>
              To exercise any of these rights, please contact us using the
              information provided in the Contact section. We will respond to
              your request within 30 days and may require verification of your
              identity.
            </p>

            <p>
              <strong>Note:</strong> Some rights may be limited by applicable
              laws or our legitimate educational interests. We will explain any
              limitations when responding to your request.
            </p>
          </div>
        </div>

        {/* Section 9: Data Retention */}
        <div id="data-retention" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>9. Data Retention</h2>
          <div className={styles.sectionContent}>
            <p>
              We retain your information only as long as necessary to provide
              our educational services and comply with legal obligations:
            </p>

            <p>
              <strong>Active Accounts:</strong>
            </p>
            <ul>
              <li>
                Account information is retained while your account is active
              </li>
              <li>
                Learning progress data is maintained to provide continuous
                educational services
              </li>
              <li>
                Communication records are kept for customer service purposes
              </li>
            </ul>

            <p>
              <strong>Inactive Accounts:</strong>
            </p>
            <ul>
              <li>
                Accounts inactive for 3 years may be deleted after notice to
                users
              </li>
              <li>
                Essential account information may be retained for legal
                compliance
              </li>
              <li>
                Aggregated, de-identified data may be retained for research
                purposes
              </li>
            </ul>

            <p>
              <strong>Deletion Requests:</strong>
            </p>
            <ul>
              <li>
                We will delete your information within 30 days of a valid
                deletion request
              </li>
              <li>Some information may be retained as required by law</li>
              <li>
                Backup systems may retain data for up to 90 days after deletion
              </li>
            </ul>

            <p>
              <strong>Educational Institution Data:</strong>
            </p>
            <p>
              When providing services to schools, we follow the institution's
              data retention policies and applicable educational record laws.
              Student data is typically deleted at the end of the school
              relationship unless otherwise specified.
            </p>

            <p>
              <strong>Legal Holds:</strong> We may retain information longer if
              required for legal proceedings, investigations, or regulatory
              compliance.
            </p>
          </div>
        </div>

        {/* Section 10: International Data Transfers */}
        <div id="international-transfers" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            10. International Data Transfers
          </h2>
          <div className={styles.sectionContent}>
            <p>
              Our services are primarily operated in the United States. If you
              are accessing our services from outside the United States, please
              be aware that your information may be transferred to, stored, and
              processed in the United States.
            </p>

            <p>
              <strong>Data Transfer Safeguards:</strong>
            </p>
            <ul>
              <li>
                We implement appropriate safeguards for international data
                transfers
              </li>
              <li>
                We use standard contractual clauses approved by relevant
                authorities
              </li>
              <li>
                We ensure adequate protection for personal information
                transferred internationally
              </li>
              <li>
                We comply with applicable data protection laws in relevant
                jurisdictions
              </li>
            </ul>

            <p>
              <strong>European Users:</strong>
            </p>
            <p>
              For users in the European Economic Area (EEA), United Kingdom, or
              Switzerland, we comply with applicable data protection
              regulations, including the General Data Protection Regulation
              (GDPR). We provide appropriate safeguards for data transfers and
              respect your rights under these regulations.
            </p>

            <p>
              <strong>Data Localization:</strong> Where required by local laws,
              we may store certain data within specific geographic regions to
              comply with data localization requirements.
            </p>
          </div>
        </div>

        {/* Section 11: Changes to This Privacy Policy */}
        <div id="policy-changes" className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            11. Changes to This Privacy Policy
          </h2>
          <div className={styles.sectionContent}>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, technology, legal requirements, or other
              factors.
            </p>

            <p>
              <strong>Notification of Changes:</strong>
            </p>
            <ul>
              <li>
                We will notify users of material changes via email or platform
                notification
              </li>
              <li>
                We will provide at least 30 days' notice before material changes
                take effect
              </li>
              <li>
                We will post the updated policy on our website with the
                effective date
              </li>
              <li>
                We will maintain previous versions of the policy for reference
              </li>
            </ul>

            <p>
              <strong>Your Consent:</strong>
            </p>
            <p>
              By continuing to use our services after changes become effective,
              you agree to the updated Privacy Policy. If you do not agree with
              the changes, you may discontinue using our services or contact us
              to delete your account.
            </p>

            <p>
              <strong>Material Changes:</strong> We consider changes material if
              they significantly affect how we collect, use, or share your
              personal information, or if they impact your rights under this
              policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
