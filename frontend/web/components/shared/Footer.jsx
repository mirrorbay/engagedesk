import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/shared/footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <h3>EngageDesk</h3>
            </div>
          </div>

          <div className={styles.linksSection}>
            <Link to="/terms" className={styles.footerLink}>
              Terms of Use
            </Link>
            <Link to="/privacy" className={styles.footerLink}>
              Privacy Policy
            </Link>
            <Link to="/about" className={styles.footerLink}>
              About Us
            </Link>
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

export default Footer;
