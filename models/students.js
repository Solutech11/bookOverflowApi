const mongoose = require("mongoose")

const Schema =mongoose.Schema;

const students = new Schema({
    Username:String,
    Password:String,
    email:String,
    school:String,
    imageLocation:String,
    Verification:Boolean,
    verifCode:String,
    resetCode:String
})

const Student = mongoose.model("StudentDetail",students);

module.exports= Student;