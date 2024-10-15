//对角色的操作
const logger = require('../utils/logger')
const rolesRouter = require('express').Router()
const Role = require('../models/role')

rolesRouter.get('/', async (request, response) => {
  try{
    const roles = await Role.find({}).populate('users', { username: 1 })
    response.json(roles)
  }catch(error){
    console.log(error)
  }
})

rolesRouter.post('/', async (request, response) => {
  const role = request.body

  const newRole = new Role({ ...role })

  try{
    await newRole.save()
    response.status(201).json(newRole)

  }catch(error){
    logger.error(error)
  }
})

rolesRouter.delete('', async(request, response) => {
  console.log('request.params.id', request.params.id)

  if (request.token === undefined) {
    return response.status(401).json({ error: 'You need a token' })
  }

  try {
    await Role.findByIdAndDelete(request.params.id)
    response.status(204)
  } catch (error) {
    console.log(error)
  }
})

module.exports = rolesRouter