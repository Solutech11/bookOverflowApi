add student == POST
/addStudent/:apikey
{access:true, item:true, upload:true, existing:false}
input== Username
        password
        email
        school
 url== apiKey


login == POST
/login/:apikey
{access:true, fill:true, user:true, verified:false, data}
input == email
         password
url== apikey


Verify == GET
/verify/:apikey/:username
{access:true, user:true, pastverf:false, mailedVerf:true}
input == 
url == apikey
       username


Verify == POST
/verify/:apikey/:user
{access:true, user:true,otp:true, pastverf:false, mailedVerf:true}
input == otp
url == apikey
       username
   
   
a full user == GET
/getafulluser/:username
{access:true, userAvailable:true, assAvailable:false, userdata:{
    Username:String,
    Password:String,
    email:String,
    school:String,
    imageLocation:String,
    Verification:Boolean,
    verifCode:String,
    resetCode:String
}, assignments:[{
    name: String,😊😊
    subject: String,
    topic: String,
    grade: String,
    bookLocation: String,
    bookDescription: String,
    userid: String,
},] }
input ==
url == username


addbook == POST
/addbook/:apikey
{access:true,fill:true, user:true, verification:true, datatype:true, upload:true}
input == name
         subject
         topic
         grade
         book...............upload either png or pdf
         bookDescription
         userid
url == apikey


get item == GET 
/item/:item
{access:true, item: true, url:bookLocation}
input ==
url == itemname


AllBooks == GET
/getallbook/:apikey
{access:true,item:true, data}
         
