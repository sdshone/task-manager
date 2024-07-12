const express = require('express');
const validator = require('./validator.js')
const { default: t } = require('tap');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Array to store tasks
let tasks = [
    {
      "id": 1,
      "title": "Set up environment",
      "description": "Install Node.js, npm, and git",
      "completed": true,
      "priority": "high",
      "createdAt": new Date("2024-07-01T10:00:00Z")
    },
    {
      "id": 2,
      "title": "Create a new project",
      "description": "Create a new project using the Express application generator",
      "completed": true,
      "priority": "high",
      "createdAt": new Date("2024-07-02T10:00:00Z")
    },
    {
      "id": 3,
      "title": "Install nodemon",
      "description": "Install nodemon as a development dependency",
      "completed": true,
      "priority": "low",
      "createdAt": new Date("2024-07-03T10:00:00Z")
    },
    {
      "id": 4,
      "title": "Install Express",
      "description": "Install Express",
      "priority": "medium",
      "completed": false,
      "createdAt": new Date("2024-07-04T10:00:00Z")
    },
    {
      "id": 5,
      "title": "Install Mongoose",
      "description": "Install Mongoose",
      "priority": "low",
      "completed": false,
      "createdAt": new Date("2024-07-05T10:00:00Z")
    },
]

// The length of tasks doesn't always work correctly as we might delete some old tasks
// This method guarantees we will always have unused ID.
let task_id_counter = tasks.reduce((accumulator, currentValue) => {
    return Math.max(accumulator, currentValue);
}, tasks[0]);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


app.get('/tasks/priority/:level', (req, res) => {
    const { level } = req.params;

    if (["high", "medium", "low"].includes(level)) {
        const result = tasks.filter(task => task.priority === level);
        res.send(result);
    } else {
        res.status(404).send('Invalid level. Valid options are low/medium/high.')
    }
    
});

app.get("/tasks", (req, res) =>{
    const { sortBy = '', completed = '' } = req.query;
    let result = [...tasks];

    if (completed === 'true') {
        result = tasks.filter(task => task.completed === true);
    }
    else if (completed === 'false') {
        result = tasks.filter(task => task.completed === false);
    }

    if (sortBy === 'date') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === '-date') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.send(result);
})

app.get("/tasks/:id", (req, res) =>{
    const id = req.params.id
    const task = tasks.find(task =>  task.id === parseInt(id));
    if (!task) {
        res.status(404).send('The task with that ID does not exist.');
    }
    res.send(task)
})

app.post("/tasks", (req, res) => {
    const task = req.body

    // Input validation for task creation. 
    // Validate that the title and description are not empty, and that the completion status is a boolean value.
    validator_output = validator.task_structure_validation(task)
    if (validator_output === "All inputs valid.") {
        task_id_counter += 1;
        task.id = task_id_counter;
        task.createdAt =  new Date().toISOString();
        tasks.push(task);
        res.status(201).send(task);
    } else {
        res.status(400).send(validator_output)
    }

})

app.put("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const task = tasks.find(task =>  task.id === parseInt(id));
    if (task) {
        // Input validation for task creation. 
        // Validate that the title and description are not empty, and that the completion status is a boolean value.
        validator_output = validator.task_structure_validation(req.body);
        if (validator_output === "All inputs valid.") {
            const {title, description, completed } = req.body
            task.title = title;
            task.description = description;
            task.completed = completed;
            res.send(task);
        } else {
            res.status(400).send(validator_output);
        }
    } else {
        res.status(404).send('The task with that ID does not exist.')
    }




})

app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const task = tasks.find(task =>  task.id === parseInt(id));
    if (task) {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
        res.send(task);
    } else {
        res.status(404).send('The task with that ID does not exist.')
    }
})

module.exports = app;