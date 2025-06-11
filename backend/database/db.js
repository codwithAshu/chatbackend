require('dotenv').config();
const mysql = require("mysql");
const util = require("util");
// const dotenv = require("dotenv");
// dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "chatdatabase.c3ycw84oclw7.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "arshdeep-0429",
  database: "chatdatabase",
  port: 3306,
  connectTimeout: 10000,
  acquireTimeout: 10000,
});

const queryPromise = util.promisify(pool.query).bind(pool);

// ✅ Test connection when app starts
queryPromise("SELECT 1")
  .then(() => {
    console.log("✅ Connected to database successfully!");
  })
  .catch((err) => {
    console.error("❌ Error connecting to database:", err);
  });

  // const gettask=async (req, res)=>{
  
  //   const start = Date.now();
  //   const rows = await queryPromise('SELECT 1 as result');
  //   const dbTime = Date.now() - start;

  //   res.json({ 
  //       db: 'CleverCloud MySQL',
  //       queryTime: `${dbTime}ms` ,
  //       data: rows 
  //     });
      
  // }

module.exports = queryPromise;
// connectionLimit: 10,
//   host: "be0k9n3uy2qosywlrqzv-mysql.services.clever-cloud.com",
//   user: "uxpgrrbk8ji6bypf",
//   password: "hnGxbZpodfNKDBCOcGNf",
//   database: "be0k9n3uy2qosywlrqzv",
//   port: 3306,
//   connectTimeout: 10000,
//   acquireTimeout: 10000,