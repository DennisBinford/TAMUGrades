require('dotenv').config();
const express = require('express');
const cors = require("cors");
const dbConnect = require("./db");
const courseRoutes = require("./routes/courses")
const professorRoutes = require("./routes/professors")
const allRoutes = require("./routes/all")
const app = express();

dbConnect();

app.use(express.json());
app.use(cors());

app.use(pagination)

app.use("/", allRoutes);
app.use("/courses", courseRoutes);
app.use("/professors", professorRoutes);


function pagination(req, res, next) {
    let page = parseInt(req.query.page) - 1 || 0;
    let limit = parseInt(req.query.limit) || 1000;
    if (limit > 10000) {
        limit = 10000;
    }
    req.page = page
    req.limit = limit
    if (page < 0) {
        res.status(404).json({error: true, message: "Page Out of Bounds"})
    }
    else {
        next()
    }
}


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));




