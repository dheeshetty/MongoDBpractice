const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'))

app.set('view engine', 'ejs');

const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: Boolean
})

// req headers: metadata
const isLoggedIn = (req, res, next) => {
  try {
    const jwtToken = req.headers.token
    const user = jwt.verify(jwtToken, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch(error) {
    res.json({
      status: 'FAILED',
      message: 'Please login first!'
    })
  }
}

const isUserAdmin = (req, res, next) => {
  if(req.user.isAdmin) {
    next()
  } else {
    res.json({
      status: 'FAILED',
      message: "You're not allowed to access this page"
    })
  }
}

app.get('/', (req, res) => {
  res.json({ status: 'SUCCESS', message: 'All good!'})
})

app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, isAdmin } = req.body

    const encryptedPassword = await bcrypt.hash(password, 10)

    const newUser = { 
      firstName, 
      lastName, 
      email, 
      password: encryptedPassword,
      isAdmin
    }

    await User.create(newUser)
    
    const jwtToken = jwt.sign(newUser, process.env.JWT_SECRET, { expiresIn: 60 })

    res.json({
      status: 'SUCCESS',
      message: 'User signed up successfully!',
      jwtToken
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
})

app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if(!user) {
      return res.status(500).json({
        status: 'FAILED',
        message: 'Invalid credentials!'
      })
    }

    const passwordMatched = await bcrypt.compare(password, user.password)
    if(!passwordMatched) {
      return res.status(500).json({
        status: 'FAILED',
        message: 'Invalid credentials!'
      })
    }

    const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 })

    res.json({
      status: 'SUCCESS',
      message: `${user.firstName} ${user.lastName} signed in successfully!`,
      jwtToken
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
})

// Private routes

// isLoggedIn (Authentication)
app.get('/dashboard', isLoggedIn, (req, res) => {
  res.send(`Welcome user ${req.user.firstName} ${req.user.lastName}`)
})

// isLoggedIn (Authentication) + isUserAdmin (Authorization)
app.get('/admin', isLoggedIn, isUserAdmin, (req, res) => {
  res.send('Admin Page')
})

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log(`Server running on http://localhost:${process.env.PORT}`))
    .catch(error => console.log(error));
})


/*
  ## Authentication vs Authorization
  - Authentication: Verify user's identity (Who are you?)
  - Authorization: Checking the access of logged in user (What access do you have?)

  ## bcrypt - Encrypt the password
  ## JWT (JSON Web Token)

  Image: https://www.vaadata.com/blog/wp-content/uploads/2016/12/JWT_tokens_EN.png

  // Example of simple middleware
  const isLoggedIn = (req, res, next) => {
    let loggedIn = false

    if(loggedIn) {
      next()
    } else {
      return res.json({
        status: 'FAIL',
        message: 'Please login first!'
      })
    }
  }
*/