
const mysql=require("mysql");
const dotenv = require('dotenv');
dotenv.config();
const con=mysql.createPool({
    connectionLimit: 10,
    host: "be0k9n3uy2qosywlrqzv-mysql.services.clever-cloud.com", 
    user: "uxpgrrbk8ji6bypf",
  password: "hnGxbZpodfNKDBCOcGNf",
  database: "be0k9n3uy2qosywlrqzv",
  PORT:3306,
  connectTimeout: 1000000,
  acquireTimeout: 1000000
});
con.getConnection((err)=>{
    if(err){
        console.log("error",err);
    }else{
        console.log("connected to database"); 
    }
})

module.exports=con;


//  
// user: "u6ndrsboqpco7bt7",
// password: "dfVT2CiwrvQqFr2wCibw",
// database: "b1oyljmp0fs7kgkizmcy",
// host: process.env.DB_HOST, 
// user: process.env.DB_USER,
// password: process.env.DB_PASSWORD,
// database: process.env.DB_NAME







//   host: "localhost", 
//   user: "root",
// password: "Prep@123",
// database: "nodejs_login"
  
