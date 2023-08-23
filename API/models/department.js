const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    grades: {
        type: Object,
        required: true
    },
});

module.exports = mongoose.model('Department', departmentSchema, 'Departments');