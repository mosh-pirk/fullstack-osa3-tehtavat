const express = require('express')
const morgan = require('morgan');
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())

morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :res[content-length] - :response-time ms :data'));


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abremov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
    {
        id: 5,
        name: "Koodiin Tapahtuu muutoksia  ",
        number: "40-25-6423911"
    }
]

app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hello Person App!</h1>')
})
app.get('/info', (req, res) => {
    const count = persons && persons.length
    const today = new Date();

    res.send(`<div> <h3>Phonebook has info for ${count} people</h3> <h3>${today}</h3></div>`)
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

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

    const findByName = (name) => persons.find(x => x.name === name);

    if (findByName(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(x => x.id !== id)

    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(x => x.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).send('person not found').end()
    }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
