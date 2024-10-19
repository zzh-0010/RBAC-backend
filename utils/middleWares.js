const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')
const { newEnforcer } = require('casbin')

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
    if (!decodedToken.id) {
      request.token = undefined
      return response.status(401).json({ error: 'token invalid' })
    }
    request.user = await User.findById(decodedToken.id.toString())
  }
  next()
}

//casbin的enforcer
const enforcement = async(request, response, next) => {
  const enforcer = await newEnforcer('./model.conf', './policy.csv')

  const method = request.method
  const path = request.path

  if( path === '/api/login' ){  //给一个api公共权限
    return next()
  }

  const user = request.user.username
  const allowed = await enforcer.enforce(user, path, method)

  if(allowed){
    next()
  }
  else{
    response.status(403).send('Forbidden')
  }

}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler,
  enforcement
}