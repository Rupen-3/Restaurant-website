const jwt = require("jsonwebtoken");
const Register = require("../models/register");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.Foody;
        const veri = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(veri);

        const user = await Register.findOne({ _id: veri._id });
        if (!user) {
            console.log("User not found");
        }

        req.token = token;
        req.user = user;
        req.userId = user._id;

        next();
    }
    catch (error) {
        console.log("Some error to auth " + error);
        return res.status(400).send("Some error to auth " + error);
    }
}

module.exports = auth;