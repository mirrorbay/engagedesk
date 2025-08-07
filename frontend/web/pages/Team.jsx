import React from "react";
import styles from "../styles/team.module.css";

function TeamPage() {
  return (
    <div className={styles.teamPage}>
      <div className={styles.header}>
        <h1 className="text-3xl font-bold mb-md">Team Collaboration</h1>
        <p className="text-lg text-secondary mb-lg">
          Team communication and collaboration tools
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.teamMessages}>
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Team Messages</h2>
            </div>
            <div className="card-body">
              <div className={styles.placeholder}>
                Team messages will be implemented here
              </div>
            </div>
          </div>
        </div>

        <div className={styles.teamPosts}>
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Team Posts</h2>
            </div>
            <div className="card-body">
              <div className={styles.placeholder}>
                Team posts will be implemented here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
