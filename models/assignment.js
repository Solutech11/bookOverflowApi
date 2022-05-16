const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Assignment = new Schema({
    name: String,
    subject: String,
    topic: String,
    grade: String,
    bookLocation: String,
    bookDescription: String,
    userid: String,
});

const assignment= mongoose.model("StudentAssignment", Assignment);

module.exports= assignment;