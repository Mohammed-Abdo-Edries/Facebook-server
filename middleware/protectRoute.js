// protectRoute.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Assuming you import User model

const protectRoute = async (req, res, next) => {
    try {
        // 1. Log the entire headers object
        console.log("Headers:", req.headers); 

        let token;
        // Check for the token in the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else {
            // 2. Log if token is missing
            console.log("No token in Authorization header"); 
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token" });
        }

        const decoded = jwt.verify(token, process.env.SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        // 3. Log any specific error during verification
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
};

export default protectRoute;