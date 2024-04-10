const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    task: {
        type:String,
        required : true
    },
    done: {
        type: Boolean,
        default: false
    }
});

const TodoModel = mongoose.model("todo",TodoSchema)
module.exports = TodoModel