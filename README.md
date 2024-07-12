# Task Manager API

- This is a simple RESTful API for managing tasks, built with Node.js and Express.js.
- The API allows users to perform CRUD operations (Create, Read, Update, and Delete) on tasks. 
- Each task has a title, description, completion status, priority level, and creation date.

## Project Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/sdshone/task-manager/
    cd task-manager
    ```
2. Install dependencies:

    ```
    npm install
    ```

3. Start the server:

    ```
    node app.js
    ```

- The server will start on port 3000 by default. You can access the API at http://localhost:3000.
- On startup, the tasks are loaded from the file task.json into the tasks array.

## API Endpoints

1. Get All Tasks

    - Endpoint: GET /tasks
    - Description: Retrieve all tasks with optional sorting/ filtering.
    - Query Parameters:
        - sortBy: Sorting parameter. Use "date" for ascending order and "-date" for descending order.
        - completed: Filtering paramter. Use "true" for completed tasks and "false" for incomplete tasks.

    ```bash
    curl "http://localhost:3000/tasks"
    curl "http://localhost:3000/tasks?sortBy=date"
    curl "http://localhost:3000/tasks?sortBy=-date"
    curl "http://localhost:3000/tasks?completed=true"
    curl "http://localhost:3000/tasks?completed=false"
    ```

2. Get Task by ID
    - Endpoint: GET /tasks/:id
    - Description: Retrieve a single task by its ID.

    ```bash
    curl "http://localhost:3000/tasks/1"
    ```

3. Create a task
    - Endpoint: POST /tasks/
    - Description: Create a task.

    ```bash
    curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"New Task","description":"Description of the new task","completed":false,"priority":"medium"}'
    ```


3. Update Task by ID
    - Endpoint: PUT /tasks/:id
    - Description: Update a task by its ID.

    ```bash
    curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title":"Updated Task","description":"Updated description of the task","completed":true,"priority":"high"}'
    ```

4. Delete Task by ID
    - Endpoint: DELETE /tasks/:id
    - Description: Delete a task by its ID.

    ```bash
    curl -X DELETE http://localhost:3000/tasks/1
    ```

5. Get Tasks by Priority Level

    - Endpoint: `GET /tasks/priority/:level`
    - Description: Retrieve tasks based on priority level.
    - Path Parameters
        - `level`: The priority level of the tasks to retrieve. Valid values are `low`, `medium`, and `high`.

    ```bash
    curl http://localhost:3000/tasks/priority/high
    ```