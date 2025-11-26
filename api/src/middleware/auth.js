import jwt from "jsonwebtoken";

import { JWT_ACCESS_SECRET } from "../config/env.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];
  try {
  
    // Verify the access token using the access secret and attach payload to req.user
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = payload;
    console.log('Authorization Header:', req.headers.authorization);
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};