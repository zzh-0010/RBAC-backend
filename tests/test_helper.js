const User = require('../models/user')
const Device = require('../models/device')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const deviceInDb = async () => {
  const devices = await Device.find({})
  return devices.map((u) => u.toJSON())
}

module.exports = {
  usersInDb,
  deviceInDb
}
