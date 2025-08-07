import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Play } from "lucide-react";
import styles from "../../styles/homepage/homepageHeader.module.css";

const HomepageHeader = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleDemoClick = () => {
    navigate("/demo");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo} onClick={handleLogoClick}>
          <h1>EngageDesk</h1>
        </div>
        <div className={styles.actions}>
          <button onClick={handleDemoClick} className={styles.demoButton}>
            <Play size={16} />
            Demo
          </button>
          <button onClick={onLogin} className={styles.loginButton}>
            <LogIn size={16} />
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default HomepageHeader;
