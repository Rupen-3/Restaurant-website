require('dotenv').config();
const express = require("express");
const dotenv = require('dotenv');
const cookieParse = require("cookie-parser");

dotenv.config({ path: './config.env' });
require("./db/connection");
const port = process.env.PORT || 5000;
const app = express();

app.use(cookieParse());
app.use(express.json());
app.use(require('./router/root'));

app.listen(port, () => {
    console.log(`Food Website Runnig At http://localhost:${port}`);
});