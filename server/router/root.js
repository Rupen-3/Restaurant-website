const express = require("express");
const bcryptjs = require("bcryptjs");
const router = express.Router();

require("../db/connection");
const Register = require("../models/register");
const auth = require("../middleware/auth");

// Get requests
router.get('/', auth, (req, res) => {
    console.log("home");
});
router.get('/checkout-cart', auth, (req, res) => {
    console.log("cart");
});
router.get('/order', auth, (req, res) => {
    console.log("order");
});
router.get('/wishlist', auth, (req, res) => {
    console.log("wishlist");
});
router.get('/login', (req, res) => {
    console.log("login");
});
router.get('/signup', (req, res) => {
    console.log("signup");
});
router.get('/account', auth, (req, res) => {
    console.log("account");
});
router.get('/logout', auth, async (req, res) => {
    try {
        console.log("logout");
        req.user.tokens = req.user.tokens.filter((currUser) => {
            return currUser.token !== req.token;
        })

        res.clearCookie("Foody");

        console.log("Logout Successfully");
        await req.user.save();
        res.render("login");
    }
    catch (error) {
        console.log("Some error to logout " + error);
        res.status(401).render(error);
    }
});
router.get('/logoutall', auth, async (req, res) => {
    try {
        console.log("logoutall");
        // Logout all devices
        req.user.tokens = [];

        res.clearCookie("Foody");

        console.log("Logout All devices Successfully");
        await req.user.save();
        res.render("login");
    }
    catch (error) {
        console.log("Some error to logout " + error);
        res.status(401).render(error);
    }
});

router.get("/user", auth, (req, res) => {
    res.send(req.user);
});

// Post requests
router.post("/signup", async (req, res) => {
    try {
        const { firstname, lastname, phone, gender, email, password, confirmpassword, age } = req.body;
        console.log(req.body);
        const findData = await Register.findOne({ email });
        if (findData) {
            return res.status(400).send("This Email is already in used");
        }
        else {
            if (password == confirmpassword) {
                const registerCustomer = new Register({ firstname, lastname, phone, gender, email, password, confirmpassword, age });

                const tokenSignup = await registerCustomer.generateAuthToken();
                // console.log("Token Signup " + tokenSignup);

                res.cookie("Foody", tokenSignup, {
                    // expires: new Date(Date.now() + 600000),
                    httpOnly: true
                });

                const registerSuccess = await registerCustomer.save();
                console.log("Signup sucessful");
                return res.status(200).send(registerSuccess + "Signup sucessful");
            }
            else {
                return res.status(400).send("Password are not matching");
                console.log("Password are not matching");
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
})
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const findData = await Register.findOne({ email });
        if (findData) {
            const pass_Match = await bcryptjs.compare(password, findData.password);

            const tokenSignin = await findData.generateAuthToken();
            // console.log("Token Signin " + tokenSignin);

            const cookie = res.cookie("Foody", tokenSignin, {
                // expires: new Date(Date.now() + 600000),
                httpOnly: true,
                secure: true
            });

            if (pass_Match) {
                console.log("Login Successful");
                return res.status(200).send(findData + "Login Successful");
            }
            else {
                return res.status(400).send("Invalid information Password not match");
            }
        }
        else {
            return res.status(400).send("You r not an exist user");
        }
    }
    catch (error) {
        console.log("Some error " + error);
        return res.status(400).send(error);
    }
})

router.post("/updateuser", auth, async (req, res) => {
    try {
        const data = req.body;
        const updateInfo = await Register.findByIdAndUpdate({ _id: req.userId }, data);
        if (updateInfo) {
            return res.status(200).send("Update successfully");
        }
        else {
            return res.status(400).send("User not found");
        }
    }
    catch (error) {
        console.log("Some error to update information " + error);
        return res.status(400).send("Some error to update information " + error);
    }
});

router.post("/updateaddress", auth, async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const updateAddress = await Register.findByIdAndUpdate({ _id: req.userId }, data);
        if (updateAddress) {
            return res.status(200).send("Address Update successfully");
        }
        else {
            return res.status(400).send("User not found");
        }
    }
    catch (error) {
        console.log("Some error to update address " + error);
        return res.status(400).send("Some error to update address " + error);
    }
});

router.post("/addaddress", auth, async (req, res) => {
    try {
        const findUser = await Register.findOne({ _id: req.userId });
        if (findUser) {
            const addAddress = await findUser.addNewAddress(req.body);
            if (addAddress) {
                return res.status(200).send("Address added");
            }
            else {
                return res.status(400).send("Some error to add address");
            }
        }
    }
    catch (error) {
        console.log("Some error to add new address " + error);
    }
})

router.post("/getorder", auth, async (req, res) => {
    // try {
    //     const findUser = await Register.findOne({ _id: req.userId });
    //     if (!findUser) {
    //         console.log("User Not Found");
    //         return res.status(400).send("User Not Found");
    //     }
    //     else {
    //         const orders = await findUser.takeOrder(req.body);
    //         if (orders) {
    //             await findUser.save();
    //             console.log("Order Successfully");
    //             return res.status(200).send("Order Successfully");
    //         }
    //         else {
    //             return res.status(400).send("Order food failed");
    //         }
    //     }
    // }
    // catch (error) {
    //     console.log("Some Error " + error);
    //     return res.status(400).send("Some Error " + error);
    // }
})

module.exports = router
