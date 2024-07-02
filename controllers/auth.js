const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const loginUser = async (req, res) => {
  const { username, password, email } = req.body
  if (!username || !password || !email) {
    throw new BadRequestError('Please provide credentials')
  }
  const user = await User.findOne({ username })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  //check password
  const isPasswordMatch = await user.checkPassword(password)
  // if password doesn't match
  if (!isPasswordMatch) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  //create token
  const token = user.createJWT()

  res.status(StatusCodes.OK).json({
    user: { username: user.username },
    token,
  })
}

const registerUser = async (req, res) => {
  // const { username, email, password } = req.body
  // const salt = await bcrypt.genSalt(10)
  // This salt method generates random bytes that will be used to create secure passwords
  // const hashedPassword = await bcrypt.hash(password, salt)
  // const updatedUser = { username, email, password: hashedPassword }
  const user = await User.create({ ...req.body })
  const token = user.createJWT()

  res
    .status(StatusCodes.CREATED)
    .json({ user: { username: user.username }, token })
}

module.exports = { loginUser, registerUser }
