const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const recommendations = require('../data/recommendations'); // <-- Import the new data

// @route   GET /api/dashboard
// @desc    Get user data and recommendations
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        // Find the recommendations for the user's prakriti
        const userRecommendations = recommendations[user.prakriti] || null; // Handle if prakriti is not set

        res.json({
            user,
            recommendations: userRecommendations // <-- Add recommendations to the response
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;