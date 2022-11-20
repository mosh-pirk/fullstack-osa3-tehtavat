const mongoose = require('mongoose')
require('dotenv').config()

const dbUrl = process.env.MONGODB_URI

mongoose.connect(dbUrl)
    .then(result => {
        console.log('connected to MongoDB', result.STATES.connected)
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    }).finally()

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('persons', personSchema)