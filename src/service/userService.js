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
    const foundUser = await User.findOne({ $or: [{ matricNo }, { email }] });

    if (foundUser) throw new ConflictError("user already exist");

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
    });

    if (!foundUser) throw new UnauthorizedError("Invalid credidential");

    const verifyPassword = await comparePassword(password, foundUser);

    if (!verifyPassword) throw new UnauthorizedError("Invalid credidential");

    const token = await generateToken(foundUser);
    return token;
  }

  async getProfile({ userId }) {
    const user = await User.findById(userId).select(
      "-password -participatedElection -createdAt"
    );

    if (!user) throw new NotFoundError(" user not found, invalid userId");

    return user;
  }

  async updateProfile({ userId, newData }) {
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { $set: newData },
      { new: true, runValidators: true }
    ).select("-password -participatedElection");

    if (!updatedProfile)
      throw new NotFoundError("user not found, invalid userId");

    return updatedProfile;
  }

  async deleteProfile({ userId }) {
    const deletedProfile = await User.findByIdAndDelete(userId).select(
      "-password -participatedElection"
    );

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

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid)
      throw new UnauthorizedError("Current password is incorrect");

    const hashedNewPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    return { message: "Password updated successfully" };
  }
}

module.exports = new userService();
