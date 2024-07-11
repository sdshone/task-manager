const express = require('express');
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
      "completed": true
    },
    {
      "id": 2,
      "title": "Create a new project",
      "description": "Create a new project using the Express application generator",
      "completed": true
    },
    {
      "id": 3,
      "title": "Install nodemon",
      "description": "Install nodemon as a development dependency",
      "completed": true
    },
    {
      "id": 4,
      "title": "Install Express",
      "description": "Install Express",
      "completed": false
    },
    {
      "id": 5,
      "title": "Install Mongoose",
      "description": "Install Mongoose",
      "completed": false
    },
  ]

// The length of tasks doesn't always work correctly as we might delete some old tasks
// This method guarantees we will always have unused ID.
task_id_counter = tasks.reduce((accumulator, currentValue) => {
    return Math.max(accumulator, currentValue);
}, tasks[0]);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


app.get("/tasks", (req, res) =>{
    res.send(tasks);
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
    if (!('title' in task) || !('description' in task) || !('completed' in task))  {
        res.status(400).send("Invalid data for new task. Please send title, description and completed.");
    }
    if (typeof(task.title) !== 'string') {
        res.status(400).send(`Task title type cannot be of type ${typeof(task.title)}. Expected string.`)
    }
    if (typeof(task.description) !== 'string') {
        res.status(400).send(`Task description cannot be of type ${typeof(task.description)}. Expected string.`)
    }
    if (typeof(task.completed) !== 'boolean') {
        res.status(400).send(`Task completed cannot be of type ${typeof(task.completed)}. Expected boolean.`)
    }
    if (task.title === '') {
        res.status(400).send('Task title cannot be empty.')
    }
    if (task.description === '') {
        res.status(400).send('Task description cannot be empty.')
    }

    task_id_counter += 1;
    task.id = task_id_counter;
    
    tasks.push(task);
    res.status(201).send(task);
})

app.put("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const task = tasks.find(task =>  task.id === parseInt(id));
    if (!task) {
        res.status(404).send('The task with that ID does not exist.')
    }
    const { title, description, completed } = req.body;
    task.title = title;
    task.description = description;
    task.completed = completed;
    res.send(task);
})

app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const task = tasks.find(task =>  task.id === parseInt(id));
    if (!task) {
        res.status(404).send('The task with that ID does not exist.')
    }
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    res.send(task);
})

module.exports = app;