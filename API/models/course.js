const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    _id: {
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
    grades: {
        type: Object,
        required: true
    },
});

module.exports = mongoose.model('Course', courseSchema, 'Courses');