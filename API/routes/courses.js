
const router = require("express").Router();
const Department = require("../models/department");
const Course = require("../models/course");

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 100;
        if (limit > 1000) {
            limit = 1000;
        }

        const departments = await Department.find().distinct('department')
        const courses = await Course.find().distinct('course')
        
        const total = await Department.countDocuments()
    

        const response = { 
            error: false,
            total,
            page: page + 1,
            limit,  
            departments,
            courses
        }

        if (total === 0) {
            res.status(404).json({error: true, message: "No Section Found"})
        }
        else if ((total - page * limit) <= 0) {
            res.status(404).json({error: true, message: "Page Out of Bounds"})
        }
        else {
            res.status(200).json(response)
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

router.get("/:department", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 100;
        if (limit > 1000) {
            limit = 1000;
        }

        let filterByDepartment = {'department' : {$regex: req.params.department, $options: "i"}};

        const departments = await Department.find(filterByDepartment)
            .skip(page * limit)
            .limit(limit)
        const courses = await Course.find(filterByDepartment).distinct('course')
        
        const total = await Department.countDocuments(filterByDepartment)
    

        const response = { 
            error: false,
            total,
            page: page + 1,
            limit,  
            departments,
            courses
        }

        if (total === 0) {
            res.status(404).json({error: true, message: "No Section Found"})
        }
        else if ((total - page * limit) <= 0) {
            res.status(404).json({error: true, message: "Page Out of Bounds"})
        }
        else {
            res.status(200).json(response)
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

router.get("/:department/:course", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 100;
        if (limit > 1000) {
            limit = 1000;
        }

        let filterByDepartment = {'department' : {$regex: req.params.department, $options: "i"}, 'course' : {$regex: req.params.course, $options: "i"}};

        const courses = await Course.find(filterByDepartment)
            .skip(page * limit)
            .limit(limit)
        
        const total = await Course.countDocuments(filterByDepartment)
    

        const response = { 
            error: false,
            total,
            page: page + 1,
            limit,  
            courses
        }

        if (total === 0) {
            res.status(404).json({error: true, message: "No Section Found"})
        }
        else if ((total - page * limit) <= 0) {
            res.status(404).json({error: true, message: "Page Out of Bounds"})
        }
        else {
            res.status(200).json(response)
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

module.exports = router;

