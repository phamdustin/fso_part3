const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person')


// Grabbing URL from .env file and connecting to the database
const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


morgan.token('data', function getData(req) {
    return JSON.stringify(req.body)
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.json()) // without this, body property of POST request would be undefined
app.use(cors()) // allows for frontend to access data from a different PORT
app.use(express.static('dist')) // whenever a GET request comes, it will check dist directory and return

/* let persons =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
] */

//let info = `Phonebook has info for ${persons.length} people`

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request,response) => {
    Person.findById(request.params.id).then(person=> {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id
    person = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request,response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or Number is missing'
        })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    var same = persons.find(function(person) {
        return person.name.toString().toLowerCase() === newPerson.name.toString().toLowerCase()
    })
    if (same) {
        console.log("Found!")
        return response.status(400).json({
            error: 'name must me unique'
        })
    }
    newPerson.id = String(Math.floor(Math.random() * 100000))
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
    
})

/* app.get('/info', (request, response) => {
    let timestamp = new Date()
    response.send(info +"<br> <br/>" +timestamp)
}) */

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
