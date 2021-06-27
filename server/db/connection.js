require('dotenv').config();
const mongoose = require("mongoose");

// Check Connection to database or some error occured
mongoose.connect(process.env.DATABASE_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Yes Boss, Connection Successful");
}).catch((error) => {
    console.log("Sorry Boss, We Get Some Error " + error);
});

// mongodb://localhost/foody