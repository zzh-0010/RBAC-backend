const devicesRouter = require('express').Router()
const Device = require('../models/device')
const logger = require('../utils/logger')
//const { newEnforcer } = require('casbin')

//先写两个api进行测试

//查询全部设备信息（！！！danger）
devicesRouter.get('/', async (request, response) => {
  const devices = await Device.find({})
  response.json(devices)
})

devicesRouter.get('/:id', async (request, response) => {
  try{
    const device = await Device.findById(request.params.id)
    response.json(device)
  }catch(error){
    logger.error(error)
  }
})

//增加设备
devicesRouter.post('/', async (request, response) => {
  const body = request.body

  if (request.token === undefined) {
    return response.status(401).json({ error: 'You need a token' })
  }

  const timeNow = Date.now()

  const device = new Device({ ...body, last_update: timeNow })

  // const enforcer = await newEnforcer('./model.conf', './policy.csv')

  // const deviceName = device.devicename

  // console.log('what does devide here looks like? ', device)

  // const deviceId = device._id.toString()

  //每增加一个设备，就增加一个设备owner

  // await enforcer.addRoleForUser(deviceName, `${deviceName}_Owner`)

  // await enforcer.addPermissionForUser( `${deviceName}_Owner`, `/api/devices/${deviceId}`, 'GET' )

  //先直接给device operator这个设备的owner吧, 后期会进行分层

  //await enforcer.addRoleForUser('deviceOp', `${deviceName}_Owner`)

  //device operator拥有每个设备的权限

  // const saved = enforcer.savePolicy()

  // if(saved){
  //   logger.info('New policy added!')
  // }

  try {
    await device.save()
    response.status(201).json(device)
  } catch (error) {
    console.log(error)
    response.status(400).end()
  }

})

devicesRouter.delete('/:id', async(request, response) => {

  try{
    const device = await Device.findByIdAndDelete(request.params.id)
    response.status(204).json(device)
  }catch(error){
    logger.error(error)
  }

})

//更新设备信息
devicesRouter.put('/:id', async(request, response) => {
  if (request.token === undefined) {
    return response.status(401).json({ error: 'You need a token' })
  }
  try {
    const updatedBlog = await Device.findByIdAndUpdate(
      request.params.id,
      { new: true },
    )
    response.json(updatedBlog)
  } catch (error) {
    logger.error(error)
  }
})

module.exports = devicesRouter