const mongoose = require('mongoose')

const professorSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    professor: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    grades: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Professor', professorSchema, 'Professors');