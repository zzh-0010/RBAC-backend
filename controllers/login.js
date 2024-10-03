//简单的登录功能
//直接用了包，什么啊我自己实现也可以
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const useForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(useForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
