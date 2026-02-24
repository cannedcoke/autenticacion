const mysql = require("mysql2/promise");

// create connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database:"cookies",
    multipleStatements: true
});

// funcion recibe parametrps e inserta en la base de datos
async function addUser(email, pass){
    const conn = await pool.getConnection();

    const [result] = await conn.query(
        `INSERT INTO users (email,password_hash) VALUES (?,?)`,
        [email, pass]
    );

    conn.release();
    return result.affectedRows > 0;
}


// selecciona los datos y los ordena
async function getUserByMail(email) {
    const conn = await pool.getConnection();

    const [rows] = await conn.query(
        `SELECT id, email, password_hash, role FROM users WHERE email = ?`,
        [email] 
    );

    conn.release();
    return rows;
}

async function getAdminDash() {
    const conn = await pool.getConnection();

    const [rows] = await conn.query(
        `SELECT id, email, role, created_at FROM users`
    );

    conn.release();
    return rows;
}
async function getUserDash(user_id) {
    const conn = await pool.getConnection();

    const [rows] = await conn.query(
        `SELECT id, email, role, created_at FROM users WHERE id = ?`,
        [user_id]
    );

    conn.release();
    return rows;
}

async function createSession(sessionId, user_id, expiresAt) {
    const conn = await pool.getConnection();

    const [rows] = await conn.query(
        `INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)`,
        [sessionId, user_id, expiresAt]
    );

    conn.release();
    return rows;
}
async function getSession(sessionId) {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
        "SELECT s.session_id, s.expires_at, u.id as userId, u.email, u.role FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.session_id = ?",
        [sessionId]
    );
    conn.release();
    return rows[0];
}
async function delRow(id){
    const conn = await pool.getConnection();

    const [result] = await conn.query(
        `DELETE FROM users WHERE id = ?`,
        [id]
    );

    conn.release();
    return result.affectedRows > 0;
}


// permite que se pueda usar fuera del file
module.exports = {
    addUser,
    getUserByMail,
    getAdminDash,
    getUserDash,
    createSession,
    getSession,
    delRow
};
