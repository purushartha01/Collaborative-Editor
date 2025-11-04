import userModel from '../models/userModel.js';
import { compare, hash } from "bcryptjs";

const addUser = async (userData) => {
    return userModel.create(userData);
}

const getUserById = async (userId) => {
    return userModel.findById(userId);
}

const getUserByEmail = async (email) => {
    return userModel.findOne({ email });
}

const updateUserData = async (userId, userData) => {
    return userModel.findByIdAndUpdate(userId, userData, { new: true });
}

const matchPassword = async (providedPassword, existingPassword) => {
    return compare(providedPassword, existingPassword);
}

const hashPassword = async (pwd) => {
    const saltRounds = 10;
    return hash(pwd, saltRounds);
}

export { addUser, getUserByEmail, getUserById, updateUserData, matchPassword, hashPassword };