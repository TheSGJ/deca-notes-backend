require('dotenv').config()
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI_STR;

const connectToMongo = () =>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to MongoDB successfully!")
    })
}

module.exports = connectToMongo;