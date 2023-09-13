const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes/user');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
dotenv.config()
const app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",router)
app.listen(process.env.PORT,(res)=>{
    console.log("server listening on port ",process.env.PORT);
    mongoose.set('strictQuery', true)
    mongoose.pluralize(null)
    mongoose.connect(process.env.DB)
        .catch((err) => {
            console.log("Not connected to db")
            console.log(err)
        })
})

