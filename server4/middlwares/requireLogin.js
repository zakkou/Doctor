const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret";
exports.requireLogin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) { 
    
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      req.user = decoded; 
      next(); 
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" }); 
  }
};