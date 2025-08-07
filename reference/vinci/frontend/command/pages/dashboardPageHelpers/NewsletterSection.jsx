import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../../services/api.js";
import styles from "../../styles/dashboard.module.css";

function NewsletterSection({ showNotification, setError }) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [summary, setSummary] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("active");

  const loadSubscribers = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search,
        sortBy,
        sortOrder,
        status: statusFilter,
      };

      const response = await dashboardAPI.getNewsletterSubscribers(params);
      setSubscribers(response.data.subscribers);
      setPagination(response.data.pagination);
      setSummary(response.data.summary);
      setCurrentPage(page);
      setError("");
    } catch (err) {
      console.error("Failed to load newsletter subscribers:", err);
      setError("Failed to load newsletter subscribers");
      showNotification("Failed to load newsletter subscribers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers(1);
  }, [search, sortBy, sortOrder, statusFilter]);

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

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "var(--primary-green)";
      case "unsubscribed":
        return "var(--text-muted)";
      default:
        return "var(--text-blue)";
    }
  };

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          Newsletter Subscribers ({summary.totalActive || 0} active)
        </h3>
        <div className={styles.sectionControls}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                statusFilter === "active" ? styles.active : ""
              }`}
              onClick={() => handleStatusFilter("active")}
            >
              Active ({summary.totalActive || 0})
            </button>
            <button
              className={`${styles.filterButton} ${
                statusFilter === "unsubscribed" ? styles.active : ""
              }`}
              onClick={() => handleStatusFilter("unsubscribed")}
            >
              Unsubscribed ({summary.totalUnsubscribed || 0})
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading subscribers...
        </div>
      ) : (
        <>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("email")}
                  style={{ cursor: "pointer" }}
                >
                  Email{" "}
                  {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>User Account</th>
                <th
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer" }}
                >
                  Status{" "}
                  {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("createdAt")}
                  style={{ cursor: "pointer" }}
                >
                  Subscribed{" "}
                  {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("unsubscribed_at")}
                  style={{ cursor: "pointer" }}
                >
                  Unsubscribed{" "}
                  {sortBy === "unsubscribed_at" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td>
                    <div className={styles.emailInfo}>
                      <div className={styles.email}>{subscriber.email}</div>
                    </div>
                  </td>
                  <td>
                    {subscriber.user_id ? (
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>
                          {subscriber.user_id.first_name}{" "}
                          {subscriber.user_id.last_name}
                        </div>
                        <div className={styles.userEmail}>
                          {subscriber.user_id.email}
                        </div>
                        {subscriber.user_id.student_info?.first_name && (
                          <div className={styles.userEmail}>
                            Student:{" "}
                            {subscriber.user_id.student_info.first_name}{" "}
                            {subscriber.user_id.student_info.last_name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.9rem",
                        }}
                      >
                        No account
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        color: getStatusColor(subscriber.status),
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {subscriber.status}
                    </span>
                  </td>
                  <td>{formatDate(subscriber.createdAt)}</td>
                  <td>
                    {subscriber.unsubscribed_at
                      ? formatDate(subscriber.unsubscribed_at)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {subscribers.length === 0 && (
            <div className={styles.noData}>
              <p>No newsletter subscribers found.</p>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => loadSubscribers(currentPage - 1)}
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
                onClick={() => loadSubscribers(currentPage + 1)}
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

export default NewsletterSection;
