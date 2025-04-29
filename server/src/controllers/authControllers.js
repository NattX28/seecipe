const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { createToken } = require("../utils/jwt");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // check existing user
    const exisingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (exisingUser) {
      return res
        .status(409)
        .json({ error: "Email or username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashPassword,
        profilePicture: "profile_avatar.png",
      },
    });

    res.status(201).json({
      message: "User created success",
      data: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Something went wrong in signup controller" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    // user exist in database
    // give user token
    const token = createToken(user);

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true only on HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Logged in success",
      userId: user.id,
      username: user.username,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong in login controller" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out success" });
  } catch (err) {
    console.log(err);
    res
      .status(200)
      .json({ message: "Something went wrong in logout controller" });
  }
};

module.exports = { signup, login, logout };
