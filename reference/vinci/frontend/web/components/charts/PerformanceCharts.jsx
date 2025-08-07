import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import chartApi from "../../services/chartApi";
import styles from "../../styles/charts/PerformanceCharts.module.css";

const PerformanceCharts = () => {
  const [timeData, setTimeData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [timeViewPeriod, setTimeViewPeriod] = useState("week"); // week or month
  const [scoreViewPeriod, setScoreViewPeriod] = useState("week"); // week or month
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    try {
      setIsLoading(true);

      // Load data for both week and month to avoid multiple API calls
      const [weekData, monthData] = await Promise.all([
        chartApi.getPerformanceTrends(7),
        chartApi.getPerformanceTrends(30),
      ]);

      // Process the data for charts
      const processedWeekData = processChartData(weekData.trends);
      const processedMonthData = processChartData(monthData.trends);

      // Store both datasets with initial week view
      const chartData = {
        weekData: processedWeekData,
        monthData: processedMonthData,
        currentData: processedWeekData, // Current displayed data
      };

      setTimeData(chartData);
      setScoreData(chartData);

      setError("");
    } catch (err) {
      console.error("Error loading performance data:", err);
      setError("Failed to load performance data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const processChartData = (trends) => {
    // Get current date and add one day
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Filter trends to only include up to current day +1
    const filteredTrends = trends.filter((trend) => {
      const trendDate = new Date(trend.date);
      return trendDate <= tomorrow;
    });

    return filteredTrends.map((trend, index) => {
      // Parse date and ensure it's in user's local timezone
      const trendDate = new Date(trend.date + "T00:00:00"); // Ensure local timezone interpretation

      // Format as "Jul 15\n(Mon)" for better readability
      const month = trendDate.toLocaleDateString("en-US", {
        month: "short",
      });
      const day = trendDate.toLocaleDateString("en-US", {
        day: "numeric",
      });
      const dayOfWeek = trendDate.toLocaleDateString("en-US", {
        weekday: "short",
      });
      const formattedDay = `${month} ${day}\n(${dayOfWeek})`;

      return {
        date: trend.date,
        day: formattedDay,
        studyTime: trend.studyTime > 0 ? trend.studyTime : null, // Set to null if 0
        studyTimeBenchmark: trend.studyTimeBenchmark,
        score: trend.accuracy > 0 ? trend.accuracy : null, // Set to null if 0
        scoreBenchmark: trend.accuracyBenchmark,
        problems: trend.problems,
        sessions: trend.sessions,
      };
    });
  };

  const handleTimeViewToggle = (period) => {
    setTimeViewPeriod(period);
    if (timeData.weekData && timeData.monthData) {
      // Use stored data to avoid API call
      const newCurrentData =
        period === "week" ? timeData.weekData : timeData.monthData;
      setTimeData({
        ...timeData,
        currentData: newCurrentData,
      });
    }
  };

  const handleScoreViewToggle = (period) => {
    setScoreViewPeriod(period);
    if (scoreData.weekData && scoreData.monthData) {
      // Use stored data to avoid API call
      const newCurrentData =
        period === "week" ? scoreData.weekData : scoreData.monthData;
      setScoreData({
        ...scoreData,
        currentData: newCurrentData,
      });
    }
  };

  const CustomTooltip = ({ active, payload, label, type }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      // Don't show tooltip if the main data point is null (0 value)
      if (type === "time" && data.studyTime === null) {
        return null;
      }
      if (type === "score" && data.score === null) {
        return null;
      }

      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{data.day}</p>
          {type === "time" ? (
            <>
              <p className={styles.tooltipValue}>
                <span className={styles.userValue}>
                  Your Time: {data.studyTime} mins
                </span>
              </p>
              <p className={styles.tooltipValue}>
                <span className={styles.benchmarkValue}>
                  Community Average: {data.studyTimeBenchmark} mins
                </span>
              </p>
              {data.problems > 0 && (
                <p className={styles.tooltipExtra}>
                  {data.problems} problems solved
                </p>
              )}
            </>
          ) : (
            <>
              <p className={styles.tooltipValue}>
                <span className={styles.userValue}>
                  Your Score: {data.score}%
                </span>
              </p>
              <p className={styles.tooltipValue}>
                <span className={styles.benchmarkValue}>
                  Community Average: {data.scoreBenchmark}%
                </span>
              </p>
              {data.problems > 0 && (
                <p className={styles.tooltipExtra}>
                  {data.problems} problems attempted
                </p>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={styles.chartsContainer}>
        <div className={styles.loadingState}>
          <span>Loading performance data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.chartsContainer}>
        <div className={styles.errorState}>
          <span>{error}</span>
          <button onClick={loadPerformanceData} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartsContainer}>
      {/* Time Spent Chart */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <h4>Daily Study Time</h4>
          </div>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.toggleButton} ${
                timeViewPeriod === "week" ? styles.active : ""
              }`}
              onClick={() => handleTimeViewToggle("week")}
            >
              Past Week
            </button>
            <button
              className={`${styles.toggleButton} ${
                timeViewPeriod === "month" ? styles.active : ""
              }`}
              onClick={() => handleTimeViewToggle("month")}
            >
              Past Month
            </button>
          </div>
        </div>

        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={
                Array.isArray(timeData) ? timeData : timeData.currentData || []
              }
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#666" }}
                axisLine={{ stroke: "#ddd" }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#666" }}
                axisLine={{ stroke: "#ddd" }}
                label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
              />
              <Tooltip content={<CustomTooltip type="time" />} />
              <Legend
                wrapperStyle={{ fontSize: "0.9rem", paddingTop: "10px" }}
              />
              <Bar
                dataKey="studyTime"
                name="Your Study Time"
                fill="#007bff"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="studyTimeBenchmark"
                name="Community Average"
                fill="#94a3b8"
                stroke="#475569"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score Performance Chart */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <h4>Accuracy Performance</h4>
          </div>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.toggleButton} ${
                scoreViewPeriod === "week" ? styles.active : ""
              }`}
              onClick={() => handleScoreViewToggle("week")}
            >
              Past Week
            </button>
            <button
              className={`${styles.toggleButton} ${
                scoreViewPeriod === "month" ? styles.active : ""
              }`}
              onClick={() => handleScoreViewToggle("month")}
            >
              Past Month
            </button>
          </div>
        </div>

        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={
                Array.isArray(scoreData)
                  ? scoreData
                  : scoreData.currentData || []
              }
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#666" }}
                axisLine={{ stroke: "#ddd" }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#666" }}
                axisLine={{ stroke: "#ddd" }}
                label={{
                  value: "Score (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip type="score" />} />
              <Legend
                wrapperStyle={{ fontSize: "0.9rem", paddingTop: "10px" }}
              />
              <Bar
                dataKey="score"
                name="Your Score"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="scoreBenchmark"
                name="Community Average"
                fill="#a3d977"
                stroke="#4d7c0f"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
