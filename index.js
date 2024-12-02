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
    Person.findById(request.params.id)
    .then(person=> {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({error: 'malformatted id'})
    })
})

app.delete('/api/persons/:id', (request,response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(result=> {
            response.status(204).end()
        })
        .catch(error=> next(error))
})

app.post('/api/persons', (request,response,next) => {
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
    newPerson.id = String(Math.floor(Math.random() * 100000))
    newPerson.save()
        .then(savedPerson => {
            console.log('person saved!')
            response.json(savedPerson)
        })
        .catch(error =>next(error))            
  
})

app.put('/api/persons/:id', (request,response,next) => {
    const {name,number} = request.body
    Person.findByIdAndUpdate(request.params.id, {name,number}, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error =>next(error))
})

app.get('/info', async (request, response) => {

    const count = await Person.countDocuments({})     
    const info = `Phonebook has info for ${count} people`
    let timestamp = new Date()
    response.send(info +"<br> <br/>" +timestamp)
}) 


// Error handling middleware has to be placed last!!!
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name==='CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
