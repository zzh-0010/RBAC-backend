//角色测试集
//只有租户管理员可以进行角色相关的操作
const { test, describe, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Role = require('../models/role')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

describe('Base roles', () => {
  beforeEach(async () => {

    const tenantAdmin = new Role({ rolename: 'tenant_admin' })
    await tenantAdmin.save()

    const deviceOperator = new Role({ rolename: 'device_operator' })
    await deviceOperator.save()

    const passwordHash = await bcrypt('secret', 10)
    const deviceOp = new User({ username: 'deviceOp', name: 'device_operator', passwordHash })

    await deviceOp.save()

  })

  test('device operator can create a device & a device Owner is created', async () => {
    const devicesAtSt = await helper.deviceInDb()

    const deviceOp = {
      username: 'deviceOp',
      password: 'secret'
    }

    const response = await api.post('/api/login').send(deviceOp)
    const token = response.body.token

    const testDevice = {
      devicename: 'test',
      status: 'Off',
      last_update: Date.now()
    }

    await api
      .set('Authorization', `Bearer ${token}`)
      .send(testDevice)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const devicesAtEn = await helper.deviceInDb()

    assert.strictEqual(devicesAtSt.length, devicesAtEn.length + 1)
    assert(response.body.devicename.includes('test'))

  })
})

after(async () => {
  await mongoose.connection.close()
})