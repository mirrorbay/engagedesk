const geoip = require("geoip-lite");
const { isLocalOrPrivateIP } = require("./dashboardControllerHelpers/config");

class GeoLocationService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  getCachedLocation(ip) {
    const cached = this.cache.get(ip);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.location;
    }
    return null;
  }

  setCachedLocation(ip, location) {
    this.cache.set(ip, {
      location,
      timestamp: Date.now(),
    });
  }

  getIPLocation(ip) {
    // Clean and validate IP address
    const cleanIP = ip.trim();

    // Handle invalid or empty IPs
    if (!cleanIP || cleanIP === "unknown" || cleanIP === "") {
      return "Unknown";
    }

    // Handle local/private IPs
    if (isLocalOrPrivateIP(cleanIP)) {
      return "Local/Private";
    }

    // Check cache first
    const cached = this.getCachedLocation(cleanIP);
    if (cached) {
      return cached;
    }

    try {
      // Use geoip-lite for offline lookup
      const geo = geoip.lookup(cleanIP);

      if (geo) {
        let location = "";

        // Build location string from available data
        if (geo.city) {
          location += geo.city;
        }
        if (geo.region) {
          location += (location ? ", " : "") + geo.region;
        }
        if (geo.country) {
          location += (location ? ", " : "") + geo.country;
        }

        if (!location && geo.country) {
          location = geo.country;
        }

        if (!location) {
          location = "Unknown";
        }

        // Cache the result
        this.setCachedLocation(cleanIP, location);
        return location;
      } else {
        this.setCachedLocation(cleanIP, "Unknown");
        return "Unknown";
      }
    } catch (error) {
      this.setCachedLocation(cleanIP, "Unknown");
      return "Unknown";
    }
  }

  async getMultipleIPLocations(ips) {
    const uniqueIPs = [...new Set(ips)];
    const results = {};

    // Since geoip-lite is synchronous and offline, we can process all IPs quickly
    uniqueIPs.forEach((ip) => {
      results[ip] = this.getIPLocation(ip);
    });

    return results;
  }

  // Clear old cache entries
  clearExpiredCache() {
    const now = Date.now();
    for (const [ip, data] of this.cache.entries()) {
      if (now - data.timestamp >= this.cacheExpiry) {
        this.cache.delete(ip);
      }
    }
  }
}

// Create singleton instance
const geoLocationService = new GeoLocationService();

// Clear expired cache entries every hour
setInterval(() => {
  geoLocationService.clearExpiredCache();
}, 60 * 60 * 1000);

module.exports = geoLocationService;
