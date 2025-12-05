const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

/**
 * Mongoose schema for the User model.
 *
 * @typedef {Object} User
 * @property {string} fullName - Full name of the user.
 * @property {string} email - User's email address (must be unique).
 * @property {string} password - Hashed user password.
 *
 * @description
 * This schema defines the structure of the User document in MongoDB,
 * including required fields and timestamps for creation & updates.
 */
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * Pre-save hook for hashing the user's password before storing it in the database.
 *
 * @param {Function} next - Mongoose middleware next function.
 * @this {import('mongoose').Document} The current user document being saved.
 *
 * @description
 * - Hashes the password only if it has been modified.
 * - Uses bcrypt with a salt round of 10.
 */
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compares a candidate password with the stored hashed password.
 *
 * @param {string} candidatePassword - The plain text password provided by the user.
 * @returns {Promise<boolean>} Returns true if passwords match, otherwise false.
 *
 * @this {import('mongoose').Document} The current user document.
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
