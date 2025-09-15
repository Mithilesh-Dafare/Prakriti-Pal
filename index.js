require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // You will create this file next

const app = express();

// Connect to Database (you will write this logic)
connectDB(); 

// Middleware
app.use(cors());
app.use(express.json()); // To accept JSON data in the body
// ... after app.use(express.json());

// Define Routes
app.use('/api/herbs', require('./routes/herbs'));

// ... before the PORT declaration
// ... after app.use('/api/herbs', ...);

app.use('/api/prakriti', require('./routes/prakriti'));

app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/symptoms', require('./routes/symptoms'));

// ...

// A simple test route
app.get('/', (req, res) => {
    res.send('Ayurveda API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));