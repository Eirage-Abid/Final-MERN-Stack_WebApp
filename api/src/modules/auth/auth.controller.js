import User from "./auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signupSchema, loginSchema } from "./auth.zod.js";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../../config/env.js";

const createTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const signup = async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: parsed.error.errors });

    const { email, password } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 12);

    // Attempt to create the user and provide detailed error logging on failure
    let user;
    try {
      user = await User.create({ email, password: hash });
      console.log("User created:", user._id);
    } catch (createErr) {
      // Log detailed error info for Mongo/Mongoose create failures
      console.error("User.create error:", {
        name: createErr.name,
        message: createErr.message,
        code: createErr.code,
        keyValue: createErr.keyValue,
      });
      // Re-throw so outer catch handles the response
      throw createErr;
    }

    return res.status(201).json({ message: "Account created" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: parsed.error.errors });

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const { accessToken, refreshToken } = createTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/api/auth/refresh",
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });

    const payload = jwt.verify(token, JWT_REFRESH_SECRET);

    const accessToken = jwt.sign(
      { userId: payload.userId },
      JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};
