import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";
import styles from "../styles/footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user, isAuthenticated } = useAuth();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <div className={styles.logoContainer}>
                <svg
                  className={styles.logoIcon}
                  width="32"
                  height="32"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" fill="#ffffff" />
                  <path
                    d="M20 50 L40 70 L80 30"
                    stroke="#4a4a4a"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <h1 className={styles.logoText}>DaVinci Focus</h1>
              </div>
            </Link>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>Product</h3>
              <Link to="/demo" className={styles.link}>
                Feature Demo
              </Link>
              <Link to="/contact" className={styles.link}>
                Contact Us
              </Link>
            </div>
            <div className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>Support</h3>
              <Link to="/privacy-policy" className={styles.link}>
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className={styles.link}>
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
