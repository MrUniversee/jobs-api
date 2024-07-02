const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const authMiddleWare = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith(`Bearer `)) {
    throw new UnauthenticatedError('Authorization invalid')
  }
  const token = authorization.split(' ')[1]
  try {
    const user = await jwt.verify(token, process.env.JWT_SECRET)
    const { userID, username } = user
    req.user = { userID, username }
    next()
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = authMiddleWare
