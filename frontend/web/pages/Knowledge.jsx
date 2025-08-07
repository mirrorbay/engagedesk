import React from "react";
import styles from "../styles/knowledge.module.css";

function KnowledgePage() {
  return (
    <div className={styles.knowledgePage}>
      <div className={styles.header}>
        <h1 className="text-3xl font-bold mb-md">Knowledge Base</h1>
        <p className="text-lg text-secondary mb-lg">
          Manage and access knowledge resources
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.knowledgeSearch}>
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Search Knowledge</h2>
            </div>
            <div className="card-body">
              <div className={styles.placeholder}>
                Knowledge search will be implemented here
              </div>
            </div>
          </div>
        </div>

        <div className={styles.knowledgeList}>
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Knowledge Articles</h2>
            </div>
            <div className="card-body">
              <div className={styles.placeholder}>
                Knowledge articles will be implemented here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgePage;
