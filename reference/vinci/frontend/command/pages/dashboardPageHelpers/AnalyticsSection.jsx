import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../../services/api.js";
import styles from "../../styles/dashboard.module.css";

function AnalyticsSection({ showNotification, setError }) {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [referralBreakdown, setReferralBreakdown] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localhostConfig, setLocalhostConfig] = useState(null);
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });
  const [filters, setFilters] = useState({
    days: 7,
    page_path: "",
    showLocalIPs: false,
  });

  // Dynamic localhost exclusion function using backend config
  const isLocalOrPrivateIP = (ip) => {
    if (!localhostConfig) {
      // Fallback to basic check if config not loaded yet
      return (
        ip === "127.0.0.1" ||
        ip === "::1" ||
        ip.startsWith("192.168.") ||
        ip.startsWith("10.") ||
        ip.startsWith("172.") ||
        ip.startsWith("24.4")
      );
    }

    const config = localhostConfig.config;

    // Handle null, undefined, or empty values
    if (!ip || config.specialValues.includes(ip)) {
      return true;
    }

    const cleanIP = ip.trim();

    // Check IPv4 localhost
    if (config.ipv4Localhost.includes(cleanIP)) {
      return true;
    }

    // Check IPv6 localhost
    if (config.ipv6Localhost.includes(cleanIP)) {
      return true;
    }

    // Check private IP ranges
    const { privateIPRanges } = config;

    // Class A private range (10.x.x.x)
    if (privateIPRanges.classA.some((prefix) => cleanIP.startsWith(prefix))) {
      return true;
    }

    // Class B private range (172.16.x.x - 172.31.x.x)
    if (privateIPRanges.classB.some((prefix) => cleanIP.startsWith(prefix))) {
      return true;
    }

    // Class C private range (192.168.x.x)
    if (privateIPRanges.classC.some((prefix) => cleanIP.startsWith(prefix))) {
      return true;
    }

    // Link-local addresses (169.254.x.x)
    if (
      privateIPRanges.linkLocal.some((prefix) => cleanIP.startsWith(prefix))
    ) {
      return true;
    }

    // Development/testing IPs
    if (config.developmentIPs.some((prefix) => cleanIP.startsWith(prefix))) {
      return true;
    }

    return false;
  };

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [summaryResponse, dataResponse, referralResponse, chartResponse] =
        await Promise.all([
          dashboardAPI.getAnalyticsSummary(filters.days),
          dashboardAPI.getAnalyticsData({
            page_path: filters.page_path || undefined,
          }),
          dashboardAPI.getReferralSourceBreakdown(filters.days),
          dashboardAPI.getDailyAnalyticsChart(filters.days),
        ]);

      setSummaryData(summaryResponse.data.data || []);
      // Backend now provides location data directly
      setAnalyticsData(dataResponse.data.data || []);
      setReferralBreakdown(referralResponse.data.data?.breakdown || []);
      setDailyChartData(chartResponse.data.data || []);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Load localhost exclusion config on component mount
  useEffect(() => {
    const loadLocalhostConfig = async () => {
      try {
        const response = await dashboardAPI.getLocalhostExclusionConfig();
        setLocalhostConfig(response.data.data);
      } catch (err) {
        console.error("Failed to load localhost exclusion config:", err);
        // Continue with fallback logic in isLocalOrPrivateIP function
      }
    };

    loadLocalhostConfig();
  }, []);

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
    if (!summaryData.length) return { visits: 0, uniqueVisitors: 0, clicks: 0 };

    // Filter summary data based on showLocalIPs setting
    // Note: Summary data doesn't have IP addresses directly, so we need to filter
    // the detailed analytics data and calculate stats from that
    const filteredData = analyticsData.filter((item) => {
      if (!filters.showLocalIPs) {
        // Check if any IP in the record is local/private
        if (item.ip_addresses && item.ip_addresses.length > 0) {
          return !item.ip_addresses.some((ip) => isLocalOrPrivateIP(ip));
        } else {
          return !isLocalOrPrivateIP(item.ip_address);
        }
      }
      return true;
    });

    // Calculate stats from filtered detailed data
    const uniqueIPs = new Set();
    let totalClicks = 0;

    filteredData.forEach((item) => {
      // Add all IP addresses to the unique set
      if (item.ip_addresses && item.ip_addresses.length > 0) {
        item.ip_addresses.forEach((ip) => uniqueIPs.add(ip));
      } else {
        uniqueIPs.add(item.ip_address);
      }
      totalClicks += item.click_events?.length || 0;
    });

    return {
      visits: filteredData.length,
      uniqueVisitors: uniqueIPs.size,
      clicks: totalClicks,
    };
  };

  const totalStats = getTotalStats();

  // Filter analytics data based on showLocalIPs setting
  const filteredAnalyticsData = analyticsData.filter((item) => {
    if (!filters.showLocalIPs) {
      // Check if any IP in the record is local/private
      if (item.ip_addresses && item.ip_addresses.length > 0) {
        return !item.ip_addresses.some((ip) => isLocalOrPrivateIP(ip));
      } else {
        return !isLocalOrPrivateIP(item.ip_address);
      }
    }
    return true;
  });

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

  const handleMouseEnter = (event, content) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      show: true,
      content,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, content: "", x: 0, y: 0 });
  };

  const createVisitorTooltip = (day) => {
    const details = day.details;
    if (!details) {
      return `${day.date}: ${day.total_visitors} visitors`;
    }

    let tooltip = `${day.date}: ${day.total_visitors} visitors\n\n`;

    if (details.topLocations && details.topLocations.length > 0) {
      tooltip += "📍 Top Locations:\n";
      details.topLocations.forEach((loc) => {
        tooltip += `  • ${loc.name}: ${loc.count}\n`;
      });
      tooltip += "\n";
    }

    if (details.topDevices && details.topDevices.length > 0) {
      tooltip += "💻 Top Devices:\n";
      details.topDevices.forEach((device) => {
        tooltip += `  • ${device.name}: ${device.count}\n`;
      });
      tooltip += "\n";
    }

    if (details.topReferrers && details.topReferrers.length > 0) {
      tooltip += "🔗 Top Referrers:\n";
      details.topReferrers.forEach((ref) => {
        tooltip += `  • ${ref.name}: ${ref.count}\n`;
      });
      tooltip += "\n";
    }

    if (details.topPages && details.topPages.length > 0) {
      tooltip += "📄 Top Pages:\n";
      details.topPages.forEach((page) => {
        tooltip += `  • ${page.name}: ${page.count}\n`;
      });
    }

    return tooltip.trim();
  };

  const createClickTooltip = (day) => {
    const details = day.details;
    const clickRate =
      day.total_visitors > 0
        ? ((day.total_clicks / day.total_visitors) * 100).toFixed(1)
        : "0";

    if (!details) {
      return `${day.date}: ${clickRate}% click rate (${day.total_clicks} clicks / ${day.total_visitors} visitors)`;
    }

    let tooltip = `${day.date}: ${clickRate}% click rate\n`;
    tooltip += `${day.total_clicks} clicks / ${day.total_visitors} visitors\n\n`;

    if (details.topLocations && details.topLocations.length > 0) {
      tooltip += "📍 Visitor Locations:\n";
      details.topLocations.forEach((loc) => {
        tooltip += `  • ${loc.name}: ${loc.count}\n`;
      });
      tooltip += "\n";
    }

    if (details.topDevices && details.topDevices.length > 0) {
      tooltip += "💻 Device Types:\n";
      details.topDevices.forEach((device) => {
        tooltip += `  • ${device.name}: ${device.count}\n`;
      });
      tooltip += "\n";
    }

    if (details.topReferrers && details.topReferrers.length > 0) {
      tooltip += "🔗 Traffic Sources:\n";
      details.topReferrers.forEach((ref) => {
        tooltip += `  • ${ref.name}: ${ref.count}\n`;
      });
      tooltip += "\n";
    }

    if (details.topPages && details.topPages.length > 0) {
      tooltip += "📄 Popular Pages:\n";
      details.topPages.forEach((page) => {
        tooltip += `  • ${page.name}: ${page.count}\n`;
      });
    }

    return tooltip.trim();
  };

  return (
    <div className={styles.analyticsFullWidth}>
      <div className={styles.sectionHeader}>
        <h3>
          Analytics ({totalStats.visits} total visitors,{" "}
          {totalStats.uniqueVisitors} UVs, {totalStats.clicks} clicks)
        </h3>
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

        <select
          value={filters.showLocalIPs}
          onChange={(e) =>
            handleFilterChange("showLocalIPs", e.target.value === "true")
          }
          className={styles.filterSelect}
        >
          <option value={false}>Hide Local/Private IPs</option>
          <option value={true}>Show Local/Private IPs</option>
        </select>
      </div>

      {/* Daily Analytics Charts - Side by Side */}
      {dailyChartData.length > 0 && (
        <div className={styles.referralBreakdownSection}>
          <h4 className={styles.sectionSubtitle}>
            Daily Visitors & Clicks (Last {filters.days} days) - Excluding
            Local/Private IPs
          </h4>
          <div className={styles.chartsContainer}>
            {/* Visitors Chart */}
            <div className={styles.chartContainer}>
              <h5 className={styles.chartTitle}>Daily Visitors</h5>
              <div className={styles.chartWrapper}>
                {/* Y-axis label */}
                <div className={styles.yAxisLabel}>
                  <span>Visitors</span>
                </div>

                {/* Y-axis with scale */}
                <div className={styles.yAxis}>
                  {(() => {
                    const maxVisitors = Math.max(
                      ...dailyChartData.map((d) => d.total_visitors)
                    );
                    const scale = Math.ceil(maxVisitors / 5) * 5 || 1;
                    const ticks = [];
                    for (let i = 0; i <= 5; i++) {
                      ticks.push(Math.round((scale * i) / 5));
                    }
                    return ticks.reverse().map((tick, index) => (
                      <div key={index} className={styles.yAxisTick}>
                        {tick}
                      </div>
                    ));
                  })()}
                </div>

                {/* Chart area */}
                <div className={styles.chartArea}>
                  <div className={styles.chartGrid}>
                    {dailyChartData.map((day, index) => {
                      const maxVisitors = Math.max(
                        ...dailyChartData.map((d) => d.total_visitors)
                      );
                      const scale = Math.ceil(maxVisitors / 5) * 5 || 1;

                      return (
                        <div key={index} className={styles.chartBar}>
                          <div className={styles.chartBars}>
                            <div
                              className={styles.visitorBar}
                              style={{
                                height: `${Math.max(
                                  (day.total_visitors / scale) * 200,
                                  3
                                )}px`,
                                backgroundColor: "#007bff",
                              }}
                              onMouseEnter={(e) =>
                                handleMouseEnter(e, createVisitorTooltip(day))
                              }
                              onMouseLeave={handleMouseLeave}
                            ></div>
                          </div>
                          <div className={styles.chartValues}>
                            <div className={styles.visitorCount}>
                              {day.total_visitors}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis dates */}
                  <div className={styles.xAxis}>
                    {dailyChartData.map((day, index) => (
                      <div key={index} className={styles.xAxisLabel}>
                        {day.date}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* X-axis title */}
              <div className={styles.xAxisTitle}>
                <span>Date</span>
              </div>
            </div>

            {/* Clicks Chart */}
            <div className={styles.chartContainer}>
              <h5 className={styles.chartTitle}>Daily Clicks</h5>
              <div className={styles.chartWrapper}>
                {/* Y-axis label */}
                <div className={styles.yAxisLabel}>
                  <span>Clicks</span>
                </div>

                {/* Y-axis with scale */}
                <div className={styles.yAxis}>
                  {(() => {
                    const maxClicks = Math.max(
                      ...dailyChartData.map((d) => d.total_clicks)
                    );
                    const scale = Math.ceil(maxClicks / 5) * 5 || 1;
                    const ticks = [];
                    for (let i = 0; i <= 5; i++) {
                      ticks.push(Math.round((scale * i) / 5));
                    }
                    return ticks.reverse().map((tick, index) => (
                      <div key={index} className={styles.yAxisTick}>
                        {tick}
                      </div>
                    ));
                  })()}
                </div>

                {/* Chart area */}
                <div className={styles.chartArea}>
                  <div className={styles.chartGrid}>
                    {dailyChartData.map((day, index) => {
                      const maxClicks = Math.max(
                        ...dailyChartData.map((d) => d.total_clicks)
                      );
                      const scale = Math.ceil(maxClicks / 5) * 5 || 1;

                      return (
                        <div key={index} className={styles.chartBar}>
                          <div className={styles.chartBars}>
                            <div
                              className={styles.clickBar}
                              style={{
                                height: `${Math.max(
                                  (day.total_clicks / scale) * 200,
                                  3
                                )}px`,
                                backgroundColor: "#28a745",
                              }}
                              onMouseEnter={(e) =>
                                handleMouseEnter(e, createClickTooltip(day))
                              }
                              onMouseLeave={handleMouseLeave}
                            ></div>
                          </div>
                          <div className={styles.chartValues}>
                            <div className={styles.clickCount}>
                              {day.total_clicks}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis dates */}
                  <div className={styles.xAxis}>
                    {dailyChartData.map((day, index) => (
                      <div key={index} className={styles.xAxisLabel}>
                        {day.date}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* X-axis title */}
              <div className={styles.xAxisTitle}>
                <span>Date</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: "#007bff" }}
              ></div>
              <span>Visitors</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: "#28a745" }}
              ></div>
              <span>Clicks (deduplicated per hour)</span>
            </div>
          </div>
        </div>
      )}

      {/* Source Breakdown */}
      {referralBreakdown.length > 0 && (
        <div className={styles.referralBreakdownSection}>
          <h4 className={styles.sectionSubtitle}>
            Source Breakdown (Last {filters.days} days)
          </h4>
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
                {source.examples && source.examples.length > 0 && (
                  <div className={styles.referralExamples}>
                    <strong>Examples:</strong>
                    {source.examples.map((example, idx) => (
                      <div key={idx} className={styles.referralExample}>
                        {example}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Tooltip */}
      {tooltip.show && (
        <div
          className={styles.customTooltip}
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Complete Analytics Data Table */}
      <div className={styles.analyticsTableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Visit Timestamp</th>
              <th>IP Address</th>
              <th>Visit Frequency</th>
              <th>Device Platform & OS</th>
              <th>Page Path</th>
              <th>User ID</th>
              <th>User Agent</th>
              <th>Referrer</th>
              <th>Click Events</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnalyticsData.map((item) => (
              <tr key={item._id}>
                <td className={styles.timestampCell}>
                  {formatTimestamp(item.visit_timestamp)}
                </td>
                <td className={styles.ipCell}>
                  {item.ip_locations && item.ip_locations.length > 1 ? (
                    <div className={styles.multipleIPs}>
                      {item.ip_locations.map((ipData, index) => (
                        <div key={index} className={styles.ipEntry}>
                          <div className={styles.ipAddress}>{ipData.ip}</div>
                          <div className={styles.ipLocationText}>
                            {ipData.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div>{item.ip_address}</div>
                      {item.ip_location && (
                        <div className={styles.ipLocationText}>
                          {item.ip_location}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className={styles.visitFrequencyCell}>
                  {item.visit_frequency || "Unknown"}
                </td>
                <td className={styles.deviceInfoCell}>
                  {renderDeviceInfo(item.device_info)}
                </td>
                <td className={styles.pathCell}>{item.page_path}</td>
                <td className={styles.userCell}>
                  {item.user_id || "Anonymous"}
                </td>
                <td className={styles.userAgentCell}>
                  <div className={styles.userAgentText}>
                    {item.user_agent || "N/A"}
                  </div>
                </td>
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
        {filteredAnalyticsData.length === 0 && !loading && (
          <p className={styles.noData}>
            {analyticsData.length === 0
              ? "No analytics data available"
              : "No data available with current filters"}
          </p>
        )}
      </div>
    </div>
  );
}

export default AnalyticsSection;
