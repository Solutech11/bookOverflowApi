//initializing express
const express = require('express');
const app =express();

//parsing data
const bodyParser =require('body-parser');
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(bodyParser.json({limit: '20mb', extended: true}))


const https= require('https')
//setting up static folder
app.use(express.static(__dirname+'static'));
// app.use(express.static(__dirname+'images'))


//requiring download
const download = require('download')
// 

//email
const mailer = require('nodemailer');
const myEmail = mailer.createTransport({
    service:'gmail',
    auth: {
        user:'soludorex@gmail.com',
        pass: 'Xerewgida1$'
    }
});

//otp generator
function otpPin() {
    const digit ='0123456789';
    let otp='';
    for (let i =0; i<4; i++){
        otp += digit[Math.floor(Math.random()*10)]
    }

    return otp;
}


//accepting pdf
const fileupload = require('express-fileupload');
app.use(fileupload({createParentPath:true}))


//server port
const port = process.env.PORT || 5000

//cross origin resource sharing
const cors = require("cors")
app.use(cors())


//http logging request
const morgan = require('morgan')
app.use(morgan('dev'))


//library for array number object
const _ =require('lodash')

//datbase
const mongoose = require('mongoose');
//requirng student model
const Student = require('./models/students');
//requiring assignment model
const assignment = require('./models/assignment');
// const { json } = require('express/lib/response');


//views engine
app.set('view engine','ejs')
// const assignment = require('./models/assignment');

mongoose.connect('mongodb+srv://soludo:xerewgida@studenass.7efor.mongodb.net/studenAss?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true}).then((result)=>{
    if (result){
        console.log("db connected");

        app.listen(port,()=>{
            console.log("http://localhost:5000/");
        })
    }
}).catch((error)=>{
    console.log(error);
})

//website
const weblink ='https://book-overflow.herokuapp.com/';

const open =require('open')

//working
app.post("/addStudent/:apikey",(req,res)=>{
    //collecting params
    const apikey = req.params.apikey
    //check if they got the api key
    if (apikey=="samoaJoe"){

        //post parsing
        const userupload = req.body
        
        //checking if user exist
        Student.findOne({email:userupload.email},(err,data)=>{
            if (err){
                console.log(err);
            }else{

                //if the data is available
                if (data){
                    
                    //if user is verified
                    if (data.Verification==false) {
                        res.json({access:true, item:true, upload:false, existing:true, verified:false, existtype:'email'})
                    }else{
                        res.json({access:true, item:true, upload:false, existing:true, verified:true, existtype:'email'})
                    }
                    
                //no user data
                }else{
                    Student.findOne({Username:userupload.Username},(err,data)=>{
                        if (err) {
                            console.log(err);
                        } else {
                            if (data) {
                                if (data.Verification==false) {
                                    res.json({access:true, item:true, upload:false, existing:true, verified:false, existtype:'username'})
                                }else{
                                    res.json({access:true, item:true, upload:false, existing:true, verified:true, existtype:'username'})
                                }
                            }else{
                                //check if there are any input
                    if (userupload.Username&& userupload.password&& userupload.email&& userupload.school){

                        //adding student
                        const addstudent = new Student;
                        addstudent.Username= userupload.Username
                        addstudent.Password =userupload.password
                        addstudent.email = userupload.email
                        addstudent.Verification="false"
                        addstudent.verifCode= ""
                        addstudent.resetCode=""
                        addstudent.school =userupload.school
                        //saving the student data
                        addstudent.save((err)=>{
                            if (err) {
                              console.log(err);  
                            }else{res.json({access:true, item:true, upload:true, existing:false})}
                            
                        })
                        
                    }else{
                        res.json({access:true, items:false, upload:false,existing:false})
                        // console.log("ok");
                    }

                            }
                        }
                    })
                    
                }
            }
        })
        
    }else{
        res.json({access:false})
    }
})

//working
app.post("/login/:apikey",(req,res)=>{
    const apikey= req.params.apikey;

    if (apikey=="samoaJoe") {
        const user= req.body;
        if (user.email&&user.password) {
            Student.findOne({email:user.email, Password:user.password}, (err, data)=>{
                if (err){
                    console.log(err);
                }else{
                    if (data){
                        if (data.Verification==true) {
                            res.json({access:true, fill:true, user:true, verified:true, data})
                        }else{
                            res.json({access:true, fill:true, user:true, verified:false,data})
                        }
                        
                    }else{
                        res.json({access:true, fill:true, user:false, verified:false})
                    }
                }
            })
        }else{
            res.json({access:true, fill:false,user:false})
        }
    }else{
        res.json({access:false})
    }
})


