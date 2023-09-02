require('dotenv').config()

let PORT = process.env.PORT || 8080
let MONGODB_URI = process.env.MONGODB_UR

module.exports = {
  PORT, MONGODB_URI
}