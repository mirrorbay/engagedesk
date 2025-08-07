import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../../services/api.js";
import styles from "../../styles/dashboard.module.css";

function ContactsSection({ showNotification, setError }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const loadContacts = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await dashboardAPI.getContactMessages(params);
      setContacts(response.data.contacts);
      setPagination(response.data.pagination);
      setCurrentPage(page);
      setError("");
    } catch (err) {
      console.error("Failed to load contacts:", err);
      setError("Failed to load contact messages");
      showNotification("Failed to load contact messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts(1);
  }, [statusFilter]);

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await dashboardAPI.updateContactStatus(contactId, { status: newStatus });
      showNotification(`Contact status updated to ${newStatus}`, "success");
      loadContacts(currentPage); // Reload current page
    } catch (err) {
      console.error("Failed to update contact status:", err);
      showNotification("Failed to update contact status", "error");
    }
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

  const truncateMessage = (message, maxLength = 100) => {
    if (!message) return "";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Contact Messages</h3>
        <div className={styles.sectionControls}>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading contacts...
        </div>
      ) : (
        <>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Topic</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{contact.name}</div>
                      <div className={styles.userEmail}>{contact.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactTopic}>{contact.topic}</div>
                  </td>
                  <td>
                    <div title={contact.message}>
                      {truncateMessage(contact.message)}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.contactStatus} ${
                        styles[contact.status]
                      }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td>{formatDate(contact.createdAt)}</td>
                  <td>
                    {contact.status === "new" && (
                      <button
                        className={styles.paginationButton}
                        onClick={() =>
                          handleStatusUpdate(contact._id, "in_progress")
                        }
                        style={{
                          margin: "2px",
                          fontSize: "0.6rem",
                          padding: "4px 6px",
                        }}
                      >
                        Start
                      </button>
                    )}
                    {contact.status === "in_progress" && (
                      <button
                        className={styles.paginationButton}
                        onClick={() =>
                          handleStatusUpdate(contact._id, "resolved")
                        }
                        style={{
                          margin: "2px",
                          fontSize: "0.6rem",
                          padding: "4px 6px",
                        }}
                      >
                        Resolve
                      </button>
                    )}
                    {contact.status === "resolved" && (
                      <button
                        className={styles.paginationButton}
                        onClick={() =>
                          handleStatusUpdate(contact._id, "closed")
                        }
                        style={{
                          margin: "2px",
                          fontSize: "0.6rem",
                          padding: "4px 6px",
                        }}
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => loadContacts(currentPage - 1)}
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
                onClick={() => loadContacts(currentPage + 1)}
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

export default ContactsSection;
