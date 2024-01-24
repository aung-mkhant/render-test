const express = require('express');
const morgan = require('morgan');
var cors = require('cors')
const {json} = require("express");
const app = express();
app.use(cors())
app.use(express.json());
morgan.token('personData', (req,res) => {
    return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personData'));


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.get('/api/persons', (req,res) => {
    res.json(persons);
})

app.get('/info', (req,res) => {

    const currentDate = new Date();

// Get day, month, year, hours, minutes, and seconds
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'short' });
    const month = currentDate.toLocaleString('en-US', { month: 'short' });
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();


// Format the date and time
    const formattedDateTime = `${dayOfWeek} ${month} ${day} ${year} ${hours}:${minutes}:${seconds} GMT+${currentDate.getTimezoneOffset() / -60} (Eastern Asia Standard Time)`;


    const responseText = `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${formattedDateTime}</p>
        </div>`
    res.send(responseText);

})

app.get('/api/persons/:id', (req,res) => {
    const person = persons.find(person => person.id === Number(req.params.id));

    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req,res) => {
    persons = persons.filter(person => person.id !== Number(req.params.id));

    res.json(persons);
})
app.put('/api/persons/:id', (req, res) => {
    const people = persons.filter(person => person.id !== Number(req.params.id));
    persons = [{...req.body},...people,  ];
    res.json(persons);
})


const generateID = () => {
    const maxID = Math.max(...persons.map(person => person.id));
    return maxID + 1;
}

app.post('/api/persons/', (req,res) => {
    const body = req.body;
    if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        });
    }else if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        });
    }

    const existingPerson = persons.find(person => person.name === req.body.name);
    if (existingPerson){
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateID()
    }
    persons = [...persons, person];
    res.json(persons);
})

