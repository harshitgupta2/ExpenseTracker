const jwt = require('jsonwebtoken');
const User = require('../models/User');
 


/**
 * Middleware to protect routes by verifying JWT tokens.
 *
 * @async
 * @function protect
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Express next middleware function.
 *
 * @description
 * - Checks for a JWT token in the Authorization header.
 * - Verifies the token using the server's secret key.
 * - Decodes the token and attaches the user information to `req.user`.
 * - Blocks access if token is missing or invalid.
 *
 * Example of expected Authorization header:
 *     Authorization: Bearer <token>
 *
 * @returns {Promise<void>}
 */

 exports.protect = async (req,res,next) =>{
    let token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message:"Not authorized,no token"});
    
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({message: "Not authorized, token failed",error: error.message})
    }
 }