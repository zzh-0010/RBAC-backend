const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
  devicename: {
    type: String,
    required: true,
  },
  status: String,
  last_update: {
    type: Date,
    default: 0,
  }
  /*
  是否可以通过预设一些来进行拓展？还是需要拓展时直接拓展即可？
  ,extend_Info: {
    type: String,
  }
  */
})

deviceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Device', deviceSchema)