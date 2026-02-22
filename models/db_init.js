const mysql = require("mysql2/promise");

// create connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true
});


// INITIAL SETUP 
(async () => {
    const conn = await pool.getConnection();

    await conn.query("CREATE DATABASE IF NOT EXISTS cookies");
    await conn.query("USE cookies");

    await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            created_at DATETIME DEFAULT NOW()
        );
    `);
    await conn.query(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(255),
            user_id INT,
            created_at DATETIME DEFAULT NOW(),
            expires_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    conn.release();
})();
