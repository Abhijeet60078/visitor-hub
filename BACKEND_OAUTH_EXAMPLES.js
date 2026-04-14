/**
 * Backend OAuth API Examples
 * 
 * This file contains example implementations for Google and Facebook OAuth
 * verification endpoints using Node.js/Express
 */

// ============================================
// GOOGLE OAUTH EXAMPLE
// ============================================

/*
Using: google-auth-library

npm install google-auth-library

File: routes/auth.js
*/

const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /api/auth/google
 * Verify Google OAuth token and create JWT
 */
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Find or create user in database
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub,
        authProvider: "google",
      });
    }

    // Create JWT token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// ============================================
// FACEBOOK OAUTH EXAMPLE
// ============================================

/*
Using: axios for API calls

npm install axios

File: routes/auth.js (continued)
*/

const axios = require("axios");

/**
 * POST /api/auth/facebook
 * Verify Facebook OAuth token and create JWT
 */
router.post("/facebook", async (req, res) => {
  try {
    const { accessToken, userID } = req.body;

    if (!accessToken || !userID) {
      return res.status(400).json({ error: "Access token and user ID are required" });
    }

    // Verify Facebook token
    const facebookRes = await axios.get(`https://graph.facebook.com/v18.0/${userID}`, {
      params: {
        fields: "id,name,email,picture",
        access_token: accessToken,
      },
    });

    const facebookUser = facebookRes.data;

    // Verify token is valid by checking app
    const tokenRes = await axios.get(`https://graph.facebook.com/v18.0/debug_token`, {
      params: {
        input_token: accessToken,
        access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
      },
    });

    if (!tokenRes.data.data.is_valid) {
      return res.status(401).json({ error: "Invalid Facebook token" });
    }

    // Find or create user in database
    let user = await User.findOne({
      $or: [{ facebookId: facebookUser.id }, { email: facebookUser.email }],
    });

    if (!user) {
      user = await User.create({
        email: facebookUser.email,
        name: facebookUser.name,
        picture: facebookUser.picture?.data?.url,
        facebookId: facebookUser.id,
        authProvider: "facebook",
      });
    } else if (!user.facebookId) {
      // Link Facebook to existing user
      user.facebookId = facebookUser.id;
      await user.save();
    }

    // Create JWT token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Facebook OAuth error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

/*
File: middleware/auth.js
*/

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ============================================
// ENVIRONMENT VARIABLES (.env)
// ============================================

/*
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

JWT_SECRET=your_jwt_secret_key

DATABASE_URL=your_database_url
*/

// ============================================
// USER MODEL EXAMPLE
// ============================================

/*
File: models/User.js
*/

const userSchema = {
  email: { type: String, unique: true, required: true },
  name: String,
  picture: String,
  googleId: String,
  facebookId: String,
  authProvider: { type: String, enum: ["google", "facebook", "email"] },
  createdAt: { type: Date, default: Date.now },
};

// ============================================
// EXPRESS APP SETUP
// ============================================

/*
File: app.js
*/

// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/*", require("./middleware/auth")); // Protect routes with authentication
