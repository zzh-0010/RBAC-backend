const express = require('express')
const app = express()

const middleWares = require('./utils/middleWares')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const config = require('./utils/config')

const mongoose = require('mongoose')

const url = config.MONGODB_URL

//链接数据库
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MONGODB')
  })
  .catch((error) => {
    console.log('error connecting to MONGODB..', error.message)
  })


app.use(express.json())
app.use(middleWares.tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/tests')
  app.use('/api/testing', testingRouter)
}

app.use(middleWares.errorHandler)

module.exports = app