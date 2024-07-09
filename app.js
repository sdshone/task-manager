const express = require('express');
const { default: t } = require('tap');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Array to store tasks
tasks = [
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
  const id = req.params.id;
  const task = tasks.find(task =>  task.id === parseInt(id));
  if (!task) {
      res.status(404).send('The task with that ID does not exist.');
  }
  res.send(task);
})

app.post("/tasks", (req, res) => {
  const task = req.body
  task.id = tasks.length + 1;
  tasks.push(task);
  res.send(task);
})

module.exports = app;