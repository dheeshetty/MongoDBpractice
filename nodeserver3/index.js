const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
//connect mangoose
const mongoose = require('mongoose')
//hiding password
const dotenv = require('dotenv')
dotenv.config()

const app = express()

const User = mongoose.model('User',{
    firstName :String,
    lastName: String,
    email:String,
    phoneNumber: Number
})
const Book = mongoose.model('Book',{
    firstName :String,
    lastName: String,
    email:String,
    phoneNumber: Number
})


//app.use use to attatch middleware
//middleware entity which lies bw your client and server

app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'ejs')


  


app.get('/',(req,res) =>{
    res.json({message : 'all good!'})
})

app.listen(process.env.PORT, () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log(`DB connection done server running:${process.env.PORT}`))
    .catch((error) => console.error(error))
})