const mongoose = require('mongoose')

const sectionSchema = new mongoose.Schema({
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
    semester: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    professor: {
        type: String,
        required: true
    },
    grades: {
        type: Array,
        required: true
    },
});

module.exports = mongoose.model('Section', sectionSchema, 'Sections');