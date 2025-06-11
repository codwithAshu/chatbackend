const express=require("express");
const router=express.Router()
const {login,insert,update,del,getAllData,deletedata,insertroute,insertaccess,displaydata,forgotPassword,resetPassword}=require("../controller")
// const { verifyToken, checkAccessLevel } = require('../middlewares/authMiddleware'); 

router.post("/login",login



)

router.post("/post",insert)
router.post("/postroute",insertroute)
router.post("/postaccess",insertaccess)
router.post("/displaydata/:id",displaydata)

router.put("/updateprofile/:id",update)

router.delete("/:id",del)
// router.post("/get-all-data/:id",getAllData)
router.post("/get-all-data/:id",getAllData)
router.delete("/delete-data/:id",del)
router.post("/forgot-password",forgotPassword)
router.post('/ResetPassword', resetPassword);


module.exports=router