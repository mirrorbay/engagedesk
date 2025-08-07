import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Zap, User, Users, BookOpen, BarChart3 } from "lucide-react";
import Header from "./Header";
import styles from "../../styles/app.module.css";

const AppLayout = () => {
  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      <nav className={styles.bottomNav}>
        <div className={styles.navTabs}>
          <NavLink
            to="/app"
            className={({ isActive }) =>
              `${styles.navTab} ${isActive ? styles.active : ""}`
            }
            end
          >
            <Zap className={styles.tabIcon} size={20} />
            <span className={styles.tabLabel}>Action</span>
          </NavLink>
          <NavLink
            to="/app/client"
            className={({ isActive }) =>
              `${styles.navTab} ${isActive ? styles.active : ""}`
            }
          >
            <User className={styles.tabIcon} size={20} />
            <span className={styles.tabLabel}>Client</span>
          </NavLink>
          <NavLink
            to="/app/team"
            className={({ isActive }) =>
              `${styles.navTab} ${isActive ? styles.active : ""}`
            }
          >
            <Users className={styles.tabIcon} size={20} />
            <span className={styles.tabLabel}>Team</span>
          </NavLink>
          <NavLink
            to="/app/knowledge"
            className={({ isActive }) =>
              `${styles.navTab} ${isActive ? styles.active : ""}`
            }
          >
            <BookOpen className={styles.tabIcon} size={20} />
            <span className={styles.tabLabel}>Knowledge</span>
          </NavLink>
          <NavLink
            to="/app/analytics"
            className={({ isActive }) =>
              `${styles.navTab} ${isActive ? styles.active : ""}`
            }
          >
            <BarChart3 className={styles.tabIcon} size={20} />
            <span className={styles.tabLabel}>Analytics</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default AppLayout;
