const mysql = require('mysql2/promise');
require('dotenv').config();

// Connecting to MySQL database.
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.DATABASE_PORT
})

module.exports = pool;