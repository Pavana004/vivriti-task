const jwt = require("jsonwebtoken");


const validuser = (req,res,next)=>{
    const token = req.header("auth");
    if(!token) return res.status(401).send("UNAUTHORIZED USER");

        const data = jwt.verify(token,"userinfoSecretId")
        if(!data) return res.status(403).send("Token is not validation");
        req.userdata = data;
        next();

}
module.exports = validuser;