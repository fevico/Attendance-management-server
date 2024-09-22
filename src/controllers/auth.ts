import { RequestHandler } from "express";
import authModel from "src/model/auth";
import jwt from 'jsonwebtoken'

const generateMatricNumber = async () => {
  const currentYear = new Date().getFullYear();
  const count = await authModel.countDocuments({ matricNumber: new RegExp(`^${currentYear}/`) });
  const serialNumber = (count + 1).toString().padStart(4, '0');

  // Custom prefix and suffix
  const prefix = "MAT"; // Example: "MAT" for Matriculation
  const suffix = "A"; // Example: "A" for first batch

  // Combine everything into the final matric number
  return `${prefix}-${currentYear}/${serialNumber}-${suffix}`;
};


export const create: RequestHandler = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if the user already exists
    const user = await authModel.findOne({ email });
    if (user) return res.status(400).send("User already exists");

    // Generate matric number
    const regNumber = await generateMatricNumber();

    // Create the user
    const createUser = new authModel({ email, password, name, regNumber, role });
    await createUser.save();

    return res.json({name: createUser.name, regNumber: createUser.regNumber, email: createUser.email, role: createUser.role});
  } catch (error) {
    return res.status(500).send("Server error");
  }
};


export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password, regNumber } = req.body;

    // Find the user by either regNumber or email
    const user = await authModel.findOne({email});

    // If no user is found, return an error response
    if (!user) {
      return res.status(401).send("invalid email address");
    }

    // Check if the provided password is correct
    const isPasswordCorrect = await user.compare(password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Password incorrect");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET as string
    );

    // Send the token in the response
    return res.json({ token });
  } catch (error) {
    // Handle any other errors
    console.error("Login error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
