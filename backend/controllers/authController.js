const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for a given user ID.
 *
 * @param {string|number} id - The unique user ID to encode in the token.
 * @returns {string} A signed JSON Web Token valid for 1 hour.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * Registers a new user.
 *
 * @async
 * @function registerUser
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 *
 * @description
 * - Validates input fields.
 * - Checks if the user already exists.
 * - Creates a new user and returns a JWT token.
 * - Handles errors and responds with proper HTTP status codes.
 *
 * @returns {Promise<void>}
 */

exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Check for missing field
  if (!fullName || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }

  try {
    // check if user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already registerd" });
    }
    //create user
    const user = await User.create({
      fullName,
      email,
      password,
    });
    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

/**
 * Logs in an existing user.
 *
 * @async
 * @function loginUser
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 *
 * @description
 * - Validates email and password fields.
 * - Checks if the user exists.
 * - Compares the provided password with the hashed password in DB.
 * - Returns JWT token if login is successful.
 * - Handles errors and returns proper status codes.
 *
 * @returns {Promise<void>}
 */
 exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // checking field is empty or not
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // checking user
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(400).json({ message: "Invalid credential" });
    }
    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error loging user", error: error.message });
  }
};

/**
 * Retrieves information about the currently authenticated user.
 *
 * @async
 * @function getUserInfo
 * @param {import("express").Request} req - Express request object (must contain `req.user` from auth middleware).
 * @param {import("express").Response} res - Express response object.
 *
 * @description
 * - Uses the authenticated user's ID from `req.user`.
 * - Fetches user details from the database excluding the password.
 * - Returns user info if found.
 * - Handles errors with proper status codes.
 *
 * @returns {Promise<void>}
 */
 exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            res.status(400).json({message: "user not found"})
        }
        res.status(200).json(user)
    } catch(error){
        res
      .status(500)
      .json({ message: "Error loging user", error: error.message });
    }


};
