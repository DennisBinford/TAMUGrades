
const router = require("express").Router();
const Section = require("../models/section");

router.get("/:professor", async (req, res) => {
    try {
        let page = req.page
        let limit = req.limit

        let findBy = {'professor' : req.params.professor.toUpperCase()};

        const sections = await Section
            .find(findBy)
            .skip(page * limit)
            .limit(limit)
        
        const total = await Section.countDocuments(findBy)

        const departments = await Section.distinct('department', findBy)

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            departments,
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

