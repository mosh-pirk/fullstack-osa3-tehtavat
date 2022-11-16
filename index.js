const express = require('express')
const morgan = require('morgan');
const app = express()
const cors = require('cors')
const Persons = require('./models/perosn')

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
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
    }
    const savedData = new Persons(person)
    savedData.save()
        .then(person => {
            response.json(person).status(200)
        })
        .catch(err => response.status(400))
})
// delete one person
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Persons.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    }).catch(err => response.status(400).send(err.name))

})
// get one person
app.get('/api/persons/:id', (request, response) => {
    Persons.findById(request.params.id).then(data => response.status(200).json(data))
})
// get one person
app.put('/api/persons/:id', (request, response) => {
    Persons.findById(request.params.id).then(data => response.status(200).json(data))
})
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
