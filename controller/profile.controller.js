import db from "../config/db.js";

// ======================================================
// GET PROFILE
// ======================================================

export const getProfile = (req, res) => {

    const email = req.user?.email;

    if (!email) {
        return res.status(401).json({
            success: false,
            message: "User email not found. Please login again"
        });
    }

    const sql = `
        SELECT profileUrl, name, email, mobile, gender
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: result[0]
        });
    });
};


export const updateProfile = (req, res) => {

    console.log("UPDATE PROFILE API CALLED");

    console.log("REQ.USER =", req.user);
    console.log("REQ.BODY =", req.body);

    const email = req.user?.email;

    if (!email) {
        return res.status(401).json({
            success: false,
            message: "User email not found. Please login again"
        });
    }

    const {
        profileUrl,
        name,
        mobile,
        gender
    } = req.body;

    const sql = `
        UPDATE users
        SET
            profileUrl = ?,
            name = ?,
            mobile = ?,
            gender = ?
        WHERE email = ?
    `;

    const values = [
        profileUrl || null,
        name,
        mobile,
        gender,
        email
    ];

    db.query(sql, values, (err, result) => {

        if (err) {

            console.log("UPDATE PROFILE ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to update profile",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });
    });
};