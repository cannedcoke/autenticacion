const jwt = require("jsonwebtoken");
const db = require("../models/db_queries");
const { csrfProtection, csrfSecret } = require("../middlewares/csrf");

JWT_SECRET = "alyssa"

async function authenticate(req, res, next) {
  // est aseccion velida por jwt
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

  // esta seccion valida por medio de la cookie y crsf
  const sessionId = req.cookies?.session_id;
  if (sessionId) {
    
    const csrfToken = req.headers["x-csrf-token"];
    if (!csrfToken || !csrfProtection.verify(csrfSecret, csrfToken)) {
        return res.status(403).json({ error: "Invalid CSRF token" });
    }

    const session = await db.getSession(sessionId);
    if (!session){
       return res.status(401).json({ error: "Invalid session" });
    }
    if (new Date() > new Date(session.expires_at)) {
      return res.status(401).json({ error: "Session expired" });
    }
    req.user = { userId: session.userId, email: session.email, role: session.role };
    return next();
  }

  return res.status(401).json({ error: "No token provided" });
}

module.exports = authenticate;