const jwt = require('jsonwebtoken');
const User = require("../models/User")



module.exports = async (req, res, next) => {
    try{
        
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
            ) {
                token = req.headers.authorization.split(' ')[1];
            } else if (req.headers.cookie) {
                token = req.headers.cookie.split(' ')[1].slice(4);
            }
            const decoded =  jwt.verify(token, process.env.JWT_KEY);
            console.log(token)
        const freshUser =  await User.findById(decoded.userId); 
        req.user = freshUser;
        next()
       
    }catch(error){
        console.log(error)
        return res.status(401).json({
            message: "login first!"
            
        });

    } 
    
};



 