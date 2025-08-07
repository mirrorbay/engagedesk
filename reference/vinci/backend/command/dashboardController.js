const VinciUser = require("../models/VinciUser");
const VinciSession = require("../models/VinciSession");
const VinciContact = require("../models/VinciContact");
const VinciAnalytics = require("../models/VinciAnalytics");
const VinciNewsletter = require("../models/VinciNewsletter");
const geoLocationService = require("./geoLocationService");
const {
  isLocalOrPrivateIP,
  filterLocalHostRecords,
  isLocalReferrer,
  LOCALHOST_EXCLUSION_CONFIG,
} = require("./dashboardControllerHelpers/config");

// Referral source analysis functions
const analyzeReferrer = (referrer) => {
  if (!referrer || referrer === "") {
    return "Direct/Unknown";
  }

  const referrerLower = referrer.toLowerCase();

  if (
    referrerLower.includes("reddit.com") ||
    referrerLower.includes("redd.it") ||
    referrerLower.includes("ads.reddit.com")
  ) {
    return "Reddit";
  }

  if (
    referrerLower.includes("facebook.com") ||
    referrerLower.includes("fb.com") ||
    referrerLower.includes("m.facebook.com") ||
    referrerLower.includes("l.facebook.com")
  ) {
    return "Facebook";
  }

  if (referrerLower.includes("google.com")) {
    return "Google";
  }

  if (referrerLower.includes("twitter.com") || referrerLower.includes("t.co")) {
    return "Twitter";
  }

  if (referrerLower.includes("instagram.com")) {
    return "Instagram";
  }

  if (referrerLower.includes("linkedin.com")) {
    return "LinkedIn";
  }

  if (referrerLower.includes("youtube.com")) {
    return "YouTube";
  }

  try {
    const url = new URL(referrer);
    return `Other: ${url.hostname}`;
  } catch {
    return `Other: ${referrer}`;
  }
};

const isOAuthReferrer = (referrer) => {
  if (!referrer) return false;

  const referrerLower = referrer.toLowerCase();
  return (
    referrerLower.includes("accounts.google.com") ||
    referrerLower.includes("oauth") ||
    referrerLower.includes("auth")
  );
};

const getInitialDiscoverySource = (referrers, registrationDate) => {
  const nonOAuthReferrers = referrers.filter(
    (ref) => !isOAuthReferrer(ref.referrer)
  );

  if (nonOAuthReferrers.length === 0) {
    return {
      primarySource: "Direct/No referrer data",
      sourceBreakdown: {},
      firstReferrer: null,
      allNonOAuthReferrers: [],
    };
  }

  const sortedReferrers = nonOAuthReferrers.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const sourceCount = {};
  const sourceFirstSeen = {};

  sortedReferrers.forEach((ref) => {
    if (!sourceCount[ref.source]) {
      sourceCount[ref.source] = 0;
      sourceFirstSeen[ref.source] = ref.timestamp;
    }
    sourceCount[ref.source]++;
  });

  const earliestSource = Object.keys(sourceFirstSeen).reduce(
    (earliest, source) => {
      if (
        !earliest ||
        new Date(sourceFirstSeen[source]) < new Date(sourceFirstSeen[earliest])
      ) {
        return source;
      }
      return earliest;
    },
    null
  );

  return {
    primarySource: earliestSource,
    sourceBreakdown: sourceCount,
    firstReferrer: sortedReferrers[0],
    allNonOAuthReferrers: sortedReferrers,
  };
};

const analyzeUserReferralSource = async (user) => {
  try {
    const registrationDate = user.createdAt;
    const startDate = new Date(
      registrationDate.getTime() - 24 * 60 * 60 * 1000
    );
    const endDate = new Date(registrationDate.getTime() + 24 * 60 * 60 * 1000);

    let analyticsData = [];

    if (user._id) {
      analyticsData = await VinciAnalytics.find({
        user_id: user._id.toString(),
        visit_timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ visit_timestamp: 1 });
    }

    if (analyticsData.length === 0) {
      analyticsData = await VinciAnalytics.find({
        visit_timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ visit_timestamp: 1 });
    }

    if (analyticsData.length === 0) {
      return {
        primarySource: "No analytics data",
        sourceBreakdown: {},
        firstReferrer: null,
        allReferrers: [],
      };
    }

    const referrers = analyticsData
      .filter((record) => record.referrer && record.referrer !== "")
      .map((record) => ({
        referrer: record.referrer,
        source: analyzeReferrer(record.referrer),
        timestamp: record.visit_timestamp,
        page: record.page_path,
      }));

    if (referrers.length === 0) {
      return {
        primarySource: "Direct/No referrer data",
        sourceBreakdown: {},
        firstReferrer: null,
        allReferrers: [],
      };
    }

    const discoveryAnalysis = getInitialDiscoverySource(
      referrers,
      user.createdAt
    );

    return {
      primarySource: discoveryAnalysis.primarySource,
      sourceBreakdown: discoveryAnalysis.sourceBreakdown,
      firstReferrer: discoveryAnalysis.firstReferrer,
      allReferrers: referrers,
    };
  } catch (error) {
    console.error("Error analyzing user referral source:", error);
    return {
      primarySource: "Analysis error",
      sourceBreakdown: {},
      firstReferrer: null,
      allReferrers: [],
    };
  }
};

