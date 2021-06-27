require('dotenv').config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const customerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    confirmpassword: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true,
        min: 10
    },
    age: {
        type: Number,
        require: true,
    },
    addresses: [{
        house: {
            type: String,
            require: true
        },
        societyname: {
            type: String,
            require: true
        },
        landmark: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        pincode: {
            type: String,
            require: true
        },
        place: {
            type: String,
            require: true
        }
    }],
    orders: [{
        orderdetail: {
            type: Array,
            require: true
        },
        orderid: {
            type: String,
            require: true
        },
        totalamount: {
            type: String,
            require: true
        },
        ordertime: {
            type: Date,
            default: Date.now
        },
        deliveryaddress: {
            type: String,
            require: true
        }
    }],
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
});

// Generate token
customerSchema.methods.generateAuthToken = async function (req, res) {
    try {
        const token = jwt.sign({ _id: this.id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        // console.log("Generated token " + token);
        return token;
    }
    catch (error) {
        console.log("Some error to generate token " + error);
        res.status(400).send(error);
    }
}

// Password hasing
customerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
});

// order
customerSchema.methods.takeOrder = async function (getOrder) {
    try {
        const totalamount = getOrder.totalprice;
        const deliveryaddress = getOrder.Address;
        console.log(getOrder.order.arr);
        const orderid = "1234567890";
        this.orders = await this.orders.concat({ orderdetail: getOrder.order.arr, orderid, totalamount, deliveryaddress });
        await this.save();
        await returnFun();
        function returnFun() {
            if (this.orders) {
                return this.orders;
            }
        }
    }
    catch (error) {
        console.log("Some Error to store order " + error);
    }
}

// Address
customerSchema.methods.addNewAddress = async function (addNewAddress) {
    try {
        const { house, societyname, landmark, city, pincode, place } = addNewAddress;
        this.addresses = await this.addresses.concat({ house, societyname, landmark, city, pincode, place });
        await this.save();
        return this.addresses;
    }
    catch (error) {
        console.log("Some error to store address " + error);
    }
}

const Register = new mongoose.model("Register", customerSchema);

module.exports = Register;

// mynameisrjandthisisfoodwebsite