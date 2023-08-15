const router = require("express").Router();
const Section = require("../models/section");

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 100) {
            limit = 100;
        }
        const search = req.query.search || "";
        let sort = req.query.sort || "department";
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
        console.log(sort);

        let sortBy = {};
        if(sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }

        const sections = await Section.find({ department: {$regex: search, $options: "i"} })
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit)

        const total = await Section.countDocuments({
            department: { $regex: search, $options: "i" }
        })

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

