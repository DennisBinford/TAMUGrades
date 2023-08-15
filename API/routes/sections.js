
const router = require("express").Router();
const Section = require("../models/section");

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 100) {
            limit = 100;
        }
        const departmentsearch = req.query.departmentsearch || "";
        const coursesearch = req.query.coursesearch || "";
        const sectionsearch = req.query.sectionsearch || "";
        const professorsearch = req.query.professorsearch || "";
        let sort = req.query.sort || "department";
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
        console.log(sort);

        let sortBy = {};
        if(sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }
        if(sort[3]) {
            sortBy[sort[2]] = sort[3];
        } else {
            sortBy[sort[2]] = "asc";
        }
        if(sort[5]) {
            sortBy[sort[4]] = sort[5];
        } else {
            sortBy[sort[4]] = "asc";
        }
        if(sort[7]) {
            sortBy[sort[6]] = sort[7];
        } else {
            sortBy[sort[6]] = "asc";
        }

        const sections = await Section.find(
            {$and : [
                { department: {$regex: departmentsearch, $options: "i"} },
                { course: {$regex: coursesearch, $options: "i"} },
                { section: {$regex: sectionsearch, $options: "i"} },
                { professor: {$regex: professorsearch, $options: "i"} },
            ]})
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit)

        const total = await Section.countDocuments(
            {$and : [
                { department: {$regex: departmentsearch, $options: "i"} },
                { course: {$regex: coursesearch, $options: "i"} },
                { section: {$regex: sectionsearch, $options: "i"} },
                { professor: {$regex: professorsearch, $options: "i"} },
        ]})

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            sections
        }

        res.status(200).json(response)
    } catch (err) {
        console.log(err);
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

module.exports = router;

