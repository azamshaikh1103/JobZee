import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain atleast 3 characters !"],
    maxLength: [30, "Name cannot exceed 30 characters !"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    validate: [validator.isEmail, "Please enter your valid email address"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your phone number"],
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minLength: [8, "Enter must be atleast of 8 characters"],
    maxLength: [32, "Characters must not exceeds 32 Characters"],
  },
  role: {
    type: String,
    required: [true, "Please enter your role"],
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hashing Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Comparing Password
userSchema.methods.comparePassword = async function (enteredPAssword) {
  return await bcrypt.compare(enteredPAssword, this.password);
};

//Generating JWT Token for AUTH
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