//working
app.post("/verify/:apikey/:user", (req,res)=>{
    const apikey = req.params.apikey;
    const emailrout = req.params.user;
    // console.log("post");
    if (apikey=="samoaJoe") {
        Student.findOne({Username:emailrout, Verification:false}, (err,data)=>{
            if (err){
                console.log(err);
            }else{
                if (data) {
                    const otpInput = req.body.otp
                    // console.log(data.email);
                    // console.log(otpInput.otp);
                    if (data.verifCode==otpInput){
                        Student.updateOne({Username:emailrout,Verification:false},{Verification:true}, (err)=>{
                            if (err){
                                console.log(err);
                            }else{
                                
                                const mailoption= {
                                    from: 'soludorex@gmail.com',
                                    to: data.email,
                                    subject: data.Username +" in book overflow..",
                                    text:'Your account has been verified... \n feel free to reply to chat. '
                                }

                                async function sendMail() {
                                    await myEmail.sendMail(mailoption,function (error,info) {
                                        if (error) {
                                            console.log(error);
                                        }else{
                                            console.log('email sent '+ info.response);
                                            res.json({access:true, user:true,otp:true, pastverf:false, mailedVerf:true})
                                        }
                                        
                                    })
                                }
                                sendMail();
                                // res.json({access:true, user:true, otp:true})
                            }
                        })
                    }else{
                        res.json({access:true, user:true, otp: false})
                    }
                }else{
                    res.json({access:true, user:false})
                }
            }
        })
    }else{

        res.json({access:false});
    }
})


//working
app.get("/verify/:apikey/:user",(req,res)=>{
    const apikey= req.params.apikey;
    const emails = req.params.user;
    if (apikey=="samoaJoe"){
        Student.findOne({Username:emails},(err,data)=>{
            if (err){
                console.log(err);
            }else{
                if (data) {
                    if (data.Verification==false){
                        const Userotp= otpPin()
                        Student.updateOne({_id:data._id, Username:emails }, {verifCode:Userotp},(err)=>{
                            if (err) {
                                console.log(err);
                            }else{
                                const mailoption= {
                                    from: 'soludorex@gmail.com',
                                    to: data.email,
                                    subject: 'Verification Otp to '+ data.Username+ " from Book Overflow",
                                    text:'Your verification OTP is '+Userotp+'.\n Do not lose this pin. '
                                }

                                async function sendMail() {
                                    await myEmail.sendMail(mailoption,function (error,info) {
                                        if (error) {
                                            console.log(error);
                                        }else{
                                            console.log('email sent '+ info.response);
                                            res.json({access:true, user:true, pastverf:false, mailedVerf:true})
                                        }
                                        
                                    })
                                }
                                sendMail();
                                 
                            }
                        })

                    }else{
                        res.json({access:true, user:true, pastverf:true})
                    }
                }else{
                    res.json({access:true, user:false})
                }
            }
        })
    }else{
        res.json({access:false})
    }
})



//working now
app.get("/getafulluser/:username", (req,res)=>{
    const user= req.params.username;;
    Student.findOne({Username:user}, (err,data)=>{
        if(err){
            console.log(err);
        }else{
            // console.log(dat);
            if (data) {
                const userdata= data;
                assignment.find({userid:userdata._id},(err,data)=>{
                    if (err) {
                        console.log(err);
                    }else{
                        if (data.length!=0) {
                            const userAssignment= data;

                            res.json({access:true,userAvailable:true,assAvailable:true,userData:userdata,assignments:userAssignment })
                        }else{
                            const userAssignment= data;
                            res.json({access:true, userAvailable:true, assAvailable:false, userData:userdata, assignments:userAssignment })
                        }
                    }
                })
                
            }else{
                res.json({access:true, userAvailable:false, assAvailable:false,})
            }
        }
    })
})
app.get("/getafulluserbyId/:id", (req,res)=>{
    const user=  req.params.id;
    Student.findOne({_id: user}, (err,data)=>{
        if(err){
            console.log(err);
        }else{
            // console.log(dat);
            if (data) {
                const userdata= data;
                assignment.find({userid:userdata._id},(err,data)=>{
                    if (err) {
                        console.log(err);
                    }else{
                        if (data.length!=0) {
                            const userAssignment= data;

                            res.json({access:true,userAvailable:true,assAvailable:true,userData:userdata,assignments:userAssignment })
                        }else{
                            const userAssignment= data;
                            res.json({access:true, userAvailable:true, assAvailable:false, userData:userdata, assignments:userAssignment })
                        }
                    }
                })
                
            }else{
                res.json({access:true, userAvailable:false, assAvailable:false,})
            }
        }
    })
})

