// Reddit Pixel utility functions
export const initRedditPixelWithUser = (user) => {
  const pixelId = import.meta.env.VITE_REDDIT_PIXEL_ID;

  if (typeof window !== "undefined" && window.rdt && pixelId) {
    // Re-initialize Reddit pixel with advanced matching when user logs in
    window.rdt("init", pixelId, {
      email: user?.email || undefined,
      // Add other matching parameters as available
      // phoneNumber: user?.phoneNumber || undefined,
      // externalId: user?.id || undefined,
    });
  }
};

export const trackRedditEvent = (eventName, eventData = {}) => {
  if (typeof window !== "undefined" && window.rdt) {
    window.rdt("track", eventName, eventData);
  }
};

// Generate unique conversion ID
export const generateConversionId = (eventType, userId = null) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const userPart = userId ? `_${userId}` : "";
  return `${eventType}_${timestamp}_${random}${userPart}`;
};

// Track specific conversion events with unique conversion IDs
export const trackRedditConversion = (conversionType, options = {}) => {
  const { value = null, userId = null, customData = {} } = options;

  // Generate unique conversion ID
  const conversionId = generateConversionId(
    conversionType.toLowerCase(),
    userId
  );

  const eventData = {
    conversion_id: conversionId,
    ...customData,
  };

  if (value !== null) {
    eventData.value = value;
  }

  console.log(
    `[Reddit Pixel] Tracking conversion: ${conversionType} with ID: ${conversionId}`
  );
  trackRedditEvent(conversionType, eventData);

  return conversionId;
};

// Common conversion events
export const redditEvents = {
  SIGNUP: "SignUp",
  PURCHASE: "Purchase",
  LEAD: "Lead",
  VIEW_CONTENT: "ViewContent",
  ADD_TO_CART: "AddToCart",
  INITIATE_CHECKOUT: "InitiateCheckout",
};
