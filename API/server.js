require('dotenv').config();
const express = require('express');
const cors = require("cors");
const dbConnect = require("./db");
const sectionRoutes = require("./routes/sections")
const app = express();

dbConnect();

app.use(express.json());
app.use(cors());

app.use("/sections", sectionRoutes);


const port = process.env.port || 8080;
app.listen(port, () => console.log('Listening on port'));





