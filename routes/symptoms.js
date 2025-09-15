const express = require('express');
const router = express.Router();
const symptomData = require('../data/symptomData');
const Herb = require('../models/Herb');

// @route   GET /api/symptoms
// @desc    Get all available symptoms
router.get('/', (req, res) => {
    res.json(symptomData);
});

// @route   POST /api/symptoms/analyze
// @desc    Analyze selected symptoms and recommend herbs
router.post('/analyze', async (req, res) => {
    const { selectedSymptoms } = req.body; // Expects an array of symptom names

    if (!selectedSymptoms || selectedSymptoms.length === 0) {
        return res.status(400).json({ msg: 'Please select at least one symptom.' });
    }

    // Calculate dosha scores based on selected symptoms
    const scores = { Vata: 0, Pitta: 0, Kapha: 0 };
    selectedSymptoms.forEach(symptomName => {
        const symptomInfo = symptomData.find(s => s.name === symptomName);
        if (symptomInfo) {
            scores[symptomInfo.dosha]++;
        }
    }); 

    // Determine the most likely imbalanced dosha
    const imbalancedDosha = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    try {
        // Find herbs that pacify the imbalanced dosha
        const recommendedHerbs = await Herb.find({ pacifies: imbalancedDosha });

        res.json({
            imbalancedDosha,
            recommendedHerbs
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;