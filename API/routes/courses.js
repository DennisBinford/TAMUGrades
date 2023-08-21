
const router = require("express").Router();
const Section = require("../models/section");

router.get("/:department", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 100;
        if (limit > 1000) {
            limit = 1000;
        }
        let sort = req.query.sort || "department";
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        sort[1] ? sortBy[sort[0]] = sort[1] : sortBy[sort[0]] = "asc";
        sort[3] ? sortBy[sort[2]] = sort[3] : sortBy[sort[2]] = "asc";
        sort[1] ? sortBy[sort[5]] = sort[5] : sortBy[sort[4]] = "asc";
        sort[1] ? sortBy[sort[7]] = sort[7] : sortBy[sort[6]] = "asc";

        let filterByDepartment = {'department' : {$regex: req.params.department, $options: "i"}};

        const sections = await Section.find(filterByDepartment)
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit)
        
        const total = await Section.countDocuments(filterByDepartment)

        // const course_numbers = await Section.distinct('course', filterByDepartment)
        let courses = await Section.aggregate([ 
            { $unwind: "$grades" },
            {$group: {_id: {department : "$department", course : "$course"}, numberofAs: {$sum:{ 
                "$arrayElemAt": [ "$x", 2 ] 
            }}, count: {$sum:1}}}]);

        console.log(courses)
    

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
        else if ((total - (page+1) * limit) <= 0) {
            res.status(404).json({error: true, message: "Page Out of Bounds"})
        }
        else {
            res.status(200).json(response)
        }

    } catch (err) {
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

        // FIXME: add page bound logic

        let search = req.query.search || "";
        req.query.search ? (search = req.query.search.split(",")) : (search = ["department"]);
        let sort = req.query.sort || "department";
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        sort[1] ? sortBy[sort[0]] = sort[1] : sortBy[sort[0]] = "asc";
        sort[3] ? sortBy[sort[2]] = sort[3] : sortBy[sort[2]] = "asc";
        sort[1] ? sortBy[sort[5]] = sort[5] : sortBy[sort[4]] = "asc";
        sort[1] ? sortBy[sort[7]] = sort[7] : sortBy[sort[6]] = "asc";

        let findBy = [{'department' : {$regex: req.params.department, $options: "i"}}, {'course': {$regex: req.params.course, $options: "i"}}];
        search[1] ? search2 = search[0] : search2 = 'section';
        search[3] ? search3 = search[2] : search3 = 'professor';

            
        if (search[1]) {
            findBy[2] = {[`${search1}`]: {$regex: search[1], $options: "i"}}
        }
    
        if (search[3]) {
            findBy[2] = {[`${search2}`]: {$regex: search[3], $options: "i"}}
        }

        const sections = await Section.find(
            {$and : findBy})
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit)
        
        const total = await Section.countDocuments(
            {$and : findBy})

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            sections
        }

        total === 0 ? res.status(404).json({error: true, message: "No Section Found"}) : res.status(200).json(response)

    } catch (err) {
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

module.exports = router;

