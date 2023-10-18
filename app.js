const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser') 

const authRoutes = require('./routes/authRoutes')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const { doubleCsrf } = require("csrf-csrf")
const { addCSRF } = require('./middleware/csrfMiddleware')

// from .env
require('dotenv').config()
const DB_URI = process.env.DB_URI
const PORT = process.env.PORT
const CSRF_SECRET_KEY = process.env.CSRF_SECRET_KEY
const CSRF_COOKIE_NAME = process.env.CSRF_COOKIE_NAME

const app = express()


const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => CSRF_SECRET_KEY,
  cookieName: CSRF_COOKIE_NAME,
  cookieOptions: {
    sameSite: "lax",
    path: "/",
    secure: true,
  },
  size: 64, // The size of the generated tokens in bits
  ignoredMethods: ["GET", "HEAD", "OPTIONS"], // A list of request methods that will not be protected.
  getTokenFromRequest: (req) => req.headers["x-csrf-token"], // A function that returns the token from the request
})

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()) 
app.use(doubleCsrfProtection)

// view engine 
app.set('view engine', 'ejs')


// database connection
mongoose.connect(DB_URI)
 .then(result => app.listen(PORT))
 .catch(err => console.log(err))


// routes
app.get('*', checkUser)    // apply in single route
app.get('*', addCSRF)    // apply in single route
app.get('/',  requireAuth, (req, res) =>  res.render('index') )

app.use(authRoutes)