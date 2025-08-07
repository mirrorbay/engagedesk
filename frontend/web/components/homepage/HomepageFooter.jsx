import React from "react";
import styles from "../../styles/homepage/homepageFooter.module.css";

const HomepageFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.linksSection}>
            <a href="/terms" className={styles.footerLink}>
              Terms of Use
            </a>
            <a href="/privacy" className={styles.footerLink}>
              Privacy Policy
            </a>
            <a href="/about" className={styles.footerLink}>
              About Us
            </a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2025 EngageDesk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomepageFooter;
