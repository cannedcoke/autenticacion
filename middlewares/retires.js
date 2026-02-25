const rateLimit = require("express-rate-limit");
// limita los reintentos
const loginLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 3,              // max 3 attempts
  message: { error: "Too many login attempts, please try again after 30 seconds." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter

