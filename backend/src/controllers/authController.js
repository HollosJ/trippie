import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import prisma from "../config/db.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Credentials missing!");

    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({
      user: { id: user.id, email: user.email },
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Credentials missing!");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.json({
      token: generateToken(user.id),
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
