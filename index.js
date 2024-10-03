//Start here, your first project
const app = require('./app')
const config = require('./utils/config')

const PORT = config.PORT

app.listen(PORT, () => {
  console.log(`🚀server running on port ${PORT}`)
})