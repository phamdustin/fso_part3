const express = require('express')
const app = express()

app.use(express.json()) // without this, body property of POST request would be undefined

let persons =[
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
]

let info = `Phonebook has info for ${persons.length} people`

app.get('/', (request, response) => {
    response.send('<h1>Hellow World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request,response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id
    person = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request,response) => {
    const person = request.body
    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'Content missing'
        })
    }
    person.id = String(Math.floor(Math.random() * 100000))
    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    let timestamp = new Date()
    response.send(info +"<br> <br/>" +timestamp)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
