const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ref } = require('joi');


const signUp = (req, res, next) => {
    User.findOne({ email: req.body.email.toLowerCase() })
    .exec()
    .then(user => {
        if(user) {
            return res.status(409).json({
                message: "Email already Exist"
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new User({
                        full_name: req.body.full_name, 
                        email:req.body.email.toLowerCase(),
                        password: hash
                    });
                    user
                        .save()
                        .then(result => {
                            console.log(result)
                            res.status(201).json({
                                message: 'User Created Successfully!',
                                user
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            })
        }
    })      
  
};


const login = (req, res, next) => {
    User.find({email: req.body.email.toLowerCase()})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {

            if(err){
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }
            if(result){
                const token = jwt.sign({
                    full_name: user[0].full_name,
                    email: user[0].email,
                    userId: user[0]._id,
                    isAdmin: this.isAdmin
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "24h"
                }
                );
                const cookieOptions = {
                    expires: new Date(
                      Date.now() + 1 * 24 * 60 * 60 * 1000
                    ),
                    secure: false,
                    httpOnly: true
                  };
                  res.cookie('jwt', token, cookieOptions);
                
                return res.status(200).json({
                    message: "logged in successfully!",
                    token: token
                });
                
            }
            return res.status(401).json({
                message: "Invalid email or password"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}


const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({
            message: "All Users accounts",
            users
        });
    }catch(err){
        res.status.json({ 
            status: "fail",
            message: "Fail to get users" 
        });
    }
}

const getSpecificUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        res.status(200).json({
            message:"Selected User",
            user
        });
    }catch(err){
        res.status(500).json({ 
            status: "fail",
            message: "Fail to get all users" 
        });
    }
}

const updateUser = async(req, res) => {
   try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const updateUser = await User.updateOne(
            { _id: req.params.userId }, 
                { $set: {full_name: req.body.full_name,
                    email: req.body.email.toLowerCase(),
                        password: req.body.password
            },  
            });
            res.status(200).json({
                message:"user profile updated successfully!",
                updateUser
            });
   } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "user Not found"
        });
       res.status(500).json({
           status: "fail",
           message: "fail to update profile"
       });
   }
        
}

const deleteUser = async (req, res) => {
    try{
        const deleteUser = await User
            .deleteOne({
                 _id: req.params.userId 
            });
        res.status(200).json({
            message: "User deleted!",
            deleteUser
        });
    }catch(err){
        res.status(500).json({ 
            status: "fail",
            message: "Failed to delete"
        });
    }
}

const logout = async(req, res, next) => {
    try{
        res.clearCookie("jwt");
        res.status(200).json({
            message: "You logged Out successfully!"
        });

    }catch(error){
        res.status(500).send(error);
    }
}

module.exports = {
    signUp,
    login,
    getAllUsers,
    getSpecificUser,
    updateUser,
    deleteUser,
    logout
}