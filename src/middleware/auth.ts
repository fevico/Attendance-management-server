import { RequestHandler } from "express";
import jwt from "jsonwebtoken"
import authModel from "src/model/auth";

declare global{
    namespace Express {
        export interface Request {
            user: {
                id: string;
                name: string;
                email: string;
                role: "student" | "lecturer"
            }
        }
    }
}

export const mustAuth: RequestHandler = async (req, res, next) => {
    const { authorization } = req.headers;
   
    const token = authorization?.split("Bearer ")[1]; 
    if (!token) return res.status(403).json({ error: "Unauthorized request" });
  
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        name: string;
        userId: string;
      }
  
      // Check the role from the JWT payload
      const id = payload.userId;
  

      // Depending on the role, fetch user, doctor, or admin details
      const user = await authModel.findById({_id: id});
      if(!user) return res.status(403).json({error: "Unauthoried request! "});
      req.user = {
        id: user._id.toString(),
        name: user.name,  
        email: user.email,
        role: user.role as "student" | "lecturer"
      }
  
      next();
    } catch (error) {
      // Handle JWT verification errors
      return res.status(403).json({ error: "Invalid token" });
    }
  };