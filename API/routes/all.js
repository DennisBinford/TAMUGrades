
const router = require("express").Router();
const Section = require("../models/section");

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 1000;
        if (limit > 10000) {
            limit = 10000;
        }
        let search = req.query.search || "";
        req.query.search ? (search = req.query.search.split(",")) : (search = ["department"]);
        let sort = req.query.sort || "department";
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        sort[1] ? sortBy[sort[0]] = sort[1] : sortBy[sort[0]] = "asc";
        sort[3] ? sortBy[sort[2]] = sort[3] : sortBy[sort[2]] = "asc";
        sort[1] ? sortBy[sort[5]] = sort[5] : sortBy[sort[4]] = "asc";
        sort[1] ? sortBy[sort[7]] = sort[7] : sortBy[sort[6]] = "asc";

        let findBy = [];
        search[1] ? search0 = search[0] : search0 = 'department';
        search[3] ? search1 = search[2] : search1 = 'course';
        search[5] ? search2 = search[4] : search2 = 'section';
        search[7] ? search3 = search[6] : search3 = 'professor';

        search[1] ? findBy[0] = {[`${search0}`] : {$regex: search[1], $options: "i"}} : findBy = [{'department' : {$regex: '', $options: "i"}}]
    
        if (search[3]) {
            findBy[1] = {[`${search1}`]: {$regex: search[3], $options: "i"}}
        }
        if (search[5]) {
            findBy[2] = {[`${search2}`] : {$regex: search[5], $options: "i"}}
        }
        if (search[7]) {
            findBy[3] = {[`${search3}`] : {$regex: search[7], $options: "i"}}
        }

        const sections = await Section.find(
            {$and : findBy})
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit)
        
        const total = await Section.countDocuments(
            {$and : findBy})

        const departments = await Section.distinct('department')
        const professors = await Section.distinct('professor')

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            departments,
            professors,
            sections
        }

        total === 0 ? res.status(404).json({error: true, message: "No Section Found"}) : res.status(200).json(response)

    } catch (err) {
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

module.exports = router;

