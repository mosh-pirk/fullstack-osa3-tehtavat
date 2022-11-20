const express = require('express')
const morgan = require('morgan');
const app = express()
const cors = require('cors')
const Persons = require('./models/perosn')
const {request, response} = require("express");

app.use(express.static('build'))
app.use(cors())

morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :res[content-length] - :response-time ms :data'));

app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hello Person App!</h1>')
})

// get all persons
app.get('/api/persons', (req, res) => {
    Persons.find({}).then(data => res.json(data))
})
// add person
app.post('/api/persons', (request, response, next) => {
    const savedData = new Persons(returnPersonObject(request, response, false))
    savedData.save()
        .then(person => {
           response.json(person).status(200)
        })
        .catch(error => next(error))
})
// delete one person
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Persons.findByIdAndDelete(id).then(result => {
       response.status(204).end()
    }).catch(error => next(error))

})
// get one person
app.get('/api/persons/:id', (request, response, next) => {
    Persons.findById(request.params.id)
        .then(data => {
            response.status(200).json(data)
        }).catch(error => next(error))
})
// edit person
app.put('/api/persons/:id', (request, response, next) => {
    Persons.findByIdAndUpdate(request.params.id, returnPersonObject(request, response, true))
        .then(data => {
            response.status(200).json(data)
        }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error})
    }
    next(error)
}


const returnPersonObject = (request, response, edit) => {
    const body = request.body
    return edit
        ?
        {number: body.number}
        : {
            name: body.name,
            number: body.number,
        }
}

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
