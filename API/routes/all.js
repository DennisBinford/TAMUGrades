
const router = require("express").Router();
const Section = require("../models/section");

router.get("/", async (req, res) => {
    try {
        const page = req.page
        const limit = req.limit

        const department = req.query.department || '';
        const course = req.query.course || '';
        const section = req.query.section || '';
        const professor = req.query.professor || '';
        let sort = req.query.sort || "department";
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        sort[1] ? sortBy[sort[0]] = sort[1] : sortBy[sort[0]] = "asc";
        sort[3] ? sortBy[sort[2]] = sort[3] : sortBy[sort[2]] = "asc";
        sort[1] ? sortBy[sort[5]] = sort[5] : sortBy[sort[4]] = "asc";
        sort[1] ? sortBy[sort[7]] = sort[7] : sortBy[sort[6]] = "asc";

        let findBy = [
            {'department' : {$regex: department, $options: "i"}}, 
            {'course' : {$regex: course, $options: "i"}},
            {'section' : {$regex: section, $options: "i"}},
            {'professor' : {$regex: professor, $options: "i"}}];

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