//working
app.post("/addbook/:apikey",(req,res)=>{
    //getting api key
    const apikey =req.params.apikey;

    //checking the api key
    if (apikey=="samoaJoe"){

        //getting all the parameter psted
        const assignments = req.body,  //text input
            bookUpload= req.files.book; //book
            console.log(req.body);
        //checking if data were filled
        if(assignments.name!="" && assignments.subject!="" && assignments.topic!="" && assignments.grade!="" && assignments.bookDescription!="" && assignments.userid!="" ){
            console.log(assignments);
            //checking if user Id exist
            Student.findOne({Username: assignments.userid},(err,data)=>{
                //condition incase of error
                if (err) {
                    console.log(err);
                }else{

                    //checkiing if the data exist
                    if (data) {

                        // checking if user is verified
                        if(data.Verification==true){
                            
                            //checking the file type
                            const mime = bookUpload.mimetype
                            if (mime=="application/pdf" || mime=="application/msword" || mime=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
                                    //condition to know how file would be saved function
                                function mimetype() {

                                    //check the mime type
                                    //for pdf
                                    if (mime=="application/pdf"){
                                        //renaming the file
                                        const bookrename= assignments.name+assignments.subject+assignments.userid+assignments.grade+".pdf"
                                        bookUpload.name= bookrename;

                                        //uploading the book
                                        bookUpload.mv("./static/uploads/"+bookrename)

                                        //returning the name
                                        return bookrename;

                                    //for doc
                                    } else if(mime=="application/msword") {
                                        const bookrename= assignments.name+assignments.subject+assignments.userid+assignments.grade+".doc"
                                        bookUpload.name= bookrename;

                                        //uploading the book
                                        bookUpload.mv("./static/uploads/"+bookrename)

                                        //returning the name
                                        return bookrename;

                                        //for docx
                                    }else if(mime=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
                                        const bookrename= assignments.name+assignments.subject+assignments.userid+assignments.grade+".docx"
                                        bookUpload.name= bookrename;

                                        //uploading the book
                                        bookUpload.mv("./static/uploads/"+bookrename)

                                        //returning the name
                                        return bookrename;
                                    }
                                }
                                

                                //saving assignment details to db
                                const newAssignment = new assignment;
                                newAssignment.name = assignments.name
                                newAssignment.subject= assignments.subject
                                newAssignment.topic = assignments.topic
                                newAssignment.grade = assignments.grade
                                newAssignment.bookLocation = "/static/uploads/"+mimetype()
                                newAssignment.bookDescription= assignments.bookDescription
                                newAssignment.userid = data._id
                                newAssignment.save((err)=>{
                                    if (err) {
                                        console.log(err);
                                    }else{

                                        //retuning the final value
                                        // res.open({access:true,fill:true, user:true, verification:true, datatype:true, upload:true})
                                        // open('http://sindresorhus.com')
                                        const mailoption= {
                                            from: 'soludorex@gmail.com',
                                            to: data.email,
                                            subject: 'Mr/Mrs'+ data.Username+ " book upload",
                                            text:'Dear '+data.Username+"book has been uploaded to book overflow.\n Thank you for your posting \n From Book overflow"
                                        }
        
                                        async function sendMail() {
                                            await myEmail.sendMail(mailoption,function (error,info) {
                                                if (error) {
                                                    console.log(error);
                                                }else{
                                                    console.log('email sent '+ info.response);
                                                    res.render('index', {weblink})
                                                }
                                                
                                            })
                                        }
                                        sendMail();
                                        // res.render('index')
                                    }
                                })

                            }else{
                                const mailoption= {
                                    from: 'soludorex@gmail.com',
                                    to: data.email,
                                    subject: 'Mr/Mrs'+ data.Username+ " book upload",
                                    text:'Dear '+data.Username+" book has not been uploaded to some error from either your input of filetype \n Note: only accept: PDF, DOCX, DOC .\n Thank you for your support \n From Book overflow"
                                }

                                async function sendMail() {
                                    await myEmail.sendMail(mailoption,function (error,info) {
                                        if (error) {
                                            console.log(error);
                                        }else{
                                            console.log('email sent '+ info.response);
                                            res.render('index', {weblink})
                                        }
                                        
                                    })
                                }
                                sendMail();                            
                            }
                            
                            // 
                        }else{
                            //returning if user is not verified
                            const mailoption= {
                                from: 'soludorex@gmail.com',
                                to: data.email,
                                subject: 'Mr/Mrs'+ data.Username+ " book upload",
                                text:'Dear '+data.Username+" book has not been uploaded to some error from either your input or you may have not been verified.\n Thank you for your support \n From Book overflow"
                            }

                            async function sendMail() {
                                await myEmail.sendMail(mailoption,function (error,info) {
                                    if (error) {
                                        console.log(error);
                                    }else{
                                        console.log('email sent '+ info.response);
                                        res.render('index', {weblink})
                                    }
                                    
                                })
                            }
                            sendMail();                            
                        
                        }
                    }else{
                        //if user is not found 
                        const mailoption= {
                            from: 'soludorex@gmail.com',
                            to: data.email,
                            subject: 'Mr/Mrs'+ data.Username+ " book upload",
                            text:'Dear '+data.Username+"book has not been uploaded because you are not a user go to "+ weblink +" .\n Thank you for your support \n From Book overflow"
                        }

                        async function sendMail() {
                            await myEmail.sendMail(mailoption,function (error,info) {
                                if (error) {
                                    console.log(error);
                                }else{
                                    console.log('email sent '+ info.response);
                                    res.render('index', {weblink})
                                }
                                
                            })
                        }
                        sendMail();                            
                    
                    }
                }
            })
        }else{
            //if you dont fill
            const mailoption= {
                from: 'soludorex@gmail.com',
                to: data.email,
                subject: 'Mr/Mrs'+ data.Username+ " book upload",
                text:'Dear '+data.Username+"book has not been uploaded due to some input errors.\n Please make sure you fully fill your form.\n Thank you for your support \n From Book overflow"
            }

            async function sendMail() {
                await myEmail.sendMail(mailoption,function (error,info) {
                    if (error) {
                        console.log(error);
                    }else{
                        console.log('email sent '+ info.response);
                        res.render('index', {weblink})
                    }
                    
                })
            }
            sendMail();      
        }
    }else{

        //wrong api key
        res.json({access:false})
    }
})

