 const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { OpenAI } = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Simplified search history model
const searchHistorySchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  query: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

// AI Search endpoint
router.post('/search', requireAuth, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: "Query must be at least 2 characters" });
    }

    // Save query to history
    const history = new SearchHistory({
      userEmail: req.session.user.email,
      query
    });
    await history.save();

    // Call ChatGPT API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `You are a study assistant. Provide concise information about: ${query}. 
                  .`
      }],
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    res.json({ query, response });
  } catch (err) {
    console.error("AI search error:", {
      message: err.message,
      stack: err.stack,  // Get the full error stack
      requestBody: req.body // What was sent to the endpoint
    });
  }
});

// Get user's search history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const history = await SearchHistory.find({ userEmail: req.session.user.email })
                                     .sort({ createdAt: -1 })
                                     .limit(20)
                                     .select('query createdAt -_id');
    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ 
      message: "Failed to fetch history",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


module.exports = router;