// Get dashboard overview data
const getDashboardOverview = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await VinciUser.countDocuments({ is_active: true });
    const totalSessions = await VinciSession.countDocuments();
    const unreadContacts = await VinciContact.countDocuments({ status: "new" });
    const paidUsers = await VinciUser.countDocuments({
      is_active: true,
    });

    res.json({
      overview: {
        totalUsers,
        totalSessions,
        unreadContacts,
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user records with payment information
const getUserRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = { is_active: true };
    if (search) {
      searchQuery.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "student_info.first_name": { $regex: search, $options: "i" } },
        { "student_info.last_name": { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const users = await VinciUser.find(searchQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .select("-google_profile -__v"); // Exclude sensitive data

    const total = await VinciUser.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);

    // Get payment information and referral sources for each user
    const usersWithPayments = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();

        // Get session count
        const sessionCount = await VinciSession.countDocuments({
          user_id: user._id.toString(),
        });

        // Get referral source analysis
        const referralAnalysis = await analyzeUserReferralSource(user);

        userObj.sessionCount = sessionCount;
        userObj.lastActivity = user.last_login;
        userObj.referralSource = referralAnalysis;

        return userObj;
      })
    );

    res.json({
      users: usersWithPayments,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get user records error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get study session information
const getStudySessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const userId = req.query.userId;

    const skip = (page - 1) * limit;

    let query = {};
    if (userId) {
      query.user_id = userId;
    }

    const sessions = await VinciSession.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "first_name last_name email student_info");

    const total = await VinciSession.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Process sessions to add computed fields
    const processedSessions = sessions.map((session) => {
      const sessionObj = session.toObject();

      // Calculate session statistics
      let totalProblems = 0;
      let completedProblems = 0;
      let totalScore = 0;
      let totalTimeSpent = 0;

      session.pages.forEach((page) => {
        totalProblems += page.problems.length;
        page.problems.forEach((problem) => {
          if (problem.input_answer && problem.input_answer.length > 0) {
            completedProblems++;
            totalScore += problem.score || 0;
          }
        });

        if (page.submitted_at && page.presented_at) {
          totalTimeSpent += (page.submitted_at - page.presented_at) / 1000; // Convert to seconds
        }
      });

      sessionObj.stats = {
        totalProblems,
        completedProblems,
        averageScore:
          completedProblems > 0
            ? Math.round((totalScore / completedProblems) * 100) / 100
            : 0,
        totalTimeSpent: Math.round(totalTimeSpent),
        completionRate:
          totalProblems > 0
            ? Math.round((completedProblems / totalProblems) * 100)
            : 0,
      };

      return sessionObj;
    });

    res.json({
      sessions: processedSessions,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get study sessions error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get contact messages
const getContactMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const topic = req.query.topic;

    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (topic) {
      query.topic = topic;
    }

    const contacts = await VinciContact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "first_name last_name email");

    const total = await VinciContact.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get contact messages error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update contact message status
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response, respondedBy } = req.body;

    const contact = await VinciContact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    if (status) {
      contact.status = status;
    }

    if (response) {
      contact.response = response;
      contact.responded_at = new Date();
      contact.responded_by = respondedBy || "Admin";
    }

    await contact.save();

    res.json(contact);
  } catch (error) {
    console.error("Update contact status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get analytics data with geolocation and visit frequency
const getAnalyticsData = async (req, res) => {
  try {
    const { start_date, end_date, page_path, limit, skip = 0 } = req.query;

    const query = {};

    // Date range filter
    if (start_date || end_date) {
      query.visit_timestamp = {};
      if (start_date) {
        query.visit_timestamp.$gte = new Date(start_date);
      }
      if (end_date) {
        query.visit_timestamp.$lte = new Date(end_date);
      }
    }

    // Page filter
    if (page_path) {
      query.page_path = page_path;
    }

    // Build the query without limit by default, only apply limit if explicitly provided
    let analyticsQuery = VinciAnalytics.find(query)
      .sort({ visit_timestamp: -1 })
      .skip(parseInt(skip))
      .select("-user_agent"); // Exclude user agent for privacy

    // Only apply limit if explicitly provided
    if (limit) {
      analyticsQuery = analyticsQuery.limit(parseInt(limit));
    }

    const analyticsData = await analyticsQuery;
    const totalCount = await VinciAnalytics.countDocuments(query);

    // Calculate visit frequency for each IP
    const calculateVisitFrequency = async () => {
      const ipVisitMap = new Map();

      // Get all analytics data sorted by timestamp to calculate visit frequency
      const allData = await VinciAnalytics.find({})
        .sort({ visit_timestamp: 1 })
        .select("ip_address visit_timestamp _id");

      allData.forEach((item) => {
        const ips = item.ip_address.includes(",")
          ? item.ip_address.split(",").map((ip) => ip.trim())
          : [item.ip_address];

        ips.forEach((ip) => {
          if (!ipVisitMap.has(ip)) {
            ipVisitMap.set(ip, []);
          }

          const visits = ipVisitMap.get(ip);
          const visitTime = new Date(item.visit_timestamp);

          // Check if this visit is within an hour of the last visit (consider as same session)
          const lastVisit = visits[visits.length - 1];
          if (!lastVisit || visitTime - lastVisit.timestamp > 60 * 60 * 1000) {
            visits.push({
              timestamp: visitTime,
              recordId: item._id.toString(),
              visitNumber: visits.length + 1,
            });
          }
        });
      });

      return ipVisitMap;
    };

    const ipVisitFrequency = await calculateVisitFrequency();

    // Get all unique IP addresses for geolocation (handle comma-separated values)
    const allIPs = new Set();
    analyticsData.forEach((item) => {
      if (item.ip_address.includes(",")) {
        // Split comma-separated IPs and add each one
        item.ip_address.split(",").forEach((ip) => {
          const cleanIP = ip.trim();
          if (cleanIP) allIPs.add(cleanIP);
        });
      } else {
        allIPs.add(item.ip_address);
      }
    });

    // Get location data for all unique IPs
    const locationData = await geoLocationService.getMultipleIPLocations(
      Array.from(allIPs)
    );

    // Add location data and visit frequency to analytics records
    const analyticsWithLocationAndFrequency = analyticsData.map((item) => {
      const itemObj = item.toObject();

      // Handle multiple IP addresses - show all with their locations
      if (item.ip_address.includes(",")) {
        const ips = item.ip_address.split(",").map((ip) => ip.trim());
        itemObj.ip_addresses = ips;
        itemObj.ip_locations = ips.map((ip) => ({
          ip: ip,
          location: locationData[ip] || "Unknown",
        }));
        // Keep original for backward compatibility
        itemObj.ip_address = ips.join(", ");
        itemObj.ip_location = ips
          .map((ip) => `${ip}: ${locationData[ip] || "Unknown"}`)
          .join(" | ");
      } else {
        itemObj.ip_addresses = [item.ip_address];
        itemObj.ip_locations = [
          {
            ip: item.ip_address,
            location: locationData[item.ip_address] || "Unknown",
          },
        ];
        itemObj.ip_location = locationData[item.ip_address] || "Unknown";
      }

      // Calculate visit frequency for this record
      const ips = itemObj.ip_addresses || [item.ip_address];
      const frequencies = ips.map((ip) => {
        const visits = ipVisitFrequency.get(ip) || [];
        const visit = visits.find((v) => v.recordId === item._id.toString());
        return visit ? visit.visitNumber : 1;
      });

      if (frequencies.length === 1) {
        const freq = frequencies[0];
        if (freq === 1) itemObj.visit_frequency = "1st time";
        else if (freq === 2) itemObj.visit_frequency = "2nd time";
        else itemObj.visit_frequency = "3rd+ time";
      } else {
        // Multiple IPs - show range
        const minFreq = Math.min(...frequencies);
        const maxFreq = Math.max(...frequencies);
        if (minFreq === maxFreq) {
          if (minFreq === 1) itemObj.visit_frequency = "1st time";
          else if (minFreq === 2) itemObj.visit_frequency = "2nd time";
          else itemObj.visit_frequency = "3rd+ time";
        } else {
          const minLabel =
            minFreq === 1 ? "1st" : minFreq === 2 ? "2nd" : "3rd+";
          const maxLabel =
            maxFreq >= 3 ? "3rd+" : maxFreq === 2 ? "2nd" : "1st";
          itemObj.visit_frequency = `${minLabel}-${maxLabel} time`;
        }
      }

      return itemObj;
    });

    res.status(200).json({
      success: true,
      data: analyticsWithLocationAndFrequency,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: totalCount > parseInt(skip) + parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};

// Get analytics summary
const getAnalyticsSummary = async (req, res) => {
  try {
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

    const summaryData = await VinciAnalytics.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: summaryData,
      period: `${days} days`,
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics summary",
    });
  }
};

// Get referral source breakdown for analytics
const getReferralSourceBreakdown = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get all analytics data from the specified period (including those without referrers)
    // Also filter out records from localhost/private IPs
    const analyticsData = await VinciAnalytics.find({
      visit_timestamp: { $gte: startDate },
    }).select("referrer visit_timestamp ip_address");

    // Filter out localhost/private IP records and localhost referrers
    const filteredAnalyticsData = analyticsData.filter((record) => {
      // Skip if IP is localhost/private
      if (isLocalOrPrivateIP(record.ip_address)) {
        return false;
      }

      // Skip if referrer is from localhost/development environment (but only if referrer exists)
      if (record.referrer && isLocalReferrer(record.referrer)) {
        return false;
      }

      return true;
    });

    // Process referrers and group by source
    const sourceBreakdown = {};
    const sourceDetails = {};

    filteredAnalyticsData.forEach((record) => {
      const source = analyzeReferrer(record.referrer);

      // Skip OAuth referrers for initial discovery analysis (but only if referrer exists)
      if (record.referrer && isOAuthReferrer(record.referrer)) {
        return;
      }

      if (!sourceBreakdown[source]) {
        sourceBreakdown[source] = 0;
        sourceDetails[source] = {
          count: 0,
          firstSeen: record.visit_timestamp,
          lastSeen: record.visit_timestamp,
          examples: new Set(),
        };
      }

      sourceBreakdown[source]++;
      sourceDetails[source].count++;

      if (record.visit_timestamp < sourceDetails[source].firstSeen) {
        sourceDetails[source].firstSeen = record.visit_timestamp;
      }
      if (record.visit_timestamp > sourceDetails[source].lastSeen) {
        sourceDetails[source].lastSeen = record.visit_timestamp;
      }

      // Keep up to 3 example referrers per source (only if referrer exists)
      if (record.referrer && sourceDetails[source].examples.size < 3) {
        sourceDetails[source].examples.add(record.referrer);
      }
    });

    // Convert to array format and sort by count
    const sortedSources = Object.entries(sourceBreakdown)
      .map(([source, count]) => ({
        source,
        count,
        percentage:
          filteredAnalyticsData.length > 0
            ? Math.round((count / filteredAnalyticsData.length) * 100)
            : 0,
        firstSeen: sourceDetails[source].firstSeen,
        lastSeen: sourceDetails[source].lastSeen,
        examples: Array.from(sourceDetails[source].examples),
      }))
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      data: {
        breakdown: sortedSources,
        totalReferrals: filteredAnalyticsData.length,
        period: `${days} days`,
        periodStart: startDate,
        periodEnd: new Date(),
      },
    });
  } catch (error) {
    console.error("Error fetching referral source breakdown:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch referral source breakdown",
    });
  }
};

