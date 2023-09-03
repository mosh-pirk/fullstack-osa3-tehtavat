const express = require('express')
require('express-async-errors')
const cors = require('cors')
const morgan = require('morgan')
const { requestLogger, errorHandler, unknownEndpoint } = require('./utils/middleware')
const { appRouter } = require('./controllers/app')
const { personRouter } = require('./controllers/person')
const { blogsRouter } = require('./controllers/blogs')
const mongoose = require('mongoose')
const { connect } = require('mongoose')
const { info, error } = require('./utils/logger')
const dbUrl = process.env.MONGODB_URI
const app = express()
mongoose.set('strictQuery', false)
connect(dbUrl)
  .then(result => {
    info('connected to MongoDB', result.STATES.connected)
  })
  .catch((err) => {
    error('error connecting to MongoDB:', err.message)
  }).finally()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('data', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :res[content-length] - :response-time ms :data'))


app.use(requestLogger)
app.use('/api', appRouter)
app.use('/api/persons', personRouter)
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)
app.use(unknownEndpoint)
module.exports = app
