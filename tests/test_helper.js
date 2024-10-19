const User = require('../models/user')
const Device = require('../models/device')
const Role = require('../models/role')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const deviceInDb = async () => {
  const devices = await Device.find({})
  return devices.map((d) => d.toJSON())
}

const rolesInDb = async () => {
  const roles = await Role.find({})
  return roles.map((r) => r.toJSON())
}

module.exports = {
  usersInDb,
  deviceInDb,
  rolesInDb
}
