import React, { useState, useEffect } from "react";
import { Mail, Phone, Calendar, MessageSquare, Clock } from "lucide-react";
import { clientService } from "../../services/clientService";
import UserDisplay from "../shared/UserDisplay";
import TimeDisplay from "../shared/TimeDisplay";
import styles from "../../styles/client/interactionRecords.module.css";

// Utility function to clean HTML content by removing tracking pixels
const cleanHtmlContent = (htmlContent) => {
  if (!htmlContent) return htmlContent;

  // Remove tracking pixels (img tags with tracking URLs)
  return htmlContent.replace(
    /<img[^>]*src=["'][^"']*\/api\/email\/track\/[^"']*["'][^>]*>/gi,
    ""
  );
};

const InteractionRecords = ({ client, onEmailClient }) => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 5,
  });

  const fetchInteractions = async (page = 1) => {
    if (!client?._id) return;

    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page.toString(),
        limit: pagination.limit.toString(),
      };

      const result = await clientService.getClientInteractions(
        client._id,
        params
      );

      if (result.success) {
        setInteractions(result.data.interactions);
        setPagination(result.data.pagination);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching client interactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [client?._id]);

  const getInteractionIcon = (type) => {
    switch (type) {
      case "email":
        return <Mail size={16} />;
      case "call":
        return <Phone size={16} />;
      case "meeting":
        return <Calendar size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const getInteractionTypeLabel = (type) => {
    switch (type) {
      case "email":
        return "Email";
      case "call":
        return "Call";
      case "meeting":
        return "Meeting";
      default:
        return "Interaction";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEmailStatus = (interaction) => {
    if (interaction.type !== "email" || !interaction.email) return null;

    const status = interaction.email.status;
    const statusColors = {
      sent: "#6b7280",
      opened: "#3b82f6",
      clicked: "#10b981",
      bounced: "#ef4444",
    };

    return (
      <span
        className={styles.emailStatus}
        style={{ color: statusColors[status] || statusColors.sent }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderInteractionDetails = (interaction) => {
    switch (interaction.type) {
      case "email":
        return renderEmailDetails(interaction);
      case "call":
        return renderCallDetails(interaction);
      case "meeting":
        return renderMeetingDetails(interaction);
      default:
        return null;
    }
  };

  const renderEmailDetails = (interaction) => {
    if (!interaction.email) return null;

    const { email } = interaction;
    const hasOpened = email.openedAt && email.openedAt.length > 0;
    const hasClicked = email.clickedAt && email.clickedAt.length > 0;

    return (
      <div className={styles.emailStickers}>
        {/* Opened Sticker */}
        {hasOpened ? (
          <div
            className={`${styles.sticker} ${styles.openedSticker} ${styles.opened}`}
          >
            Opened {email.openedAt.length}x
          </div>
        ) : (
          <div
            className={`${styles.sticker} ${styles.notOpenedSticker} ${styles.notOpened}`}
          >
            Not opened
          </div>
        )}

        {/* Clicked Sticker */}
        {hasClicked ? (
          <div
            className={`${styles.sticker} ${styles.clickedSticker} ${styles.clicked}`}
          >
            {email.clickedAt.length} click
            {email.clickedAt.length !== 1 ? "s" : ""}
          </div>
        ) : (
          <div
            className={`${styles.sticker} ${styles.notClickedSticker} ${styles.notClicked}`}
          >
            No clicks
          </div>
        )}
      </div>
    );
  };

  const renderCallDetails = (interaction) => {
    return (
      <div className={styles.callDetails}>
        <div className={styles.callMetrics}>
          <div className={styles.callMetric}>
            <span className={styles.metricLabel}>Call Type:</span>
            <span className={styles.metricValue}>Voice Call</span>
          </div>
          {interaction.sentFrom && (
            <div className={styles.callMetric}>
              <span className={styles.metricLabel}>Initiated by:</span>
              <span className={styles.metricValue}>{interaction.sentFrom}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMeetingDetails = (interaction) => {
    return (
      <div className={styles.meetingDetails}>
        <div className={styles.meetingMetrics}>
          <div className={styles.meetingMetric}>
            <span className={styles.metricLabel}>Meeting Type:</span>
            <span className={styles.metricValue}>
              In-person/Virtual Meeting
            </span>
          </div>
          {interaction.sentFrom && (
            <div className={styles.meetingMetric}>
              <span className={styles.metricLabel}>Location/Platform:</span>
              <span className={styles.metricValue}>{interaction.sentFrom}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handlePageChange = (newPage) => {
    fetchInteractions(newPage);
  };

  if (!client) {
    return null;
  }

  return (
    <div className={styles.interactionRecords}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <MessageSquare size={18} />
          Interaction Records ({pagination.totalCount})
        </h3>
        {onEmailClient && (
          <button
            className={styles.emailButton}
            onClick={() => onEmailClient(client)}
            title="Send email to client"
          >
            <Mail size={16} />
            Email
          </button>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          <p>Error loading interactions: {error}</p>
          <button
            onClick={() => fetchInteractions()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {loading && interactions.length === 0 ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading interactions...</p>
        </div>
      ) : (
        <>
          {interactions.length === 0 ? (
            <div className={styles.noInteractions}>
              <p>No interactions recorded yet.</p>
            </div>
          ) : (
            <div className={styles.interactionsList}>
              {interactions.map((interaction) => (
                <div key={interaction._id} className={styles.interactionItem}>
                  <div className={styles.interactionHeader}>
                    <div className={styles.interactionType}>
                      {getInteractionIcon(interaction.type)}
                      <span className={styles.typeLabel}>
                        {getInteractionTypeLabel(interaction.type)}
                      </span>
                      {getEmailStatus(interaction)}
                    </div>
                    <div className={styles.interactionMeta}>
                      <div className={styles.user}>
                        <UserDisplay user={interaction.userId} size="sm" />
                      </div>
                      <div className={styles.timestamp}>
                        <Clock size={14} />
                        <TimeDisplay date={interaction.createdAt} />
                      </div>
                    </div>
                  </div>

                  {interaction.subject && (
                    <div className={styles.subject}>
                      <span className={styles.subjectLabel}>Subject:</span>
                      <strong>{interaction.subject}</strong>
                    </div>
                  )}

                  {(interaction.content ||
                    (interaction.type === "email" &&
                      interaction.email?.htmlContent)) && (
                    <div className={styles.content}>
                      <span className={styles.contentLabel}>Content:</span>
                      <div className={styles.contentText}>
                        {interaction.type === "email" &&
                        interaction.email?.htmlContent ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: cleanHtmlContent(
                                interaction.email.htmlContent
                              ),
                            }}
                          />
                        ) : (
                          interaction.content
                        )}
                      </div>
                    </div>
                  )}

                  {renderInteractionDetails(interaction)}

                  {interaction.teamComments &&
                    interaction.teamComments.length > 0 && (
                      <div className={styles.teamComments}>
                        <div className={styles.commentsHeader}>
                          Team Comments:
                        </div>
                        {interaction.teamComments.map((comment, index) => (
                          <div key={index} className={styles.comment}>
                            <div className={styles.commentMeta}>
                              <UserDisplay user={comment.userId} size="sm" />
                              <TimeDisplay
                                date={comment.timestamp}
                                className={styles.commentTime}
                              />
                            </div>
                            <div className={styles.commentContent}>
                              {typeof comment.comment === "string"
                                ? comment.comment
                                : JSON.stringify(comment.comment)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage || loading}
                className={styles.pageButton}
              >
                Previous
              </button>

              <span className={styles.pageInfo}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage || loading}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}

          {loading && interactions.length > 0 && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner}></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InteractionRecords;
