const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODBURL).then(()=>{
    console.log("connected to mongodb with mongoose")
}).catch((err)=>{
    console.log("Error occurred during connection with mongodb :",err);
})