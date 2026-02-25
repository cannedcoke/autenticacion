const db = require("../models/db_queries");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
                { userId: user.id, email: user.email,role: user.role },
                JWT_SECRET,
                { expiresIn: "15m" }
            );
            return res.json({ token });
        }
        if (sessionType === "cookie") {
             const sessionId = crypto.randomUUID()
             const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
             await db.createSession(sessionId,user.id, expiresAt);

             res.cookie("session_id",sessionId, {
                httpOnly:true,
                secure: true, 
                sameSite: "strict",
                maxAge:60 * 60 * 1000
             })
             return res.json({ success: true });
        }


        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.displayDash = async (req, res) => {
    const userRole = req.user.role;

    if (userRole === "admin") {
        const users = await db.getAdminDash();
        return res.json({ role: "admin", users });
    }

    if (userRole === "user") {
        const user = await db.getUserDash(req.user.userId)
        return res.json({ role: "user", user });
    }

    return res.status(403).json({ error: "Access denied" });
};

exports.logout = async (req, res) => {
    const sessionId = req.cookies.session_id;

    if (sessionId) {
        await db.deleteSession(sessionId);
    }

    res.clearCookie("session_id");
    return res.json({ success: true });
};

exports.delRow = async (req, res) => {
    const userRole = req.user.role;
     const {id} = req.body;
    if (userRole === "admin") {
        const ok = await db.delRow(id);
        res.json({ success: ok });
    }else{
        res.json({alert:"you dont have the right credentials"})
    }
};