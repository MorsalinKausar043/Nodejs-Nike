const jwt = require("jsonwebtoken");
const NikeUser = require("../models/conn");

const auth = async (req, res , next) => {
    try
    {
        const token = req.cookies.jwt;
        const AuthData = jwt.verify(token, process.env.SECRET_KEY);
        const userMatch = await NikeUser.findOne({ _id: AuthData._id });

        req.token = token;
        req.userMatch = userMatch;
        next();
        
    } catch (error) {
        res.status(501).render("error4", { para: "Please Login" });
    }
}

module.exports = auth;