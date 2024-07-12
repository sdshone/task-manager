const fs = require('node:fs');
const express = require('express');
const validator = require('./validator.js')
const { default: t } = require('tap');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasksPath = './task.json';

// Initialize tasks and task_id_counter variables
let tasks = [];
let task_id_counter = 0;

fs.readFile(tasksPath, (err, data) => {
    if (err) {
        console.error('Error reading tasks file:', err);
        return;
    }
    tasks = JSON.parse(data).tasks;
    console.log('Tasks loaded from file:', tasks);

    // Calculate task_id_counter after tasks are loaded
    task_id_counter = tasks.reduce((accumulator, task) => {
        return Math.max(accumulator, parseInt(task.id));
    }, 0); // Start counting from the next number

    console.log('Task ID counter:', task_id_counter);
});


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
    validator_output = validator.task_structure_validation(task);
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