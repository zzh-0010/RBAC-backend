const testingRouter = require('express').Router()
const User = require('../models/user')
const Role = require('../models/role')
const Device = require('../models/device')

testingRouter.post('/reset', async (request, response) => {
  await User.deleteMany({})
  await Role.deleteMany({})
  await Device.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
