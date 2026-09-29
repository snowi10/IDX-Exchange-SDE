const pool = require('./conn_pool');
const express = require('express');
const cors = require('cors');
const app = express();

// Cross-origin connection.
const corsOptions = {
    origin: 'https://localhost:3306',
    methods: 'GET'
};

app.use(cors(corsOptions));

// Health check to ensure the database
// connection is working correctly.
app.get('/api/health', async (req, res) => {
    try {

        await pool.query('SELECT 1');
        
        res.status(200).json({
            status: 'ok',
            database: 'connected' 
        });
    }
    catch(error) {
        res.status(500).json({
            status: 'not ready',
            error: error.message
        });
    }
});

// Local port.
app.listen(process.env.BACKEND_PORT, () => {
    console.log(`App is running on port ${process.env.BACKEND_PORT}`);
})