require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3000;
const { MONGO_URI, JWT_SECRET } = process.env;

if (!MONGO_URI || !JWT_SECRET) {
  console.error("❌  Missing MONGO_URI or JWT_SECRET in .env");
  process.exit(1);
}

// MONGODB CONNECTION
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅  MongoDB connected"))
  .catch((err) => {
    console.error("❌  MongoDB connection error:", err);
    process.exit(1);
  });

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// MONGOOSE MODELS
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // or email
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const chartSchema = new mongoose.Schema({
  labels: [String],
  data: [Number],
});
const Chart = mongoose.model("Chart", chartSchema);

// AUTH ROUTES
// POST /api/auth/signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password are required" });

    // 1. Prevent duplicate users
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(409).json({ error: "Username already taken" });

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    // 3. Save user
    const user = new User({ username, password: hashedPwd });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password are required" });

    // 1. Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // 3. Create JWT
    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "3d" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/auth/chart/:chartIdStart/:chartIdEnd", async (req, res) => {
  try {
    const { chartIdStart } = req.params;
    const { chartIdEnd } = req.params;

    if (!chartIdStart || !chartIdEnd)
      return res
        .status(400)
        .json({ error: "Chart ID start and end are required" });

    // Simulate fetching chart data
    const chartData = async () => {
      // Get all charts
      const charts = await Chart.find({}).sort({ _id: 1 });

      // Get chart by start and end ID
      const currentChart = charts.slice(
        parseInt(chartIdStart),
        parseInt(chartIdEnd) + 1
      );

      // Check if charts exist
      if (currentChart.length === 0)
        return res.status(404).json({ error: "Charts not found" });

      return currentChart;
    };

    // Fetch chart data
    const returnChartData = await chartData();

    res.json(returnChartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create another route to scrape uncc news (https://inside.charlotte.edu/news-features/) with cheerio
app.get("/api/auth/scrape-news", async (req, res) => {
  try {
    const url = "https://inside.charlotte.edu/news-features/";
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    console.log("Scraping news...");
    // Select the news items
    const newsItems = [];

    let id = 1;
    // Loop through each news item and extract the id, title, content, author, date, and url
    $("div.display-style-card div.card-item").each((index, element) => {
      const titleElement = $(element).find("div.card-item-title a");
      const title = titleElement.text().trim();
      let itemUrl = titleElement.attr("href");

      const content = $(element)
        .find("div.card-item-body div.excerpt p")
        .text()
        .trim();

      const date = $(element).find("div.postdate").text().trim() || "N/A"; // Example selector, adjust if needed

      newsItems.push({
        id: id++,
        title,
        content, // This is likely a snippet, full content would require visiting itemUrl
        date,
        url: itemUrl,
      });
    });

    res.json(newsItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// START SERVER
app.listen(port, () => {
  console.log(`🚀  API served at http://localhost:${port}`);
});
