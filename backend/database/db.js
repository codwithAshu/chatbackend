const mysql=require("mysql");
const dotenv = require('dotenv');
dotenv.config();
const con=mysql.createConnection({
    host: "localhost", 
    user: "root",
  password: "Prep@123",
  database: "nodejs_login"
});
con.connect((err)=>{
    if(err){
        console.log("error",err);
    }else{
        console.log("connected to database"); 
    }
})

module.exports=con;



// host: process.env.DB_HOST, 
// user: process.env.DB_USER,
// password: process.env.DB_PASSWORD,
// database: process.env.DB_NAME







//   host: "localhost", 
//   user: "root",
// password: "Prep@123",
// database: "nodejs_login"
  
//   host: "mydb.cxcsmsq8mzqy.ap-south-1.rds.amazonaws.com", 
//   user: "admin",
// password: "ashu1234",
// database: "nodejs_login"