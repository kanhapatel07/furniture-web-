// getuserProfile
// updateprofile
// deleteUser
 
// GET USER PROFILE
import db from "../config/db.js";

export const getUserProfile = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        if (!result) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User profile fetched successfully",
            user: result
        });
    });
};


// UPDATE USER PROFILE
export const updateProfile = (req, res) => {

    const userId = req.user.id;

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const sql = `
        UPDATE users
        SET name = ?, email = ?
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully"
        });
    });
};


// DELETE USER
// export const deleteUser = (req, res) => {

//     const userId = req.user.id;

//     const sql = "DELETE FROM users WHERE id = ?";

//     db.query(sql, [userId], (err, result) => {

//         if (err) {
//             return res.status(500).json({
//                 message: "Database error",
//                 error: err.message
//             });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         return res.status(200).json({
//             message: "User deleted successfully"
//         });
//     });
// };

export const deleteUserById = (req, res) => {

    const Id = req.params.id;

    const sql = "DELETE FROM users WHERE id = ?";

    db.query(sql, [Id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully"
        });
    });
};


