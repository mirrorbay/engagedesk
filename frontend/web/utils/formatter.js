// Phone number formatting utility functions

/**
 * Format a phone number string to U.S. format (XXX) XXX-XXXX
 * @param {string} value - The input phone number string
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (value) => {
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX
  if (phoneNumber.length === 0) return "";
  if (phoneNumber.length <= 3) return phoneNumber;
  if (phoneNumber.length <= 6)
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
};

/**
 * Extract only digits from a formatted phone number
 * @param {string} formattedPhone - The formatted phone number string
 * @returns {string} - Phone number with only digits
 */
export const extractPhoneDigits = (formattedPhone) => {
  return formattedPhone.replace(/\D/g, "");
};

/**
 * Validate if a phone number has the correct length (10 digits for U.S.)
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid length
 */
export const isValidPhoneLength = (phoneNumber) => {
  const digits = extractPhoneDigits(phoneNumber);
  return digits.length === 10;
};
