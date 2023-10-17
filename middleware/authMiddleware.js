const jwt = require('jsonwebtoken')
const User = require('../models/user')

require('dotenv').config()
const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  // check if token exists and verified
  if (token) {
    jwt.verify(token, JWT_TOKEN_KEY, (err, decodedToken) => {
      if (err) {
        res.redirect('/signin')
      } else {
        next()
      }
    })
  } else {
    res.redirect('/signin')
  }
}

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt 

  if (token) {
    jwt.verify(token, JWT_TOKEN_KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null     // accessable in view
        next()
      } else {
        let user = await User.findById(decodedToken.id)
        res.locals.user = user     // accessable in view

        console.log(user)
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}

module.exports = { requireAuth, checkUser }
