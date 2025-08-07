const geoip = require("geoip-lite");
const { isLocalOrPrivateIP } = require("./ipExclusion");

/**
 * Get geolocation information for an IP address
 * @param {string} ip - IP address to lookup
 * @returns {object} - Geolocation information
 */
const getIPLocation = (ip) => {
  // Handle null, undefined, or empty values
  if (!ip || typeof ip !== "string") {
    return {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
      timezone: "Unknown",
      coordinates: null,
      isLocal: false,
    };
  }

  const cleanIP = ip.trim();

  // Check if it's a local/private IP
  if (isLocalOrPrivateIP(cleanIP)) {
    return {
      country: "Local",
      region: "Private Network",
      city: "Local",
      timezone: "Local",
      coordinates: null,
      isLocal: true,
    };
  }

  // Handle special cases
  if (cleanIP === "unknown" || cleanIP === "") {
    return {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
      timezone: "Unknown",
      coordinates: null,
      isLocal: false,
    };
  }

  // Lookup geolocation
  const geo = geoip.lookup(cleanIP);

  if (!geo) {
    return {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
      timezone: "Unknown",
      coordinates: null,
      isLocal: false,
    };
  }

  return {
    country: geo.country || "Unknown",
    region: geo.region || "Unknown",
    city: geo.city || "Unknown",
    timezone: geo.timezone || "Unknown",
    coordinates: geo.ll ? { lat: geo.ll[0], lng: geo.ll[1] } : null,
    isLocal: false,
  };
};

/**
 * Add location information to analytics records
 * @param {Array} records - Array of analytics records
 * @param {string} ipField - Field name containing IP address (default: 'ip_address')
 * @returns {Array} - Records with location information added
 */
const addLocationToRecords = (records, ipField = "ip_address") => {
  return records.map((record) => {
    const ip = record[ipField];
    const location = getIPLocation(ip);

    return {
      ...record,
      location,
    };
  });
};

/**
 * Get location statistics from analytics records
 * @param {Array} records - Array of analytics records with location data
 * @returns {object} - Location statistics
 */
const getLocationStats = (records) => {
  const countryStats = {};
  const regionStats = {};
  const cityStats = {};

  records.forEach((record) => {
    if (record.location) {
      const { country, region, city } = record.location;

      // Count by country
      countryStats[country] = (countryStats[country] || 0) + 1;

      // Count by region
      if (region !== "Unknown") {
        const regionKey = `${region}, ${country}`;
        regionStats[regionKey] = (regionStats[regionKey] || 0) + 1;
      }

      // Count by city
      if (city !== "Unknown") {
        const cityKey = `${city}, ${region}, ${country}`;
        cityStats[cityKey] = (cityStats[cityKey] || 0) + 1;
      }
    }
  });

  // Convert to sorted arrays
  const sortedCountries = Object.entries(countryStats)
    .sort(([, a], [, b]) => b - a)
    .map(([country, count]) => ({ country, count }));

  const sortedRegions = Object.entries(regionStats)
    .sort(([, a], [, b]) => b - a)
    .map(([region, count]) => ({ region, count }));

  const sortedCities = Object.entries(cityStats)
    .sort(([, a], [, b]) => b - a)
    .map(([city, count]) => ({ city, count }));

  return {
    countries: sortedCountries,
    regions: sortedRegions,
    cities: sortedCities,
    totalRecords: records.length,
  };
};

module.exports = {
  getIPLocation,
  addLocationToRecords,
  getLocationStats,
};
