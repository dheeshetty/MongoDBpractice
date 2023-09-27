const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'))

app.set('view engine', 'ejs');

const Customer = mongoose.model('Customer', {
  name: String,
  email: String,
  phoneNumber: Number,
  avatarURL: String
});

app.get('/', (req, res) => {
  res.json({ status: 'SUCCESS', message: 'All good!'})
})

// READ: GET /customers 
app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find()
    res.json({
      status: 'SUCCESS',
      data: customers
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
})

// CREATE: POST /customers 
app.post('/customers', async (req, res) => {
    try {
        console.log(req.body)
    const { name, email, phoneNumber, avatarURL} = req.body
      await Customer.create({ name, email, phoneNumber, avatarURL} )
      res.json({
                status: 'SUCCESS',
                message: 'Customer created successfully'
      })
    } catch (error) {
      res.status(500).json({
        status: 'FAILED',
        message: 'Something went wrong'
      })
    }
  })

//put patch
  app.patch('/customers/:id', async (req, res) => {
    try {
        const { name, email, phoneNumber, avatarURL} = req.body
        const { id } = req.params;
        await Customer.findByIdAndUpdate(id,{ name, email, phoneNumber, avatarURL} )
      res.json({
        status: 'SUCCESS',
        message: 'Customer updated successfully'
      })
    } catch (error) {
      res.status(500).json({
        status: 'FAILED',
        message: 'Something went wrong'
      })
    }
  })
  //delete
  app.delete('/customers/:id', async (req, res) => {
    try {
        
        const { id } = req.params;
        await Customer.findByIdAndDelete(id)
      res.json({
        status: 'SUCCESS',
        message: 'Customer deleted successfully'
      })
    } catch (error) {
      res.status(500).json({
        status: 'FAILED',
        message: 'Something went wrong'
      })
    }
  })




app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log(`Server running on http://localhost:${process.env.PORT}`))
    .catch(error => console.log(error));
})



























/*
  -----------------------------------------
  REST: Representational State Transfer
  - Standardized representation of APIs
  - CRUD operations

  HTTP Methods:
  - GET: 'Read' data (R)
  - POST: 'Create' data (C)
  - PUT/PATCH: 'Update' data (U)
  - DELETE: 'Delete' data (D)

  ## Example for E-Commerce Website:
  - APIs for Customers 
      - R: GET /customers
      - C: POST /customers
      - U: PATCH /customers/:id
      - D: DELETE /customers/:id
  - APIs for Sellers
      - R: GET /sellers
      - C: POST /sellers
      - U: PATCH /sellers/:id
      - D: DELETE /sellers/:id
  - APIs for Products
      - R: GET /products
      - C: POST /products
      - U: PATCH /products/:id
      - D: DELETE /products/:id

  200: Successful
  400: Bad Request
  404: Not found
  500: Internal Server Error
*/