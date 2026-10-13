const express = require('express');
const pool = require('./conn_pool');
const prop_router = express.Router();

/**
 * Middleware logger.
 * @param {req} req - The http request.  
 * @param {res} res - The response from the http request.
 * @param {next} next - The next route for the middleware logger.
 */
const logger = (req, res, next) => {

    res.on('finish', () => {

        // Log method, url, status code, and duration of each request.
        const method = req.method;
        const url = req.originalUrl;
        const status = res.statusCode === 304 ? 200 : res.statusCode;
        const duration = Date.now();

        console.log(`Method: ${method}\nURL: ${url}\nStatus: ${status}\nDuration: ${duration} ms`);
    });

    next();
}

prop_router.use(logger);

// Return JSON of paginated list of properties with optional filters.
prop_router.get('', async (req, res) => {
    try {

        // Get limit and offset values from the request.
        let limit = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);

        // Handle invalid limit requests.
        if (limit <= 0 || limit >= 200) {
            throw new Error('Invalid limit.');
        }

        // Handle invalid offset requests.
        if (offset < 0) {
            throw new Error('Invalid offset.');
        }
        
        // Get filters from the request.
        const { conditionsQuery, params } = buildQuery(req.query);

        // Default limit value is 20. Default offset value is 0.
        limit = limit || 20;
        offset = offset || 0;

        // Query statement with conditions for total number of results.
        const countQuery = `SELECT COUNT(*) AS total FROM rets.rets_property ${conditionsQuery}`;

        // Query statement with conditions for data results.
        const dataQuery = `SELECT * FROM rets.rets_property ${conditionsQuery} LIMIT ? OFFSET ?`;

        // Execute queries with parameters.
        const [count] = await pool.query(countQuery, [...params]);
        const [rows] = await pool.query(dataQuery, [...params, parseInt(limit), parseInt(offset)]);

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

// Return JSON of open house information of a property from the ID.
prop_router.get('/:id/openhouse', async (req, res) => {
    try {
        const id = req.params.id;

        // Handle an invalid ID.  
        if (!isValidId(id)) {
            throw new Error('Invalid ID.');
        }
    
        // Find the property from the ID.
        const property = await findProperty(id);

        // Check if the property with the ID exists.
        if (property) {
            const id = req.params.id;

            // Query the openhouse information of the property, ordered by date and start time.
            const openhouseQuery = `SELECT * FROM rets.rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate ASC, OH_StartTime ASC`;
            const [openhouseData] = await pool.query(openhouseQuery, id);

            // Only use information from the 'all_data' column.
            let openhouseInfo = (openhouseData.map((info) => JSON.parse(info['all_data'])));

            // Return status '200' with open house data.
            res.status(200).json(openhouseInfo);
        }
        else {
            // Return status '404' with no property found.
            res.status(404).json({
                status: '404: Not found.',
                error: 'Unknown ID.'
            });
        }
    }
    catch (error) {
        // Return status '400' for unsuccessful queries.
        res.status(400).json({
            status: '400: Bad request.',
            error: error.message
        });
    }
})

// Return JSON of the property from the ID.
prop_router.get('/:id', async (req, res) => {
    try {

        const id = req.params.id;

        // Handle an invalid ID.  
        if (!isValidId(id)) {
            throw new Error('Invalid ID.');
        }

        // Find the property from the ID.
        const property = await findProperty(id);

        if (property) {
            // Return status '200' with the property data.
            res.status(200).json(property);
        }

        else {
            // Return status '404' with no property found.
            res.status(404).json({
                status: '404: Not found.',
                error: 'Unknown ID.'

            });
        }
    }
    // Return status '400' for unsuccessful queries.
    catch (error) {
        res.status(400).json({
            status: '400: Bad request.',
            error: error.message
        });
    }
});

/**
 * Check for a valid ID. 
 * @param {number} id - The requested ID.
 * @returns true for a valid ID or false for an invalid ID. 
 */
function isValidId(id) {

        // ID must contain all digits and be equal to or shorter than length 11.  
        if (/^\d+$/.test(id) === false || id.length > 11) {
            return false;
        }

        return true;
}

/**
 * Find a property in the database. 
 * @param {number} id - The ID of the property.
 * @returns an object consisting of the property information.
 */
async function findProperty(id) {

    // Query the property with the ID. 
    const propertyQuery = `SELECT * FROM rets.rets_property WHERE L_ListingID = ?`;
    const [propertyData] = await pool.query(propertyQuery, id);
    const property = propertyData[0];

    return property;
}

/**
 * Build query from filters.
 * @param {req.query} filters - The requested query with filtering information. 
 * @returns an object with the query and parameters for filtering.
 */
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