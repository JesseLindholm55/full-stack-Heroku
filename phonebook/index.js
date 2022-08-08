const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const app = express()
const cors = require('cors')



app.use(cors())

let accessLogStream = fs.createWriteStream(path.join(
  'access.log'), { flags: 'a' })
app.use(morgan('tiny', {stream: accessLogStream}))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())

app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1><div>Heroku test J.L</div><div>Full stack open course backend</div>')
})

app.get('/api/info', (request, response) => {
  let time = new Date()
  response.send(
    `<div>Phonebook has info for ${persons.length} people</div>
     <div>${time}</div>`
  )
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
}
)

const generateId = () => {
    return parseInt(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name is missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number is missing' 
    })
  }
  for (let i = 0; i < persons.length; i++) {
    const element = persons[i];
    if (element.name == body.name) {
      return response.status(422).json({
        error: 'Name needs to be unique'
      })
    }
    
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

