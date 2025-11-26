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
    const user = await User.create({ email, password: hash });

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: "none",
      // Use root path so the cookie is accessible to refresh route and can be cleared from client
      path: "/",
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken; //Get refresh token from the cookie
    if (!token) return res.status(401).json({ error: "No refresh token" });

    console.log("verifying refresh token")
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);

    if(!payload){
      console.error("Invalid refresh token")
      return res.status(401).json({error: "Invalid refersh token"})
    }

    const accessToken = jwt.sign(
      { userId: payload.userId },
      JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );


    console.log("Refresh successful, new access token generated");


    return res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};
