/**
 * Centralized configuration for localhost and private IP exclusion
 * This serves as the single source of truth for all analytics filtering
 */

const LOCALHOST_EXCLUSION_CONFIG = {
  // IPv4 localhost
  ipv4Localhost: ["127.0.0.1"],

  // IPv6 localhost
  ipv6Localhost: ["::1"],

  // Private IP ranges (RFC 1918)
  privateIPRanges: {
    // Class A private range: 10.0.0.0/8
    classA: ["10."],

    // Class B private range: 172.16.0.0/12
    classB: [
      "172.16.",
      "172.17.",
      "172.18.",
      "172.19.",
      "172.20.",
      "172.21.",
      "172.22.",
      "172.23.",
      "172.24.",
      "172.25.",
      "172.26.",
      "172.27.",
      "172.28.",
      "172.29.",
      "172.30.",
      "172.31.",
    ],

    // Class C private range: 192.168.0.0/16
    classC: ["192.168."],

    // Link-local addresses: 169.254.0.0/16
    linkLocal: ["169.254."],
  },

  // Development/testing specific IPs (can be customized per environment)
  developmentIPs: [
    "24.4", // Custom development range mentioned in existing code
  ],

  // Special values to exclude
  specialValues: ["unknown", "", null, undefined],
};

/**
 * Check if an IP address is localhost or private
 * @param {string} ip - IP address to check
 * @returns {boolean} - True if IP should be excluded from analytics
 */
const isLocalOrPrivateIP = (ip) => {
  // Handle null, undefined, or empty values
  if (!ip || LOCALHOST_EXCLUSION_CONFIG.specialValues.includes(ip)) {
    return true;
  }

  const cleanIP = ip.trim();

  // Check IPv4 localhost
  if (LOCALHOST_EXCLUSION_CONFIG.ipv4Localhost.includes(cleanIP)) {
    return true;
  }

  // Check IPv6 localhost
  if (LOCALHOST_EXCLUSION_CONFIG.ipv6Localhost.includes(cleanIP)) {
    return true;
  }

  // Check private IP ranges
  const { privateIPRanges } = LOCALHOST_EXCLUSION_CONFIG;

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
  if (privateIPRanges.linkLocal.some((prefix) => cleanIP.startsWith(prefix))) {
    return true;
  }

  // Development/testing IPs
  if (
    LOCALHOST_EXCLUSION_CONFIG.developmentIPs.some((prefix) =>
      cleanIP.startsWith(prefix)
    )
  ) {
    return true;
  }

  return false;
};

/**
 * Filter an array of analytics records to exclude localhost/private IPs
 * @param {Array} records - Array of analytics records
 * @param {string} ipField - Field name containing IP address (default: 'ip_address')
 * @returns {Array} - Filtered array excluding localhost/private IPs
 */
const filterLocalHostRecords = (records, ipField = "ip_address") => {
  return records.filter((record) => {
    const ip = record[ipField];

    // Handle multiple IPs (comma-separated)
    if (typeof ip === "string" && ip.includes(",")) {
      const ips = ip.split(",").map((i) => i.trim());
      // Exclude if ALL IPs are local/private
      return !ips.every((singleIP) => isLocalOrPrivateIP(singleIP));
    }

    // Handle array of IPs
    if (Array.isArray(record.ip_addresses)) {
      // Exclude if ALL IPs are local/private
      return !record.ip_addresses.every((singleIP) =>
        isLocalOrPrivateIP(singleIP)
      );
    }

    // Handle single IP
    return !isLocalOrPrivateIP(ip);
  });
};

/**
 * Check if a referrer URL is from localhost or development environment
 * @param {string} referrer - Referrer URL to check
 * @returns {boolean} - True if referrer should be excluded
 */
const isLocalReferrer = (referrer) => {
  if (!referrer || typeof referrer !== "string") {
    return false;
  }

  const referrerLower = referrer.toLowerCase();

  // Check for localhost references
  if (
    referrerLower.includes("localhost") ||
    referrerLower.includes("127.0.0.1") ||
    referrerLower.includes("::1")
  ) {
    return true;
  }

  // Check for common development ports
  const devPorts = [":3000", ":3001", ":5000", ":5173", ":8000", ":8080"];
  if (devPorts.some((port) => referrerLower.includes(port))) {
    return true;
  }

  return false;
};

module.exports = {
  LOCALHOST_EXCLUSION_CONFIG,
  isLocalOrPrivateIP,
  filterLocalHostRecords,
  isLocalReferrer,
};
