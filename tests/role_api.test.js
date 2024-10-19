//角色测试集
//只有租户管理员可以进行角色相关的操作
const { test, describe, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Role = require('../models/role')
const Device = require('../models/device')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)


describe('Base roles', () => {
  beforeEach(async () => {

    await Role.deleteMany({})
    await User.deleteMany({})
    await Device.deleteMany({})

    const tenantAdmin = new Role({ rolename: 'tenant_admin' })
    await tenantAdmin.save()

    const deviceOperator = new Role({ rolename: 'device_operator' })
    await deviceOperator.save()

    let passwordHash = await bcrypt.hash('secret', 10)
    const deviceOp = new User({ username: 'deviceOp', name: 'device_operator', passwordHash })

    await deviceOp.save()

    passwordHash = await bcrypt.hash('root', 10)
    const tenantAd = new User({ username: 'tenantAdmin', name: 'tenant_testing', passwordHash})

    await tenantAd.save()

  })

  test('device operator can create a device', async () => {
    const devicesAtSt = await helper.deviceInDb()

    const deviceOp = {
      username: 'deviceOp',
      password: 'secret'
    }

    let response = await api.post('/api/login').send(deviceOp)
    const token = response.body.token

    const testDevice = {
      devicename: 'test',
      status: 'Off',
      last_update: Date.now()
    }

    response = await api
      .post('/api/devices')
      .set('Authorization', `Bearer ${token}`)
      .send(testDevice)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const devicesAtEn = await helper.deviceInDb()

    assert.strictEqual(devicesAtSt.length + 1, devicesAtEn.length)
    assert(response.body.devicename.includes('test'))
    assert(response.body.status.includes('Off'))
  })

  test('Only specified role can acces the reference api', async () => {
    const devicesAtSt = await helper.deviceInDb()

    const tenantAdmin = {
      username: 'tenantAdmin',
      password: 'root'
    }

    let response = await api.post('/api/login').send(tenantAdmin)
    const token = response.body.token

    //尝试创建设备
    const testDevice = {
      devicename: 'test',
      status: 'Off',
      last_update: Date.now()
    }

    response = await api
      .post('/api/devices')
      .set('Authorization', `Bearer ${token}`)
      .send(testDevice)
      .expect(403)

    const devicesAtEn = await helper.deviceInDb()
    assert.strictEqual(devicesAtSt.length, devicesAtEn.length)
    assert(response.error.text.includes('Forbidden'))
  })
})

after(async () => {
  await mongoose.connection.close()
})