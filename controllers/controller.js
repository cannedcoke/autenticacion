const db = require("../models/db_queries");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
JWT_SECRET= "alyssa"
exports.signUp = async (req, res) => {
    const { email, pass } = req.body;
    try {
        const hashedPass = await bcrypt.hash(pass, 10);
        const ok = await db.addUser(email, hashedPass);
        res.json({ success: ok });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.logIn = async (req, res) => {
    const { email, pass, sessionType } = req.body;

    try {
        const rows = await db.getUserByMail(email);
        const user = rows[0]; // <-- it returns an array

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const match = await bcrypt.compare(pass, user.password_hash); // <-- correct column name

        if (!match) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (sessionType === "jwt") {
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );
            return res.json({ token });
        }

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};