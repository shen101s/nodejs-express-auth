const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minLength: [8, 'Minimum password length is 8']
  }
}, { timestamps : true })

// fire a function before save to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// static method to login user
userSchema.statics.signin = async function(email, password) {
  const user = await this.findOne({ email })

  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
  } 
  throw Error('Incorrect email and password!')
}

const User = mongoose.model('User', userSchema)

module.exports = User