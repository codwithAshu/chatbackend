const jwt = require('jsonwebtoken')
const verifyToken=(req,res,next)=>{

    const authHeader=req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }
  const token =authHeader.split(" ")[1];
  console.log("✅ Decoded token:", token)
  ;
  try{
const decoded=jwt.verify(token, "ashu@123");
console.log("✅ Decoded token:", decoded);
req.user = decoded; // decoded me userId, email, etc. hote hain
    next();
  }catch(err){
return res.status(401).json({ msg: "Token is invalid or expired" });
  }

}
module.exports = verifyToken;