const mongoose = require('mongoose')

if (process.argv.length < 4) {
    console.log('give a address and password for mongo')
    process.exit(1)
}

const address = process.argv[2]
const password = process.argv[3]
const name = process.argv[4]
const number = process.argv[5]

const url = `mongodb+srv://mosh-fullstck:${password}@${address}/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})


const Person = mongoose.model('persons', personSchema)

const person = new Person({
    'name': name,
    'number': number
})

person.save().then(data => {
    console.log(data.name, 'saved')
    mongoose.connection.close()
})

Person.find({}).then(data => {
    console.log('phonebook:')
    data.forEach(person => {
        console.log(person.name, person.number)
    })
    mongoose.connection.close()
})
