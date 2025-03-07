module.exports = (req, res, next) => {
   
    if(!req.user.isAdmin){
        return res.status(403).
            json({
                status: "fail",
                message: "Access Denied!"
            });
    }   
    next();

}