import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../../services/api.js";
import styles from "../../styles/dashboard.module.css";

function SessionsSection({ showNotification, setError }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const loadSessions = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };

      const response = await dashboardAPI.getStudySessions(params);
      setSessions(response.data.sessions);
      setPagination(response.data.pagination);
      setCurrentPage(page);
      setError("");
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError("Failed to load study sessions");
      showNotification("Failed to load study sessions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions(1);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getUserName = (user) => {
    if (!user) return "Unknown User";
    return (
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email
    );
  };

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Study Sessions</h3>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading sessions...
        </div>
      ) : (
        <>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Concepts</th>
                <th>Progress</th>
                <th>Performance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session._id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>
                        {getUserName(session.user_id)}
                      </div>
                      {session.user_id?.student_info?.first_name && (
                        <div className={styles.userEmail}>
                          Student: {session.user_id.student_info.first_name}{" "}
                          {session.user_id.student_info.last_name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactTopic}>
                      {session.target_concepts?.slice(0, 2).join(", ")}
                      {session.target_concepts?.length > 2 && "..."}
                    </div>
                  </td>
                  <td>
                    <div className={styles.sessionStats}>
                      <div className={styles.sessionScore}>
                        {session.stats?.completedProblems || 0}/
                        {session.stats?.totalProblems || 0}
                      </div>
                      <div className={styles.sessionCompletion}>
                        {session.stats?.completionRate || 0}% complete
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.sessionStats}>
                      <div className={styles.sessionScore}>
                        {session.stats?.averageScore || 0}/10
                      </div>
                      <div className={styles.sessionTime}>
                        {formatTime(session.stats?.totalTimeSpent || 0)}
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(session.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => loadSessions(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>

              <div className={styles.paginationInfo}>
                Page {pagination.currentPage} of {pagination.totalPages} (
                {pagination.totalItems} total)
              </div>

              <button
                className={styles.paginationButton}
                onClick={() => loadSessions(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SessionsSection;
