const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // <-- Import auth middleware
const User = require('../models/User'); // <-- Import User model

// Store questions and descriptions here for simplicity
const questions = [
    { question: "Body Frame", options: { vata: "Thin, light frame", pitta: "Medium build", kapha: "Heavy, large build" } },
    { question: "Skin Type", options: { vata: "Dry, rough, thin", pitta: "Oily, sensitive, reddish", kapha: "Thick, oily, cool" } },
    { question: "Hair", options: { vata: "Dry, thin, frizzy", pitta: "Fine, oily, premature graying", kapha: "Thick, wavy, lustrous" } },
    { question: "Appetite", options: { vata: "Irregular, variable", pitta: "Strong, sharp, gets irritable if hungry", kapha: "Slow but steady, enjoys food" } },
    { question: "Digestion", options: { vata: "Variable, gassy, bloating", pitta: "Fast, can eat almost anything", kapha: "Slow, heavy feeling after meals" } },
    { question: "Energy Levels", options: { vata: "Comes in bursts, variable", pitta: "High, focused, competitive", kapha: "Steady, sustained, slow to start" } },
    { question: "Sleep Pattern", options: { vata: "Light, interrupted, prone to insomnia", pitta: "Sound, moderate duration", kapha: "Deep, long, heavy" } },
    { question: "Temperament", options: { vata: "Enthusiastic, lively, imaginative", pitta: "Intelligent, sharp, goal-oriented", kapha: "Calm, steady, loving" } },
    { question: "Response to Stress", options: { vata: "Becomes anxious, worried, fearful", pitta: "Becomes irritable, angry, impatient", kapha: "Becomes withdrawn, quiet, slow to react" } },
    { question: "Memory", options: { vata: "Quick to grasp, quick to forget", pitta: "Sharp, clear, focused", kapha: "Slow to learn, but has long-term retention" } }
];

const descriptions = {
    'Vata': 'You are energetic, creative, and lively. Your constitution is governed by the elements of Air and Ether. To stay balanced, focus on warm, nourishing foods and a regular routine.',
    'Pitta': 'You are intelligent, focused, and driven. Your constitution is governed by the elements of Fire and Water. To stay balanced, favor cooling foods and avoid excessive heat and competition.',
    'Kapha': 'You are calm, loving, and steady. Your constitution is governed by the elements of Earth and Water. To stay balanced, incorporate regular exercise and stimulating, light foods.',
    'Vata-Pitta': 'You have a combination of Vata and Pitta qualities. You are both creative and driven. Balance is key; pay attention to which dosha is more prominent at any given time.',
    'Vata-Kapha': 'You have a mix of Vata and Kapha traits, making you both creative and steady. You might find a conflict between the desire for movement (Vata) and the preference for stability (Kapha).',
    'Pitta-Kapha': 'You are a blend of fiery Pitta and earthy Kapha, making you both driven and stable. You likely have a strong build and a determined personality.',
    'Tridoshic': 'All three doshas are balanced in your constitution, which is rare and considered very healthy. Your key to wellness is to maintain this balance by observing seasonal changes and your body\'s needs.'
};


// @route   GET /api/prakriti/questions
// @desc    Get all quiz questions
router.get('/questions', (req, res) => {
    res.json(questions);
});

// @route   POST /api/prakriti/calculate
// @desc    Calculate and save Prakriti for the logged-in user
router.post('/calculate', auth, async (req, res) => { // <-- It's an async function now
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ msg: 'Invalid answers format' });
    }
    
    // --- Your existing calculation logic remains the same ---
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    answers.forEach(answer => {
        if (scores.hasOwnProperty(answer)) {
            scores[answer]++;
        }
    });

    const sortedDoshas = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    let result = '';
    const maxScore = scores[sortedDoshas[0]];

    if (scores[sortedDoshas[1]] === maxScore) {
        if (scores[sortedDoshas[2]] === maxScore) {
            result = 'Tridoshic';
        } else {
            // Correctly format bi-doshic types like 'Vata-Pitta'
            const dosha1 = sortedDoshas[0].charAt(0).toUpperCase() + sortedDoshas[0].slice(1);
            const dosha2 = sortedDoshas[1].charAt(0).toUpperCase() + sortedDoshas[1].slice(1);
            result = `${dosha1}-${dosha2}`;
        }
    } else {
        result = sortedDoshas[0].charAt(0).toUpperCase() + sortedDoshas[0].slice(1);
    }
    // --- End of calculation logic ---

    try {
        // **This is the new, important part**
        // It finds the user by the ID from the token and updates their prakriti
        await User.findByIdAndUpdate(req.user.id, { prakriti: result });

        // Send the result back to the frontend
        res.json({
            prakriti: result,
            description: descriptions[result] || 'Description not found.',
            scores: scores
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;