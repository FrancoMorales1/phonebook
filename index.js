const express = require('express')
const cors = require('cors')
const process = require('node:process')

const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const morgan = require('./middleware/morgan')

require('dotenv').config()

require('./db/mongo')

const Person = require('./db/models/Person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan)
app.use(express.static('build'))

app.get('/', (request, response) => {
    response.send('./index.html')
})

app.get('/info', (request, response, next) => {
    Person.find({})
        .then((result) => {
            response.send(`<p>Phonebook has info for ${result.length} people</p>
        <p>${new Date().toISOString()}</p>`)
        })
        .catch((error) => next(error))
})

app.get('/api/persons/', (request, response, next) => {
    Person.find({})
        .then((persons) => {
            response.json(persons)
        })
        .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const { id } = request.params
    Person.findById(id)
        .then((person) => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch((err) => {
            next(err)
            console.log(err)
            response.status(400).end()
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    const { id } = request.params
    Person.findByIdAndDelete(id)
        .then((result) => {
            response.status(200).json(result)
        })
        .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const person = request.body
    if (!person || !person.name || !person.phone) {
        response.status(400).json({
            error: 'person name or person phone is missing',
        })
    }
    Person.find({ name: person.name })
        .then((result) => {
            if (result.length !== 0) {
                response.status(403).json({ error: 'Name must be unique' })
            } else {
                const newPerson = new Person({
                    name: person.name,
                    phone: person.phone,
                })
                newPerson.save().then((result) => {
                    response.status(201).json(result)
                })
            }
        })
        .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { id } = request.params
    const person = request.body
    const newPersonInfo = {
        name: person.name,
        phone: person.phone,
    }
    Person.findByIdAndUpdate(id, newPersonInfo, { new: true })
        .then((result) => {
            response.status(200).json(result)
        })
        .catch((error) => next(error))
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
