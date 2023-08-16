
const router = require("express").Router();
const Section = require("../models/section");

router.get("/:professor", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 100;
        if (limit > 1000) {
            limit = 1000;
        }

        let findBy = [{'professor' : {$regex: req.params.professor, $options: "i"}}];

        const sections = await Section.find(
            {$and : findBy})
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit)
        
        const total = await Section.countDocuments(
            {$and : findBy})

        const departments = await Section.distinct('department')

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            departments,
            sections
        }

        total === 0 ? res.status(404).json({error: true, message: "No Section Found"}) : res.status(200).json(response)

    } catch (err) {
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

module.exports = router;

