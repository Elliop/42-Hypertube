const mysql = require('mysql2');

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "tiger",
    database: "hypertube",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const pool = connection.promise();

async function selectQuery(query, params) {
    try {
        const [result] = await pool.execute(query, params);
        return result;
    } catch (err) {
        
        return false;
    }
}

async function executeQuery(query, params) {
    try {
        const [result] = await pool.execute(query, params);
        return result.affectedRows;
    } catch (err) {
        return false;
    }
}

module.exports = {
    selectQuery,
    executeQuery
}