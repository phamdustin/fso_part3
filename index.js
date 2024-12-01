require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')



app.use(express.static('dist')) // whenever a GET request comes, it will check dist directory and return
app.use(express.json()) // without this, body property of POST request would be undefined
app.use(cors()) // allows for frontend to access data from a different PORT

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    console.log("grabbing list of people from database")
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
/*     var same = persons.find(function(person) {
        return person.name.toString().toLowerCase() === newPerson.name.toString().toLowerCase()
    })
    if (same) {
        console.log("Found!")
        return response.status(400).json({
            error: 'name must me unique'
        })
    } */
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
