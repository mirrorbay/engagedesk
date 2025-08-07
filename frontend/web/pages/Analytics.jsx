import React, { useState, useEffect } from "react";
import {
  getAnalyticsData,
  getAnalyticsSummary,
  getReferralSourceBreakdown,
  getDailyAnalyticsChart,
  getAllUsers,
} from "../services/analyticsService";
import styles from "../styles/analytics.module.css";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [referralBreakdown, setReferralBreakdown] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState("");
  const [usersError, setUsersError] = useState("");
  const [filters, setFilters] = useState({
    days: 7,
    page_path: "",
    excludeLocalIPs: true,
  });

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [summaryResponse, dataResponse, referralResponse, chartResponse] =
        await Promise.all([
          getAnalyticsSummary(filters.days),
          getAnalyticsData({
            page_path: filters.page_path || undefined,
            days: filters.days,
            excludeLocalIPs: filters.excludeLocalIPs,
          }),
          getReferralSourceBreakdown(filters.days),
          getDailyAnalyticsChart(filters.days),
        ]);

      setSummaryData(summaryResponse.data || []);
      setAnalyticsData(dataResponse.data || []);
      setReferralBreakdown(referralResponse.data?.breakdown || []);
      setDailyChartData(chartResponse.data || []);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError("");

      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsersError("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
    loadUsers();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDuration = (milliseconds) => {
    if (!milliseconds || milliseconds < 0) return "N/A";

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getReferralSourceColor = (source) => {
    if (source.includes("Facebook")) return "#1877f2";
    if (source.includes("Reddit")) return "#ff4500";
    if (source.includes("Google")) return "#4285f4";
    if (source.includes("Instagram")) return "#e4405f";
    if (source.includes("Twitter")) return "#1da1f2";
    if (source.includes("LinkedIn")) return "#0077b5";
    if (source.includes("YouTube")) return "#ff0000";
    if (source.includes("Direct") || source.includes("Unknown"))
      return "#28a745";
    return "#6c757d";
  };

  const getTotalStats = () => {
    if (!analyticsData.length)
      return { visits: 0, uniqueVisitors: 0, clicks: 0 };

    const uniqueIPs = new Set();
    let totalClicks = 0;

    analyticsData.forEach((item) => {
      uniqueIPs.add(item.ip_address);
      totalClicks += item.click_events?.length || 0;
    });

    return {
      visits: analyticsData.length,
      uniqueVisitors: uniqueIPs.size,
      clicks: totalClicks,
    };
  };

  const totalStats = getTotalStats();

  const renderClickEvents = (clickEvents) => {
    if (!clickEvents || clickEvents.length === 0) return "No clicks";

    return (
      <div className={styles.clickEventsList}>
        {clickEvents.map((event, index) => (
          <div key={index} className={styles.clickEvent}>
            <div className={styles.clickEventTime}>
              {formatTimestamp(event.click_timestamp)}
            </div>
            <div className={styles.clickEventDetails}>
              <span className={styles.clickEventTag}>
                {event.element_tag || "N/A"}
              </span>
              {event.element_id && (
                <span className={styles.clickEventId}>#{event.element_id}</span>
              )}
              {event.element_class && (
                <span className={styles.clickEventClass}>
                  .{event.element_class}
                </span>
              )}
              {event.element_text && (
                <span className={styles.clickEventText}>
                  "{event.element_text}"
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDeviceInfo = (deviceInfo) => {
    if (!deviceInfo) return "Unknown";

    const { platform, os, browser } = deviceInfo;
    return (
      <div className={styles.deviceInfoCell}>
        <div className={styles.devicePlatform}>{platform || "Unknown"}</div>
        <div className={styles.deviceOS}>{os || "Unknown"}</div>
        {browser && <div className={styles.deviceBrowser}>{browser}</div>}
      </div>
    );
  };

  const renderLocationInfo = (location) => {
    if (!location) return "Unknown";

    const { country, region, city, isLocal } = location;

    if (isLocal) {
      return (
        <div className={styles.locationCell}>
          <div className={styles.locationLocal}>Local/Private</div>
        </div>
      );
    }

    return (
      <div className={styles.locationCell}>
        <div className={styles.locationCountry}>{country}</div>
        {region !== "Unknown" && (
          <div className={styles.locationRegion}>{region}</div>
        )}
        {city !== "Unknown" && (
          <div className={styles.locationCity}>{city}</div>
        )}
      </div>
    );
  };

  const renderScrollEvents = (scrollEvents, maxScrollDepth) => {
    if (!scrollEvents || scrollEvents.length === 0) {
      return maxScrollDepth > 0 ? (
        <div className={styles.scrollInfo}>
          <div className={styles.maxScrollDepth}>Max: {maxScrollDepth}%</div>
        </div>
      ) : (
        "No scroll data"
      );
    }

    return (
      <div className={styles.scrollEventsList}>
        <div className={styles.maxScrollDepth}>
          Max Depth: {maxScrollDepth}%
        </div>
        <div className={styles.scrollEventsCount}>
          {scrollEvents.length} scroll events
        </div>
        <div className={styles.scrollEventsDetails}>
          {scrollEvents.slice(0, 3).map((event, index) => (
            <div key={index} className={styles.scrollEvent}>
              <span className={styles.scrollDepth}>{event.scroll_depth}%</span>
              <span className={styles.scrollTime}>
                {formatTimestamp(event.scroll_timestamp)}
              </span>
            </div>
          ))}
          {scrollEvents.length > 3 && (
            <div className={styles.scrollEventsMore}>
              +{scrollEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVisitDuration = (visitDuration, sessionEndTimestamp) => {
    if (!visitDuration) return "N/A";

    return (
      <div className={styles.visitDurationInfo}>
        <div className={styles.duration}>{formatDuration(visitDuration)}</div>
        {sessionEndTimestamp && (
          <div className={styles.sessionEnd}>
            Ended: {formatTimestamp(sessionEndTimestamp)}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={loadAnalyticsData} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analytics Dashboard</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalStats.visits}</span>
            <span className={styles.statLabel}>Total Visits</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {totalStats.uniqueVisitors}
            </span>
            <span className={styles.statLabel}>Unique Visitors</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalStats.clicks}</span>
            <span className={styles.statLabel}>Total Clicks</span>
          </div>
        </div>
        <button
          onClick={loadAnalyticsData}
          disabled={loading}
          className={styles.refreshButton}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <select
          value={filters.days}
          onChange={(e) => handleFilterChange("days", parseInt(e.target.value))}
          className={styles.filterSelect}
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>

        <input
          type="text"
          placeholder="Filter by page path"
          value={filters.page_path}
          onChange={(e) => handleFilterChange("page_path", e.target.value)}
          className={styles.filterInput}
        />

        <div className={styles.toggleContainer}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={filters.excludeLocalIPs}
              onChange={(e) =>
                handleFilterChange("excludeLocalIPs", e.target.checked)
              }
              className={styles.toggleCheckbox}
            />
            <span className={styles.toggleSlider}></span>
            <span className={styles.toggleText}>Exclude Local IPs</span>
          </label>
        </div>
      </div>

      {/* Team Users Section */}
      <div className={styles.usersSection}>
        <div className={styles.usersSectionHeader}>
          <h2>Team Members ({users.length})</h2>
          <button
            onClick={loadUsers}
            disabled={usersLoading}
            className={styles.refreshButton}
          >
            {usersLoading ? "Loading..." : "Refresh Users"}
          </button>
        </div>

        {usersError && (
          <div className={styles.usersError}>
            <p>{usersError}</p>
            <button onClick={loadUsers} className={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {users.length > 0 && (
          <div className={styles.usersGrid}>
            {users.map((user) => (
              <div key={user._id} className={styles.userCard}>
                <div className={styles.userHeader}>
                  <div className={styles.userAvatar}>
                    {user.icon ? (
                      <img
                        src={user.icon}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    ) : (
                      <div className={styles.userInitials}>
                        {(user.firstName?.[0] || "").toUpperCase()}
                        {(user.lastName?.[0] || "").toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.userBasicInfo}>
                    <div className={styles.userName}>
                      {user.title && (
                        <span className={styles.userTitle}>{user.title} </span>
                      )}
                      {user.firstName} {user.lastName}
                      {user.nickname && (
                        <span className={styles.userNickname}>
                          {" "}
                          ({user.nickname})
                        </span>
                      )}
                    </div>
                    <div className={styles.userEmail}>{user.email}</div>
                    {user.position && (
                      <div className={styles.userPosition}>{user.position}</div>
                    )}
                    {user.department && (
                      <div className={styles.userDepartment}>
                        {user.department}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.userDetails}>
                  {user.gender && (
                    <div className={styles.userDetailItem}>
                      <span className={styles.userDetailLabel}>Gender:</span>
                      <span className={styles.userDetailValue}>
                        {user.gender}
                      </span>
                    </div>
                  )}

                  {user.phones && user.phones.length > 0 && (
                    <div className={styles.userDetailItem}>
                      <span className={styles.userDetailLabel}>Phone:</span>
                      <div className={styles.userPhones}>
                        {user.phones.map((phone, index) => (
                          <div key={index} className={styles.userPhone}>
                            <span className={styles.phoneNumber}>
                              {phone.number}
                            </span>
                            {phone.label && (
                              <span className={styles.phoneLabel}>
                                ({phone.label})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.manager && (
                    <div className={styles.userDetailItem}>
                      <span className={styles.userDetailLabel}>Manager:</span>
                      <span className={styles.userDetailValue}>
                        {user.manager.firstName} {user.manager.lastName}
                      </span>
                    </div>
                  )}

                  {user.emergencyContact &&
                    (user.emergencyContact.name ||
                      user.emergencyContact.phone) && (
                      <div className={styles.userDetailItem}>
                        <span className={styles.userDetailLabel}>
                          Emergency Contact:
                        </span>
                        <div className={styles.emergencyContact}>
                          {user.emergencyContact.name && (
                            <div className={styles.emergencyName}>
                              {user.emergencyContact.name}
                              {user.emergencyContact.relationship && (
                                <span className={styles.emergencyRelationship}>
                                  ({user.emergencyContact.relationship})
                                </span>
                              )}
                            </div>
                          )}
                          {user.emergencyContact.phone && (
                            <div className={styles.emergencyPhone}>
                              {user.emergencyContact.phone}
                            </div>
                          )}
                          {user.emergencyContact.email && (
                            <div className={styles.emergencyEmail}>
                              {user.emergencyContact.email}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  <div className={styles.userMeta}>
                    <div className={styles.userStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[user.status]
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                    <div className={styles.userDates}>
                      <div className={styles.userCreated}>
                        Created: {formatTimestamp(user.createdAt)}
                      </div>
                      <div className={styles.userUpdated}>
                        Updated: {formatTimestamp(user.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {users.length === 0 && !usersLoading && !usersError && (
          <p className={styles.noData}>No team members found</p>
        )}
      </div>

      {/* Daily Analytics Charts */}
      {dailyChartData.length > 0 && (
        <div className={styles.chartsSection}>
          <h2>Daily Analytics (Last {filters.days} days)</h2>
          <div className={styles.chartsContainer}>
            {/* Visitors Chart */}
            <div className={styles.chartContainer}>
              <h3>Daily Visitors</h3>
              <div className={styles.chart}>
                {dailyChartData.map((day, index) => {
                  const maxVisitors = Math.max(
                    ...dailyChartData.map((d) => d.total_visitors)
                  );
                  const height =
                    maxVisitors > 0
                      ? (day.total_visitors / maxVisitors) * 200
                      : 0;

                  return (
                    <div key={index} className={styles.chartBar}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${Math.max(height, 3)}px`,
                          backgroundColor: "#007bff",
                        }}
                        title={`${day.date}: ${day.total_visitors} visitors`}
                      ></div>
                      <div className={styles.barLabel}>{day.date}</div>
                      <div className={styles.barValue}>
                        {day.total_visitors}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clicks Chart */}
            <div className={styles.chartContainer}>
              <h3>Daily Clicks</h3>
              <div className={styles.chart}>
                {dailyChartData.map((day, index) => {
                  const maxClicks = Math.max(
                    ...dailyChartData.map((d) => d.total_clicks)
                  );
                  const height =
                    maxClicks > 0 ? (day.total_clicks / maxClicks) * 200 : 0;

                  return (
                    <div key={index} className={styles.chartBar}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${Math.max(height, 3)}px`,
                          backgroundColor: "#28a745",
                        }}
                        title={`${day.date}: ${day.total_clicks} clicks`}
                      ></div>
                      <div className={styles.barLabel}>{day.date}</div>
                      <div className={styles.barValue}>{day.total_clicks}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Breakdown */}
      {referralBreakdown.length > 0 && (
        <div className={styles.referralSection}>
          <h2>Traffic Sources (Last {filters.days} days)</h2>
          <div className={styles.referralGrid}>
            {referralBreakdown.map((source, index) => (
              <div key={index} className={styles.referralCard}>
                <div className={styles.referralHeader}>
                  <span
                    className={styles.referralSource}
                    style={{
                      backgroundColor: getReferralSourceColor(source.source),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    {source.source}
                  </span>
                  <span className={styles.referralPercentage}>
                    {source.percentage}%
                  </span>
                </div>
                <div className={styles.referralStats}>
                  <div className={styles.referralCount}>
                    {source.count} visits
                  </div>
                  <div className={styles.referralDates}>
                    First: {formatTimestamp(source.firstSeen)}
                    <br />
                    Last: {formatTimestamp(source.lastSeen)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Data Table */}
      <div className={styles.tableSection}>
        <h2>Detailed Analytics</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Visit Time</th>
                <th>IP Address</th>
                <th>Location</th>
                <th>Device Info</th>
                <th>Page Path</th>
                <th>Referrer</th>
                <th>Visit Duration</th>
                <th>Scroll Events</th>
                <th>Click Events</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((item) => (
                <tr key={item._id}>
                  <td className={styles.timestampCell}>
                    {formatTimestamp(item.visit_timestamp)}
                  </td>
                  <td className={styles.ipCell}>{item.ip_address}</td>
                  <td className={styles.locationCell}>
                    {renderLocationInfo(item.location)}
                  </td>
                  <td className={styles.deviceCell}>
                    {renderDeviceInfo(item.device_info)}
                  </td>
                  <td className={styles.pathCell}>{item.page_path}</td>
                  <td className={styles.referrerCell}>
                    {item.referrer || "Direct"}
                  </td>
                  <td className={styles.visitDurationCell}>
                    {renderVisitDuration(
                      item.visit_duration,
                      item.session_end_timestamp
                    )}
                  </td>
                  <td className={styles.scrollEventsCell}>
                    {renderScrollEvents(
                      item.scroll_events,
                      item.max_scroll_depth
                    )}
                  </td>
                  <td className={styles.clickEventsCell}>
                    {renderClickEvents(item.click_events)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {analyticsData.length === 0 && !loading && (
            <p className={styles.noData}>No analytics data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
