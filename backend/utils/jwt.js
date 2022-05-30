const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    try {
        req.decoded = jwt.verify(req.headers.authorization,"test");
        return next();
    } catch (error) {
        return res.json(error);
    }
}

module.exports = {verifyToken}