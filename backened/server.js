 const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Add OpenAI requirement


const session = require("express-session");
const MongoStore = require("connect-mongo");

// Add OpenAI to required environment variables
const requiredEnvVars = ['MONGO_URI', 'GOOGLE_CLIENT_ID', 'EMAIL_USER', 'EMAIL_PASS', 'SESSION_SECRET', 'OPENAI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize OpenAI


const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' })); // Increase limit for AI responses

// Session configuration (keep your existing session setup)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  })
);

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Add specific rate limiter for AI routes
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour per user
  keyGenerator: (req) => {
    return req.session.user?.email || req.ip; // Rate limit by user email or IP
  },
  message: 'Too many AI requests, please try again later'
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
  
  // Initialize routes
  require("./login")(app, authLimiter);
  
  // Subjects router
  const subjectsRouter = require('./subjects');
  app.use('/api/subjects', subjectsRouter);
  
  // AI Search router (new)
  const aiSearchRouter = require('./dou');
  app.use('/api/ai', aiLimiter, aiSearchRouter); // Apply AI-specific rate limiting
});

mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});