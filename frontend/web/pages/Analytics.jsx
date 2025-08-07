import React, { useState, useEffect } from "react";
import {
  getAnalyticsData,
  getAnalyticsSummary,
  getReferralSourceBreakdown,
  getDailyAnalyticsChart,
} from "../services/analyticsService";
import styles from "../styles/analytics.module.css";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [referralBreakdown, setReferralBreakdown] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    days: 7,
    page_path: "",
    showLocalIPs: false,
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

  useEffect(() => {
    loadAnalyticsData();
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
                <th>Device Info</th>
                <th>Page Path</th>
                <th>Referrer</th>
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
                  <td className={styles.deviceCell}>
                    {renderDeviceInfo(item.device_info)}
                  </td>
                  <td className={styles.pathCell}>{item.page_path}</td>
                  <td className={styles.referrerCell}>
                    {item.referrer || "Direct"}
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
