import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      req.userId = decoded.userId; // attach userId for use in route
      next();
    });
  } catch (error) {
    console.error("requireAuth error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default requireAuth;
