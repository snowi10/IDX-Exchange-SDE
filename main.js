const pool = require('./conn_pool');
const express = require('express');
const cors = require('cors');
const properties = require('./properties-route')

const app = express();

// Cross-origin connection.
const corsOptions = {
    origin: 'https://localhost:3306',
    methods: 'GET'
};

app.use(cors(corsOptions));

// Health check to ensure the database connection is working correctly.
app.get('/api/health', async (req, res) => {
    try {

        // Simple query.
        await pool.query('SELECT 1');
        
        // Return status '200' for connected database.
        res.status(200).json({
            status: '200: Ok.',
            database: 'Connected.' 
        });
    }
    catch(error) {

        // Return status '500' for no connection.
        res.status(500).json({
            status: '500: Not connected.',
            error: error.message
        });
    }
});

// Local port.
app.listen(process.env.BACKEND_PORT, () => {
    console.log(`App is running on port ${process.env.BACKEND_PORT}`);
})

// Add properties route file.
app.use('/api/properties', properties);