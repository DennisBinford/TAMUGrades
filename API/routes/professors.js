
const router = require("express").Router();
const Professor = require("../models/professor");
const Section = require("../models/section");

router.get("/", async (req, res) => {
    try {
        let page = req.page
        let limit = req.limit

        const professors = await Professor.find().distinct('professor')
        
        const total = professors.length

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            professors
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
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

router.get("/:professor", async (req, res) => {
    try {
        let page = req.page
        let limit = req.limit

        let findByProfessor = {'professor' : {$regex: req.params.professor, $options: "i"}, "type" : "department"};

        const professors = await Professor.find(findByProfessor)
            .skip(page * limit)
            .limit(limit)
        
        const total = await Professor.countDocuments(findByProfessor)

        const departments = await Professor.find(findByProfessor).distinct('department')

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            professors,
            departments
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
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

router.get("/:professor/:department", async (req, res) => {
    try {
        let page = req.page
        let limit = req.limit

        let findProfessorCourses = {'professor' : {$regex: req.params.professor, $options: "i"}, 'department' : {$regex: req.params.department, $options: "i"}, "type" : "course"}

        const professors = await Professor.find(findProfessorCourses)
            .skip(page * limit)
            .limit(limit)
        
        const total = await Professor.countDocuments(findProfessorCourses)

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            professors
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
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

router.get("/:professor/:department/:course", async (req, res) => {
    try {
        let page = req.page
        let limit = req.limit

        let findProfessorCourseSections = {'professor' : {$regex: req.params.professor, $options: "i"}, 'department' : {$regex: req.params.department, $options: "i"}, 'course' : {$regex: req.params.course, $options: "i"}}

        const sections = await Section.find(findProfessorCourseSections)
            .skip(page * limit)
            .limit(limit)
        
        const total = await Professor.countDocuments(findProfessorCourseSections)

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            sections // FIXME: naming scheme fix needed
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
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

module.exports = router;

