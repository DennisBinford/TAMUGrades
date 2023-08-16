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

app.use("/", allRoutes);
app.use("/courses", courseRoutes);
app.use("/professors", professorRoutes);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));





