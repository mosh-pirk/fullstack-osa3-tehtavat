const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const { info, error } = require('./utils/logger')
const { PORT } = require('./utils/conf')
const { personRouter } = require('./controllers/person')
const { appRouter } = require('./controllers/app')
const { errorHandler, unknownEndpoint, requestLogger } = require('./utils/middleware')
const { connect } = require('mongoose')
const { blogsRouter } = require('./controllers/blogs')

app.use(express.static('build'))
app.use(cors())

//@ts-ignore
const dbUrl = process.env.MONGODB_URI

connect(dbUrl)
  .then(result => {
    info('connected to MongoDB', result.STATES.connected)
  })
  .catch((err) => {
    error('error connecting to MongoDB:', err.message)
  }).finally()

morgan.token('data', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :res[content-length] - :response-time ms :data'))

app.use(express.json())
app.use(requestLogger)
app.use('/api', appRouter)
app.use('/api/persons', personRouter)
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)
app.use(unknownEndpoint)

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})
