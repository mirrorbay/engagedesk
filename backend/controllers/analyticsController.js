const Analytics = require("../models/Analytics");
const { isLocalOrPrivateIP } = require("../utils/ipExclusion");
const { getIPLocation } = require("../utils/geolocation");

// Helper function to get client IP address
const getClientIP = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const firstIP = forwardedFor.split(",")[0].trim();
    if (firstIP && firstIP !== "unknown") return firstIP;
  }

  const realIP = req.headers["x-real-ip"];
  if (realIP && realIP.trim() !== "unknown") {
    return realIP.trim();
  }

  const remoteAddress =
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;

  if (remoteAddress && remoteAddress !== "unknown") {
    const cleanIP = remoteAddress.replace(/^::ffff:/, "");
    return cleanIP;
  }

  return "unknown";
};

// Helper function to parse device information from user agent
const parseDeviceInfo = (userAgent) => {
  if (!userAgent) {
    return {
      platform: "unknown",
      os: "unknown",
      browser: "unknown",
    };
  }

  const ua = userAgent.toLowerCase();
  let platform = "desktop";
  let os = "unknown";
  let browser = "unknown";

  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    platform = "mobile";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    platform = "tablet";
  }

  if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("mac os x") || ua.includes("macos")) {
    os = "macOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (
    ua.includes("iphone") ||
    ua.includes("ipad") ||
    ua.includes("ios")
  ) {
    os = "iOS";
  }

  if (ua.includes("chrome") && !ua.includes("edg")) {
    browser = "Chrome";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari";
  } else if (ua.includes("edg")) {
    browser = "Edge";
  } else if (ua.includes("opera")) {
    browser = "Opera";
  }

  return { platform, os, browser };
};

// Track page visit
const trackPageVisit = async (req, res) => {
  const { page_path, referrer } = req.body;

  const ip_address = getClientIP(req);
  const user_agent = req.headers["user-agent"] || "";
  const user_id = null;
  const device_info = parseDeviceInfo(user_agent);

  const analyticsData = new Analytics({
    ip_address,
    user_agent,
    page_path,
    referrer: referrer || "",
    visit_timestamp: new Date(),
    user_id,
    device_info,
    click_events: [],
  });

  await analyticsData.save();

  res.status(200).json({
    success: true,
    message: "Page visit tracked successfully",
  });
};

// Track click events
const trackClickEvents = async (req, res) => {
  const { page_path, click_events } = req.body;

  const ip_address = getClientIP(req);
  const user_id = null;

  const analyticsRecord = await Analytics.findOne({
    ip_address,
    page_path,
    user_id,
  }).sort({ visit_timestamp: -1 });

  if (analyticsRecord) {
    analyticsRecord.click_events.push(...click_events);
    await analyticsRecord.save();
  } else {
    const user_agent = req.headers["user-agent"] || "";
    const device_info = parseDeviceInfo(user_agent);
    const newRecord = new Analytics({
      ip_address,
      user_agent,
      page_path,
      referrer: "",
      visit_timestamp: new Date(),
      user_id,
      device_info,
      click_events,
    });
    await newRecord.save();
  }

  res.status(200).json({
    success: true,
    message: "Click events tracked successfully",
  });
};

// Get analytics data
const getAnalyticsData = async (req, res) => {
  const {
    start_date,
    end_date,
    page_path,
    days = 7,
    limit = 100,
    skip = 0,
    excludeLocalIPs = "false",
  } = req.query;

  const query = {};

  if (start_date || end_date) {
    query.visit_timestamp = {};
    if (start_date) {
      query.visit_timestamp.$gte = new Date(start_date);
    }
    if (end_date) {
      query.visit_timestamp.$lte = new Date(end_date);
    }
  } else {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    query.visit_timestamp = { $gte: startDate };
  }

  if (page_path) {
    query.page_path = page_path;
  }

  const rawData = await Analytics.find(query)
    .sort({ visit_timestamp: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .select("-user_agent")
    .lean();

  const processedData = rawData.map((record) => {
    const location = getIPLocation(record.ip_address);
    return {
      ...record,
      location,
    };
  });

  const filteredData =
    excludeLocalIPs === "true"
      ? processedData.filter((record) => !isLocalOrPrivateIP(record.ip_address))
      : processedData;

  const totalCount = await Analytics.countDocuments(query);

  res.status(200).json({
    success: true,
    data: filteredData,
    pagination: {
      total: totalCount,
      limit: parseInt(limit),
      skip: parseInt(skip),
      hasMore: totalCount > parseInt(skip) + parseInt(limit),
    },
  });
};

// Get analytics summary
const getAnalyticsSummary = async (req, res) => {
  const { days = 7 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const pipeline = [
    {
      $match: {
        visit_timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          page: "$page_path",
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$visit_timestamp",
            },
          },
        },
        visits: { $sum: 1 },
        unique_ips: { $addToSet: "$ip_address" },
        total_clicks: { $sum: { $size: "$click_events" } },
      },
    },
    {
      $project: {
        page: "$_id.page",
        date: "$_id.date",
        visits: 1,
        unique_visitors: { $size: "$unique_ips" },
        total_clicks: 1,
      },
    },
    {
      $sort: { date: -1, page: 1 },
    },
  ];

  const summaryData = await Analytics.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: summaryData,
    period: `${days} days`,
  });
};

// Get referral source breakdown
const getReferralSourceBreakdown = async (req, res) => {
  const { days = 7 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const pipeline = [
    {
      $match: {
        visit_timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$referrer", ""] },
            "Direct",
            {
              $cond: [
                { $regexMatch: { input: "$referrer", regex: /facebook/i } },
                "Facebook",
                {
                  $cond: [
                    { $regexMatch: { input: "$referrer", regex: /google/i } },
                    "Google",
                    {
                      $cond: [
                        {
                          $regexMatch: {
                            input: "$referrer",
                            regex: /reddit/i,
                          },
                        },
                        "Reddit",
                        "Other",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        count: { $sum: 1 },
        firstSeen: { $min: "$visit_timestamp" },
        lastSeen: { $max: "$visit_timestamp" },
        examples: { $addToSet: "$referrer" },
      },
    },
    {
      $project: {
        source: "$_id",
        count: 1,
        firstSeen: 1,
        lastSeen: 1,
        examples: { $slice: ["$examples", 3] },
      },
    },
    {
      $sort: { count: -1 },
    },
  ];

  const referralData = await Analytics.aggregate(pipeline);

  const totalVisits = referralData.reduce((sum, item) => sum + item.count, 0);
  const breakdown = referralData.map((item) => ({
    ...item,
    percentage:
      totalVisits > 0 ? Math.round((item.count / totalVisits) * 100) : 0,
  }));

  res.status(200).json({
    success: true,
    data: { breakdown },
    period: `${days} days`,
  });
};

// Get daily analytics chart data
const getDailyAnalyticsChart = async (req, res) => {
  const { days = 7 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const pipeline = [
    {
      $match: {
        visit_timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$visit_timestamp",
          },
        },
        total_visitors: { $sum: 1 },
        unique_ips: { $addToSet: "$ip_address" },
        total_clicks: { $sum: { $size: "$click_events" } },
      },
    },
    {
      $project: {
        date: "$_id",
        total_visitors: 1,
        unique_visitors: { $size: "$unique_ips" },
        total_clicks: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ];

  const chartData = await Analytics.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: chartData,
    period: `${days} days`,
  });
};

module.exports = {
  trackPageVisit,
  trackClickEvents,
  getAnalyticsData,
  getAnalyticsSummary,
  getReferralSourceBreakdown,
  getDailyAnalyticsChart,
};