//working
app.get("/getallbook/:apikey",(req,res)=>{
    //api key
    const apikey = req.params.apikey;

    //checking apiKey
    if(apikey=="samoaJoe"){

        assignment.find({},(err,data)=>{
            if (err) {
                console.log(err);
            }else{
                if (data) {
                    res.json({access:true,item:true, data})
                }else{
                    res.json({access:true, items:false})
                }
            }
        })
    }else{
        //invalid api
        res.json({access:false})
    }
})

app.get('/item/:id', (req,res)=>{
    const items = req.params.id
    assignment.findOne({_id:items}, (err,data)=>{
        if (err) {
            console.log(err);
        } else {
            if (data) {
                const itemdata= data;
                Student.findOne({_id:itemdata.userid},(err, data)=>{
                    if (err) {
                        console.log(err);
                    } else {
                        if (data) {
                            const userdata= data;
                            res.json({access:true, item: true,itemdata, user:true,userdata})
                        }else{
                            res.json({access:true, item: true,itemdata, user:false})
                        }
                    }
                })
                // res.json({access:true, item: true,itemdata})
            } else {
                res.json({access:true, item:false})
            }
        }
    })
})

app.get('/delete/:apikey/:id/:userid', (req,res)=>{
    const apikey = req.params.apikey;
    const id= req.params.id
    const userid = req.params.userid;
    if (apikey=="samoaJoe") {
        assignment.findOne({_id:id}, (err,data)=>{
            if (err) {
                console.log(err);
            }else{
                if (data) {
                    if(userid==data.userid){
                        assignment.remove({_id:id, userid },(err)=>{
                            if (err) {
                                console.log(err);
                            }else{
                                res.json({access:true, item:true,uservalid:true,deleted:true})
                            }
                        })
                    }else{
                        res.json({access:true, item:true, uservalid:false})
                    }
                }else{
                    res.json({access:true, item:false})
                }
            }
        })
    }else{
        res.json({access:false})
    }
})

// working
app.get('/static/uploads/:item', (req,res)=>{
    // res.pipe("static/up:loads/"+req.params.item)
    const filess= req.params.item
    res.sendFile(__dirname+'/static/uploads/'+filess)
    // res.json()
    // download("http://localhost:5000/static/uploads/Lincolntimetablelinic6280fdb4347674a2ac136cb0123.pdf", "static/uploads")
})

//get

app.use((req,res)=>{
    res.status(404).json({access:false})
})