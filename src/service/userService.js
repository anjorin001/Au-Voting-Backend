const {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../exceptions/baseError");
const { hashPassword, comparePassword } = require("../helper/passwordChecker");
const generateToken = require("../helper/tokenGenerator");
const User = require("../models/userModel");

class userService {
  async signup(data) {
    const { firstname, surname, email, password, matricNo } = data;

    const foundUser = await User.findOne({
      $or: [{ matricNo }, { email }],
    });

    if (foundUser && !foundUser.deleted) {
      throw new ConflictError("User already exists");
    }

    if (foundUser && foundUser.deleted) {
      foundUser.firstname = firstname;
      foundUser.surname = surname;
      foundUser.password = await hashPassword(password);
      foundUser.deleted = false;
      foundUser.deletedAt = null;
      await foundUser.save();

      const token = await generateToken(foundUser);
      return token;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      firstname,
      surname,
      email,
      matricNo,
      password: hashedPassword,
      role: "user",
    });

    const token = await generateToken(newUser);
    return token;
  }

  async login(data) {
    const { password, identifier } = data;

    const foundUser = await User.findOne({
      $or: [{ email: identifier }, { matricNo: identifier }],
      deleted: false, 
    });

    if (!foundUser) throw new UnauthorizedError("Invalid credentials");

    const verifyPassword = await comparePassword(password, foundUser.password);

    if (!verifyPassword) throw new UnauthorizedError("Invalid credentials");

    const token = await generateToken(foundUser);
    return token;
  }

  async getProfile({ userId }) {
    const user = await User.findById(userId).select(
      "-password -participatedElection -createdAt -__v"
    );

    if (!user) throw new NotFoundError(" user not found, invalid userId");

    return user;
  }

  async updateProfile({ userId, newData }) {
    // Load the current user to compare values
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("user not found, invalid userId");

    // Check if critical identity fields are being changed
    const shouldInvalidateVerification =
      (newData.firstname && newData.firstname !== user.firstname) ||
      (newData.surname && newData.surname !== user.surname) ||
      (newData.department && newData.department !== user.department); // department not yet in use

    // Build the update object
    const updatePayload = { ...newData };
    if (shouldInvalidateVerification) {
      updatePayload.verified = false;
    }

    // Perform one update
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).select("-password -participatedElection -__v");

    return updatedProfile;
  }

  async deleteProfile({ userId }) {
    const deletedProfile = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          Active: false,
          deleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    ).select("-password -participatedElection");

    if (!deletedProfile)
      throw new NotFoundError("user not found, invalid userId");

    return deletedProfile;
  }

  async verifyProfile() {
    //TODO Profile Verification logic here
  }

  async verifyStatus({ userId }) {
    const userVerifyStatus = await User.findById(userId, "verified");

    if (!userVerifyStatus)
      throw new NotFoundError("user not found, invalid userId");

    return userVerifyStatus;
  }

  async updatePassword({ userId, currentPassword, newPassword }) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid)
      throw new UnauthorizedError("Current password is incorrect");

    const hashedNewPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    return { message: "Password updated successfully" };
  }
}

module.exports = new userService();
