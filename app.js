const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/authRoutes')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

// from .env
require('dotenv').config()
const DB_URI = process.env.DB_URI
const PORT = process.env.PORT

const app = express()

// middleware
app.use(express.static('public'))
app.use(express.json())   // for json
app.use(express.urlencoded({ extended: true }))   // for form data
app.use(cookieParser())

// view engine 
app.set('view engine', 'ejs')


// database connection
mongoose.connect(DB_URI)
 .then(result => app.listen(PORT))
 .catch(err => console.log(err))


// routes
app.get('*', checkUser)    // apply in single route
app.get('/',  requireAuth, (req, res) =>  res.render('index') )

app.use(authRoutes)