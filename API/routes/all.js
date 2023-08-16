
const router = require("express").Router();
const Section = require("../models/section");

router.get("/", async (req, res) => {
    try {
        const sections = await Section.find()

        res.status(200).json(sections)

    } catch (err) {
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

module.exports = router;

