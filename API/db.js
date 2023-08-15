const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose.connect(process.env.DB) // need a .env folder with DB variable set to string of MongoDB connection url (private for security)

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB successfully!");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Error while connecting to database!");
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Disconnected from MongoDB successfully!");
    });
};

module.exports = dbConnect;
