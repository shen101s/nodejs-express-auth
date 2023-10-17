const User = require('../models/user')
const jwt = require('jsonwebtoken')

//  handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code)

  let error = { email: '', password: '' }

  // duplicate error code
  if (err.code === 11000) {
    error.email = 'Email is already registered'
    return error
  }

  // validation errors
  if (err.name === 'ValidationError') {
    Object.values(err.errors).forEach(({properties}) => {
      error[properties.path] = properties.message
    })
  }

  return error
}


// for jwt values
require('dotenv').config()
const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY
const maxAge = 3 * 24 * 60 * 60

// create token 
const createToken = (id) => {
  return jwt.sign({ id }, JWT_TOKEN_KEY, { 
    expiresIn: maxAge
   })
}

module.exports.signin_get = (req, res) => {
  res.render('signin')
}

module.exports.signin_post = async (req, res) => {
  const { email, password } = req.body
  
  try {
    const user = await User.signin(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
    res.status(201).json({ user: user._id })
  } catch(err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.signup_get = (req, res) => {
  res.render('signup')
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body
  
  try {
    const user = await User.create({ email, password })
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
    res.status(201).json({ user: user._id })
  } catch(err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.signout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/signin')
}