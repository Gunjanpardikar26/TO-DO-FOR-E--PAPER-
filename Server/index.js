const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const TodoModel = require('./Models/Todo')

const app = express()
app.use(cors({
  origin: ["https://to-do-for-e-paper-gg4f-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/test')
app.get("/", (req,res) => {
    res.json("hello");
});
app.get('/get', (req,res ) =>{
    TodoModel.find()
    .then(result =>res.json(result))
    .catch(err => res.status(500).json({error: err.message}));
});

app.put('/update/:id', (req,res) => {
    const {id} = req.params;
    const { done } = req.body;
    TodoModel.findByIdAndUpdate({_id: id}, {done: done})
    .then(result =>res.json(result))
    .catch(err => res.status(500).json({error: err.message}));
});

app.delete('/delete/:id', (req,res) => {
    const {id} = req.params;
    TodoModel.findByIdAndDelete({_id: id})
    .then(result =>res.json(result))
    .catch(err => res.status(500).json({error: err.message}));
});
app.post('/add', (request ,response) => {
    const task = request.body.task;
    TodoModel.create({
        task : task,
        done: false
    })
    .then(result => response.json(result))
    .catch(err => response.status(500).json({error: err.message}));
});

app.get('/tasks/first', (req, res) => {
    // Find the first task that is marked as true, sorted to ensure order
    TodoModel.findOne({ done: true }) // Adjust the query to search for tasks where 'done' is true
        .sort({ _id: 1 }) // Sorting by _id. Adjust if needed (e.g., createdAt or another field)
        .then(task => {
            if (!task) {
                // Responding with a 404 if no tasks matching the criteria are found
                // return res.status(404).json({ message: "No tasks found with the specified condition." });
                return res.json(false);
            }
            // Sending back the first task found that matches the criteria
            res.json(task);
        })
        .catch(err => {
            // Error handling for any issues with the query
            res.status(500).json({ error: err.message });
        });
})


app.put('/replace/:id', (req, res) => {
    const { id } = req.params;
    const newTaskDetails = req.body; // Extract new task details from request body
    newTaskDetails.done = false;
    TodoModel.findByIdAndUpdate(id, newTaskDetails, { new: false }) // Return the updated document
        .then(updatedTask => {
            if (!updatedTask) {
                return res.status(404).json({ message: "Task not found with id " + id });
            }
            res.json(updatedTask);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

//const PORT = process.env.PORT || 3000; // Default to port 3000 if not specified by the environment

app.listen(3001, () => {
    console.log(`Server is running on port ${PORT}`);
});
