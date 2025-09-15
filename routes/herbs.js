const express = require('express');
const router = express.Router();
const Herb = require('../models/Herb'); // Import the model

// @route   GET /api/herbs
// @desc    Get all herbs
router.get('/', async (req, res) => {
    try {
        const herbs = await Herb.find();
        res.json(herbs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/search', async (req, res) => {
    try {
        const herbName = req.query.name;
        if (!herbName) {
            return res.status(400).json({ msg: 'Herb name query is required.' });
        }

        // Find a herb whose name matches the query, case-insensitive
        const herb = await Herb.findOne({ 
            name: { $regex: new RegExp('^' + herbName + '$', 'i') } 
        });

        if (!herb) {
            return res.status(404).json({ msg: 'Herb not found in our database.' });
        }

        res.json(herb);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;