const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || process.env.SESSION_SECRET || "vinci-jwt-secret";
const JWT_EXPIRES_IN = "365d"; // 1 year - effectively "forever"

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  req.user = decoded;
  next();
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  optionalAuth,
};
