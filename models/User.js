const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Please provide username'],
    minlength: 6,
    maxlength: 25,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    minlength: 6,
    maxlength: 50,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
})
// MAKE USE OF THE REGULAR FUNCTION EXPRESSIONS WHEN WORKING WITH THE MONGODB SCHEMA TO BE SURE THAT THE "THIS" KEYWORD REFERS BACK TO THE DOCUMENT
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFESPAN }
  )
}

UserSchema.methods.checkPassword = async function (reqPassword) {
  const isMatch = await bcrypt.compare(reqPassword, this.password)
  return isMatch
}

module.exports = mongoose.model('user', UserSchema)