// Get daily analytics chart data with detailed information
const getDailyAnalyticsChart = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get detailed analytics data for each day
    const chartData = [];

    for (let i = 0; i < parseInt(days); i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(dayStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      // Get all records for this day
      const dayRecords = await VinciAnalytics.find({
        visit_timestamp: { $gte: dayStart, $lt: dayEnd },
      }).select(
        "ip_address referrer device_info page_path click_events visit_timestamp"
      );

      // Filter out local/private IPs
      const filteredRecords = dayRecords.filter(
        (record) => !isLocalOrPrivateIP(record.ip_address)
      );

      if (filteredRecords.length === 0) {
        chartData.push({
          date: dayStart.toISOString().split("T")[0],
          total_visitors: 0,
          total_clicks: 0,
          details: {
            locations: {},
            devices: {},
            referrers: {},
            pages: {},
            topLocations: [],
            topDevices: [],
            topReferrers: [],
            topPages: [],
          },
        });
        continue;
      }

      // Get unique IPs for visitor count
      const uniqueIPs = new Set(
        filteredRecords.map((record) => record.ip_address)
      );

      // Get location data for all unique IPs
      const locationData = await geoLocationService.getMultipleIPLocations(
        Array.from(uniqueIPs)
      );

      // Calculate clicks with deduplication
      const ipClickMap = new Map();
      filteredRecords.forEach((record) => {
        if (!ipClickMap.has(record.ip_address)) {
          ipClickMap.set(record.ip_address, new Set());
        }

        record.click_events.forEach((clickEvent) => {
          const hourKey = Math.floor(
            new Date(clickEvent.click_timestamp).getTime() / (1000 * 60 * 60)
          );
          ipClickMap.get(record.ip_address).add(hourKey);
        });
      });

      let totalUniqueClicks = 0;
      ipClickMap.forEach((hourSet) => {
        totalUniqueClicks += hourSet.size;
      });

      // Aggregate detailed information
      const locations = {};
      const devices = {};
      const referrers = {};
      const pages = {};

      filteredRecords.forEach((record) => {
        // Location data
        const location = locationData[record.ip_address] || "Unknown";
        locations[location] = (locations[location] || 0) + 1;

        // Device data
        if (record.device_info) {
          const deviceKey = `${record.device_info.platform || "Unknown"} - ${
            record.device_info.os || "Unknown"
          }`;
          devices[deviceKey] = (devices[deviceKey] || 0) + 1;
        }

        // Referrer data
        const referrer = analyzeReferrer(record.referrer);
        referrers[referrer] = (referrers[referrer] || 0) + 1;

        // Page data
        const page = record.page_path || "/";
        pages[page] = (pages[page] || 0) + 1;
      });

      // Get top items for each category
      const getTopItems = (obj, limit = 3) => {
        return Object.entries(obj)
          .sort(([, a], [, b]) => b - a)
          .slice(0, limit)
          .map(([key, count]) => ({ name: key, count }));
      };

      chartData.push({
        date: dayStart.toISOString().split("T")[0],
        total_visitors: uniqueIPs.size,
        total_clicks: totalUniqueClicks,
        details: {
          locations,
          devices,
          referrers,
          pages,
          topLocations: getTopItems(locations),
          topDevices: getTopItems(devices),
          topReferrers: getTopItems(referrers),
          topPages: getTopItems(pages),
        },
      });
    }

    res.status(200).json({
      success: true,
      data: chartData,
      period: `${days} days`,
    });
  } catch (error) {
    console.error("Error fetching daily analytics chart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily analytics chart",
    });
  }
};

