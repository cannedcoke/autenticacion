const jwt = require("jsonwebtoken");
const db = require("../models/db_queries");
JWT_SECRET = "alyssa"

async function authenticate(req, res, next) {
  // JWT path
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  }

  // Cookie/session path
  const sessionId = req.cookies?.session_id;
  if (sessionId) {
    const session = await db.getSession(sessionId);
    if (!session) return res.status(401).json({ error: "Invalid session" });
    if (new Date() > new Date(session.expires_at)) {
      return res.status(401).json({ error: "Session expired" });
    }
    req.user = { userId: session.userId, email: session.email, role: session.role };
    return next();
  }

  return res.status(401).json({ error: "No token provided" });
}

module.exports = authenticate;