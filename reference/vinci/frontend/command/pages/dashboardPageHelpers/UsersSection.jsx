import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../../services/api.js";
import styles from "../../styles/dashboard.module.css";

function UsersSection({ showNotification, setError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [referralExpanded, setReferralExpanded] = useState(new Set());

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search,
        sortBy,
        sortOrder,
      };

      const response = await dashboardAPI.getUserRecords(params);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      setCurrentPage(page);
      setError("");
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load user records");
      showNotification("Failed to load user records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, [search, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleReferralDetails = (userId) => {
    const newReferralExpanded = new Set(referralExpanded);

    if (referralExpanded.has(userId)) {
      newReferralExpanded.delete(userId);
    } else {
      newReferralExpanded.add(userId);
    }

    setReferralExpanded(newReferralExpanded);
  };

  const getReferralSourceColor = (source) => {
    if (source.includes("Facebook")) return "var(--primary-blue)";
    if (source.includes("Reddit")) return "var(--primary-red)";
    if (source.includes("Google")) return "var(--primary-green)";
    if (source.includes("Instagram")) return "var(--accent-purple)";
    if (source.includes("Twitter")) return "var(--accent-blue)";
    return "var(--text-blue)";
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>User Records</h3>
        <div className={styles.sectionControls}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading users...
        </div>
      ) : (
        <>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("first_name")}
                  style={{ cursor: "pointer" }}
                >
                  User{" "}
                  {sortBy === "first_name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("sessionCount")}
                  style={{ cursor: "pointer" }}
                >
                  Sessions{" "}
                  {sortBy === "sessionCount" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("createdAt")}
                  style={{ cursor: "pointer" }}
                >
                  Joined{" "}
                  {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("last_login")}
                  style={{ cursor: "pointer" }}
                >
                  Last Active{" "}
                  {sortBy === "last_login" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Referral Source</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <React.Fragment key={user._id}>
                  <tr>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>
                          {user.first_name} {user.last_name}
                        </div>
                        <div className={styles.userEmail}>{user.email}</div>
                        {user.student_info?.first_name && (
                          <div className={styles.userEmail}>
                            Student: {user.student_info.first_name}{" "}
                            {user.student_info.last_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.sessionStats}>
                        <div className={styles.sessionScore}>
                          {user.sessionCount || 0}
                        </div>
                        <div className={styles.sessionTime}>sessions</div>
                      </div>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.lastActivity)}</td>
                    <td>
                      {user.referralSource ? (
                        <button
                          onClick={() => toggleReferralDetails(user._id)}
                          className={styles.refreshButton}
                          style={{
                            fontSize: "0.9rem",
                            padding: "4px 8px",
                            backgroundColor: getReferralSourceColor(
                              user.referralSource.primarySource
                            ),
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                          }}
                        >
                          {user.referralSource.primarySource}
                        </button>
                      ) : (
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.9rem",
                          }}
                        >
                          Loading...
                        </span>
                      )}
                    </td>
                  </tr>
                  {referralExpanded.has(user._id) && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          padding: "10px",
                          backgroundColor: "var(--background-light)",
                          borderTop: "1px solid var(--border-color)",
                        }}
                      >
                        {user.referralSource ? (
                          <div>
                            <h4
                              style={{
                                color: "var(--accent-yellow)",
                                marginBottom: "10px",
                                fontSize: "1rem",
                              }}
                            >
                              Referral Source Analysis
                            </h4>

                            <div style={{ marginBottom: "15px" }}>
                              <strong style={{ color: "var(--primary-green)" }}>
                                Primary Source:{" "}
                                {user.referralSource.primarySource}
                              </strong>
                              {user.referralSource.firstReferrer && (
                                <div
                                  style={{
                                    marginTop: "5px",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  <span style={{ color: "var(--text-blue)" }}>
                                    First Visit:{" "}
                                    {formatTimestamp(
                                      user.referralSource.firstReferrer
                                        .timestamp
                                    )}
                                  </span>
                                  <br />
                                  <span style={{ color: "var(--text-muted)" }}>
                                    From:{" "}
                                    {user.referralSource.firstReferrer.referrer}
                                  </span>
                                  <br />
                                  <span style={{ color: "var(--text-muted)" }}>
                                    Page:{" "}
                                    {user.referralSource.firstReferrer.page}
                                  </span>
                                </div>
                              )}
                            </div>

                            {Object.keys(user.referralSource.sourceBreakdown)
                              .length > 0 && (
                              <div style={{ marginBottom: "15px" }}>
                                <h5
                                  style={{
                                    color: "var(--text-blue)",
                                    marginBottom: "8px",
                                  }}
                                >
                                  Source Breakdown:
                                </h5>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                  }}
                                >
                                  {Object.entries(
                                    user.referralSource.sourceBreakdown
                                  ).map(([source, count]) => (
                                    <span
                                      key={source}
                                      style={{
                                        backgroundColor:
                                          getReferralSourceColor(source),
                                        color: "white",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      {source}: {count} visits
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {user.referralSource.allReferrers &&
                              user.referralSource.allReferrers.length > 0 && (
                                <div>
                                  <h5
                                    style={{
                                      color: "var(--text-blue)",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    Visit Sequence (
                                    {user.referralSource.allReferrers.length}{" "}
                                    visits):
                                  </h5>
                                  <div
                                    style={{
                                      maxHeight: "200px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    <table
                                      style={{
                                        width: "100%",
                                        fontSize: "0.85rem",
                                      }}
                                    >
                                      <thead>
                                        <tr>
                                          <th
                                            style={{
                                              color: "var(--text-blue)",
                                              textAlign: "left",
                                            }}
                                          >
                                            Time
                                          </th>
                                          <th
                                            style={{
                                              color: "var(--text-blue)",
                                              textAlign: "left",
                                            }}
                                          >
                                            Source
                                          </th>
                                          <th
                                            style={{
                                              color: "var(--text-blue)",
                                              textAlign: "left",
                                            }}
                                          >
                                            Referrer
                                          </th>
                                          <th
                                            style={{
                                              color: "var(--text-blue)",
                                              textAlign: "left",
                                            }}
                                          >
                                            Page
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {user.referralSource.allReferrers.map(
                                          (referrer, index) => (
                                            <tr key={index}>
                                              <td
                                                style={{
                                                  color: "var(--text-blue)",
                                                }}
                                              >
                                                {formatTimestamp(
                                                  referrer.timestamp
                                                )}
                                              </td>
                                              <td>
                                                <span
                                                  style={{
                                                    backgroundColor:
                                                      getReferralSourceColor(
                                                        referrer.source
                                                      ),
                                                    color: "white",
                                                    padding: "2px 6px",
                                                    borderRadius: "3px",
                                                    fontSize: "0.75rem",
                                                  }}
                                                >
                                                  {referrer.source}
                                                </span>
                                              </td>
                                              <td
                                                style={{
                                                  color: "var(--text-muted)",
                                                  maxWidth: "200px",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  whiteSpace: "nowrap",
                                                }}
                                              >
                                                {referrer.referrer}
                                              </td>
                                              <td
                                                style={{
                                                  color: "var(--text-blue)",
                                                }}
                                              >
                                                {referrer.page}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                          </div>
                        ) : (
                          <div
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "1rem",
                            }}
                          >
                            No referral source data available for this user.
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {pagination && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => loadUsers(currentPage - 1)}
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
                onClick={() => loadUsers(currentPage + 1)}
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

export default UsersSection;
