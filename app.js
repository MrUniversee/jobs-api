require('dotenv').config()
require('express-async-errors')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const express = require('express')
const app = express()
const authRoute = require('./routes/auth')
const jobRoute = require('./routes/jobs')
const authMiddleWare = require('./middleware/authentication')
// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
)
app.use(express.json())
app.use(cors())
app.use(xss())
app.use(helmet())

// security

// routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/jobs', authMiddleWare, jobRoute)

//error middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
