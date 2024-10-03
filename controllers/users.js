const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//生成用户--注册
usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (password.length < 3) { //密码合理性检查，后期可以丰富一下
    return response.status(400).json({ error: 'invalid password' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })
  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

//删除用户
usersRouter.delete('/:id', async (request, response) => {
  console.log('request.params.id', request.params.id)

  if (request.token === undefined) {
    return response.status(401).json({ error: 'You need a token' })
  }

  const user = request.user
  try {
    await User.findByIdAndDelete(request.params.id)
    response.status(204).json(user)
  } catch (error) {
    console.log(error)
  }
})

//改？改用户名？晚点再说

//get一下全部用户
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.status(200).json(users)
})

module.exports = usersRouter
