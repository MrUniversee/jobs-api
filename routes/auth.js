const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')
const { loginUser, registerUser } = require('../controllers/auth')
router.post('/login', loginUser)
router.post('/register', registerUser)

module.exports = router
