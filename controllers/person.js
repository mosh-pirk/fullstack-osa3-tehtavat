const personsRouter = require('express').Router()
const Persons = require('../models/person')

// get all persons
personsRouter.get('', (req, res) => {
  Persons.find({}).then(data => res.json(data))
})
// add person
personsRouter.post('', (request, response, next) => {
  const savedData = new Persons(returnPersonObject(request, response, false))
  savedData.save()
    .then(person => {
      response.json(person).status(200)
    })
    .catch(error => next(error))
})
// delete one person
personsRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Persons.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))

})
// get one person
personsRouter.get('/:id', (request, response, next) => {
  Persons.findById(request.params.id)
    .then(data => {
      response.status(200).json(data)
    }).catch(error => next(error))
})
// edit person
personsRouter.put('/:id', (request, response, next) => {
  Persons.findByIdAndUpdate(request.params.id, returnPersonObject(request, response, true))
    .then(data => {
      response.status(200).json(data)
    }).catch(error => next(error))
})

const returnPersonObject = (request, response, edit) => {
  const body = request.body
  return edit
    ?
    { number: body.number }
    : {
      name: body.name,
      number: body.number,
    }
}

module.exports = { personRouter: personsRouter }
