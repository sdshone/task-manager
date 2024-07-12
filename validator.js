module.exports = 
{
    task_structure_validation: function (task) {

        if (!('title' in task) || !('description' in task) || !('completed' in task))  {
            return "Invalid data for task. Please send title, description and completed."
        }
        if (typeof(task.title) !== 'string') {
            return `Task title type cannot be of type ${typeof(task.title)}. Expected string.`
        }
        if (typeof(task.description) !== 'string') {
            return `Task description cannot be of type ${typeof(task.description)}. Expected string.`
        }
        if (typeof(task.completed) !== 'boolean') {
            return `Task completed cannot be of type ${typeof(task.completed)}. Expected boolean.`
        }
        if (task.title === '') {
            return "Task title cannot be empty."
        }
        if (task.description === '') {
            return "Task description cannot be empty."
        }
        return "All inputs valid."
    }
};

