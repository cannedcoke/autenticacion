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



// permite que se pueda usar fuera del file
module.exports = {
    addUser,
    getUserByMail
};
