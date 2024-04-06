const mongoose = require("mongoose");
const connect = async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/test")
    console.log("connected to mongoDB");
}

module.exports = connect