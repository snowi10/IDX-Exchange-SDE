const express = require('express');
const pool = require('./conn_pool');
const prop_router = express.Router();

prop_router.get('', async (req, res) => {
    try {

        // Handle invalid limit requests.
        if (parseInt(req.query.limit) <= 0 || parseInt(req.query.limit) >= 200) {
            throw new Error('Invalid limit.');
        }

        // Handle invalid offset requests.
        if (parseInt(req.query.offset) < 0) {
            throw new Error('Invalid offset.');
        }
        
        // Get filters from the request.
        const { conditionsQuery, params } = buildQuery(req.query);

        // Get limit and offset values from the request.
        // Default limit value is 20. Default offset value is 0.
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        // Query statement with conditions for total number of results.
        const countQuery = `SELECT COUNT(*) as total FROM rets.rets_property ${conditionsQuery}`;

        // Query statement with conditions for data results.
        const dataQuery = `SELECT * FROM rets.rets_property ${conditionsQuery} LIMIT ? OFFSET ?`;

        // Execute queries with parameters.
        const [count] = await pool.query(countQuery, [...params]);
        const [rows] = await pool.query(dataQuery, [...params, parseInt(limit), parseInt(offset)])

        // Get total number of results.
        const total = count[0].total;

        // Return status '200' for successful queries.
        res.status(200).json({
            total,
            "limit": limit,
            "offset": offset,
            "results": rows});
    }

    // Return status '400' for unsuccessful queries.
    catch (error) {
        res.status(400).json({
            status: '400: Bad request.',
            error: error.message
        });
    }
}); 

// Build query from filters. 
function buildQuery(filters) {
    let conditions = []; // Conditions for the query.
    let params = []; // Parameters for the conditions.

    // City filter.
    if (filters.city) {
        conditions.push('LOWER(TRIM(L_City)) = ?');
        params.push(filters.city.trim().toLowerCase());
    }

    // Zip code filter (must be a positive integer).
    if (filters.zip) {
        const zip = parseInt(filters.zip);

        if (isNaN(zip) || zip < 0) {
            throw new Error('Invalid zip code.');
        }

        conditions.push('L_Zip = ?');
        params.push(zip);
    }

    // Minimumm price filter (must be a positive integer).
    if (filters.minPrice) {
        const minPrice = parseInt(filters.minPrice);

        if (isNaN(minPrice) || minPrice < 0) {
            throw new Error('Invalid min price.');
        }

        conditions.push('L_SystemPrice >= ?');
        params.push(minPrice);
    }

    // Maximum price filter (must be a positive integer).
    if (filters.maxPrice) {
        const maxPrice = parseInt(filters.maxPrice);

        if (isNaN(maxPrice) || maxPrice < 0) {
            throw new Error('Invalid max price.');
        }
        
        conditions.push('L_SystemPrice <= ?');
        params.push(maxPrice);
    }

    // Number of beds filter (must be a positive integer).
    if (filters.beds) {
        const beds = parseInt(filters.beds);

        if (isNaN(beds) || beds < 0) {
            throw new Error('Invalid bed count.');
        }

        conditions.push('L_Keyword2 = ?');
        params.push(beds);
    }

    // Number of baths (must be a positive integer).
    if (filters.baths) {
        const baths = parseInt(filters.baths);

        if (isNaN(baths) || baths < 0) {
            throw new Error('Invalid bath count'); 
        }

        conditions.push('LM_Dec_3 = ?')
        params.push(baths);
    }

    // Connect conditions to form a query.
    const conditionsQuery = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    return { conditionsQuery, params };
}
   
module.exports = prop_router;