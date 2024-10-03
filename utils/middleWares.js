const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  logger.info('error message', error.message)
  logger.info('error name', error.name)
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: 'malformatted userInfo' })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 dulplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expect `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    })
  }
  next(error)
}

//提取验证信息中的token
const tokenExtractor = (request, response, next) => {
  console.log('requestHead', request.header)
  const authorization = request.get('authorization')
  if (authorization === undefined) { /* empty */ }
  else if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    request.token = token
  }
  next()
}

//提取验证信息中的用户
const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization === undefined) { /* empty */ } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET) //返回解码成功的对象？
    console.log('decodedToken: ', decodedToken)
    if (!decodedToken.id) {
      request.token = undefined
      return response.status(401).json({ error: 'token invalid' })
    }
    request.user = await User.findById(decodedToken.id.toString())
  }
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
}