const jwt = require('jsonwebtoken');
const User = require("../models/User")
const { promisify } = require('util')



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




/*
module.exports = async (req, res, next) =>{
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    // console.log(token)
    if (!token) {
        return next(
            res.status(401).json({
                status: 'failed',
                message: 'Please you may log in to get access'
            })
        )

    }
    // 2. Verifying Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY)

    // 3. Check if user still exists
    const freshUser = await User.findById(decoded._id)

    try {
        if (!freshUser) {
            return next(
                res.status(401).json({
                    status: 'failed',
                    message: "The user belong to this token is no longer exist"
                })
            )
        }


    } catch (error) {
        let message
        if (error.name == "JsonWebTokenError") {
            message = "Invalid Token, Please log in again!"
        } else if (error.name == "TokenExpiredError") {
            message = "Your token has expired, Please log in again!"
        } else {
            message = error
        }
        return next(
            res.status(401).json({
                status: 'failed',
                message
            })
        )
    }

    req.user = freshUser
    next()
}
*/

/*
module.exports = async(req, res, next) => {
    const { authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "login first"})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, process.env.JWT_KEY,(err, payload) =>{
        if(err){
            return res.status(401).json({error: "you must login"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
        })
        next()
    })
}
*/


 