const AWS = require("aws-sdk");
const ClientInteraction = require("../models/ClientInteraction");
const { v4: uuidv4 } = require("uuid");

/**
 * Initialize AWS SES service
 */
const initSESService = () => {
  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_REGION
  ) {
    throw new Error("AWS credentials not configured");
  }

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  return new AWS.SES({ apiVersion: "2010-12-01" });
};

/**
 * Add tracking pixels and links to email content
 */
const addEmailTracking = (htmlContent, trackingId, clientId) => {
  if (!htmlContent) return htmlContent;

  // Add tracking pixel for opens
  const trackingPixel = `<img src="${process.env.BASE_URL}/api/email/track/open?trackingId=${trackingId}&clientId=${clientId}" width="1" height="1" style="display:none;" />`;

  // Add tracking to links
  let trackedContent = htmlContent;

  // Replace all links with tracking links
  trackedContent = trackedContent.replace(
    /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi,
    (match, attributes, url) => {
      const trackingUrl = `${
        process.env.BASE_URL
      }/api/email/track/click?trackingId=${trackingId}&clientId=${clientId}&url=${encodeURIComponent(
        url
      )}`;
      return `<a ${attributes.replace(
        /href=["'][^"']+["']/i,
        `href="${trackingUrl}"`
      )}>`;
    }
  );

  // Add tracking pixel at the end of the email
  trackedContent += trackingPixel;

  return trackedContent;
};

/**
 * Send email using AWS SES with tracking
 */
const sendEmail = async (options) => {
  const ses = initSESService();

  const {
    clientId,
    userId,
    to,
    subject,
    htmlContent,
    fromName,
    fromEmail = process.env.FROM_EMAIL,
  } = options;

  // Validate required fields
  if (!clientId || !userId || !to || !subject) {
    throw new Error("Missing required fields: clientId, userId, to, subject");
  }

  if (!htmlContent) {
    throw new Error("htmlContent is required");
  }

  if (!fromEmail) {
    throw new Error("FROM_EMAIL environment variable not configured");
  }

  // Generate tracking ID
  const trackingId = uuidv4();

  // Add tracking to HTML content
  const trackedHtmlContent = htmlContent
    ? addEmailTracking(htmlContent, trackingId, clientId)
    : null;

  // Create email parameters for AWS SES
  const params = {
    Source: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: trackedHtmlContent,
          Charset: "UTF-8",
        },
      },
    },
  };

  // Send the email using AWS SES
  const result = await ses.sendEmail(params).promise();

  // Create client interaction record
  const interaction = new ClientInteraction({
    clientId,
    userId,
    type: "email",
    subject,
    email: {
      subject,
      messageId: result.MessageId,
      fromEmail,
      fromName,
      trackingId,
      htmlContent: trackedHtmlContent,
      status: "sent",
      openedAt: [],
      clickedAt: [],
    },
  });

  await interaction.save();

  // Log successful email send
  const now = new Date();
  const dateTime = now.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const truncatedSubject =
    subject.length > 24 ? subject.substring(0, 24) + "..." : subject;
  const htmlLength = trackedHtmlContent ? trackedHtmlContent.length : 0;

  console.log(
    "\x1b[33m%s\x1b[0m",
    `[Email Service] ${dateTime} | to: ${to} | from: ${fromEmail} | fromname: ${fromName} | subject: ${truncatedSubject} | html length: ${htmlLength} | trackingId: ${trackingId}`
  );

  return {
    success: true,
    messageId: result.MessageId,
    trackingId,
    interactionId: interaction._id,
  };
};

module.exports = {
  sendEmail,
};