// Get newsletter subscribers
const getNewsletterSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const search = req.query.search || "";
    const status = req.query.status || "active";

    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = { status };
    if (search) {
      searchQuery.email = { $regex: search, $options: "i" };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const subscribers = await VinciNewsletter.find(searchQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("user_id", "first_name last_name email student_info")
      .select("-__v");

    const total = await VinciNewsletter.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);

    // Get summary statistics
    const totalActive = await VinciNewsletter.countDocuments({
      status: "active",
    });
    const totalUnsubscribed = await VinciNewsletter.countDocuments({
      status: "unsubscribed",
    });

    res.json({
      subscribers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      summary: {
        totalActive,
        totalUnsubscribed,
        total: totalActive + totalUnsubscribed,
      },
    });
  } catch (error) {
    console.error("Get newsletter subscribers error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get localhost exclusion configuration
const getLocalhostExclusionConfig = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        config: LOCALHOST_EXCLUSION_CONFIG,
        isLocalOrPrivateIP: isLocalOrPrivateIP.toString(), // Send function as string for reference
      },
    });
  } catch (error) {
    console.error("Error fetching localhost exclusion config:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch localhost exclusion config",
    });
  }
};

module.exports = {
  getDashboardOverview,
  getUserRecords,
  getStudySessions,
  getContactMessages,
  updateContactStatus,
  getAnalyticsData,
  getAnalyticsSummary,
  getReferralSourceBreakdown,
  getDailyAnalyticsChart,
  getNewsletterSubscribers,
  getLocalhostExclusionConfig,
};
