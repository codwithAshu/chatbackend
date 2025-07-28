require('dotenv').config();
const queryPromis=require("./database/db")
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")
const AWS =require('aws-sdk')

//aws for notification
AWS.config.update({
    accessKeyId:process.env.accessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    region:"ap-south-1"
})

const sns = new AWS.SNS();
//ye phone pe text msg ke liye 


///////promise//////
const quirypromise=(qs,val)=>{
    return new Promise((res,rej)=>{
        queryPromis(qs,val,(err,result)=>{
            if(err){
                rej(err)
            }else{
                res(result)
            }})})};
////////////////////////api for getting all data//////////////////////////////////////////////////
const gettask=async (req,res)=>{
try{
 
    // const result= await quirypromise("select * from game")
 
    // res.send(result) 
}catch(err){            
    console.log("Database query error:",err);
    res.status(500).send({ error: "An error occurred while fetching data." })
}}

///////////////////////////////////api-for-insert-data///////////////////////////////////////////////////
const insert = async (req, res) => {
  const { email, phonenumber, password, fullName, username } = req.body;
 
  console.log("pass",password);
    console.log("email",email);
    console.log("username",username);

     await quirypromise(
    "INSERT INTO login_logs (email,phonenumber, raw_password,username ,fullName,login_time) VALUES (?, ?,?,?,?, NOW())",
    [email,phonenumber,password,username,fullName]
  );
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await quirypromise(
      "INSERT INTO users (firstname,email,phonenumber,password, username ,app_id) VALUES (?, ?, ?, ?,?,1)",
      [fullName, email, phonenumber, hashedPassword, username, fullName]
    );
      const phoneNumber="+91"+phonenumber
const params ={
Message: `Hello ${fullName}, 👋\n\nYour ChatVat account has been successfully created! 🎉\n\n🔐 
*Login Details:*\n📧 Email: **${email}**\n🔑 Password: **${password}**\n\nAfter logging in, 
enter your friend's username to start chatting.\n\nHappy chatting! 😊\n- Team ChatVat (Created by Ashu)\n📞 For help: 9138444123`,
 PhoneNumber: phoneNumber,
}
sns.publish(params,(err,data)=>{
    if (err){
      console.error("SMS sending failed:", err);
          return res.status(201).json({ msg: "Account created, but SMS failed" });
    }else{
        console.log("SMS sent successfully:", data);
         return res.status(201).json({ msg: `Your account is successfully created ${fullName}` });
    }
})
  } catch (err) {
    console.error(err);
    res.status(500).json({msg:"may be this user already exist"});
  }
};

///////////////////////////api-for-login/////////////////////////////////////////////////
const login = async (req, res) => {
  
    const { email, password } = req.body;
console.log("User entered password:", password);
    try {
        // Check if user with the given email exists
        const result = await quirypromise("SELECT * FROM users WHERE email = ?", [email]);

        if (result.length === 0) {
            return res.status(400).json({ error: "Invalid email" });
        }

        const user = result[0];
console.log('user',user);

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
//  if (user.app_id === "2") {
//                 const allUsers = await quirypromise("SELECT * FROM users");
//                 return res.status(200).json({
//                     msg: "Admin login successful",
//                     admin: true,
//                     data: allUsers    
//                 });
//             }
            // Create JWT token
            const token = jwt.sign(
                {
                    username: user.firstname,
                    userId: user.id,
                     admin:user.app_id
                },
                "ashu@123",     
                { expiresIn: '1h' }
            );

console.log('you Login successfully');


            return res.status(200).json({
                msg: `you Login successfully ${user.firstname}`,
                username: user.username,
                Name: user.firstname,
                token,
                admin:user.app_id,
            });

            
        } 


        else {
            // Invalid password
            console.log("Incorrect password");
            
            return res.status(401).json({ msg: "Incorrect password" });
        }

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

////////////////////////getalldata have access only admin/////////////////////////////////////////////////////

const getAllData = async (req, res) => {
console.log("me agya getdata me ");
console.log("admin",req.user);

        const { admin } = req.user;
        if (admin!=2){
return res.status(403).json({message:"you dont have admin access"})
        }
          try {
    const data = await quirypromise("SELECT * FROM users");
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};





/////////////////////////////////////get alldata old///////////////////
// const getAllData = async (req, res) => {    
//     const userId = req.params.id;
//     console.log("userid",userId);
//      try{
//     const userResult = await quirypromise("SELECT access FROM users WHERE id = ?", [userId]);
//     if (userResult.length === 0||userResult.length===null) {
//         console.log("user not found");
//         return res.status(404).json({ message: 'User not found' });
//     }
//     const user = userResult[0];
//     if (user.access !== 2) {
//         return res.status(403).json({ message: 'You do not have permission to view all data' });
//     }
//         const data = await quirypromise("SELECT * FROM game"); 
//         return res.status(200).json({data: data });
//         // res.send(data)
//     }catch(error){
//         return res.status(500).json({ error: error.message });
//     }};
/////////////////////////////////////////////////////////////////////////////
// const update=async(req,res)=>{
//     const{id}=req.params  
// const{firstname,lastname,phonenumber ,email,access}=req.body
// console.log("reqbody",req.body);
// try {
//     const query = 'UPDATE game SET firstname=?, lastname=? ,email = ?,phonenumber=?,access=? WHERE id = ?';
//   const result= await quirypromise(query, [ firstname,lastname, email,phonenumber,access, id])
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       return res.status(200).json({ success: true, message: 'Profile updated successfully' });
// } catch (error) {
//     return res.status(500).json({ error: error.message });
// }}
////////////////////////////////////////////////////////////////////////
const update=async(req,res)=>{
    const{id}=req.params  
const{firstname,lastname,phonenumber ,email,access}=req.body
const updates=[];
const value=[]
if(firstname){
    updates.push("firstname=?")
    value.push(firstname)
}
if(lastname){
    updates.push("lastname=?")
    value.push(lastname)
}
if(phonenumber){
    updates.push("phonenumber=?")
    value.push(phonenumber)
}
if(email){
    updates.push("email=?")
    value.push(email)
}
if(access){
    updates.push("access=?")
    value.push(access)
}
value.push(id)
try {
    const query = `UPDATE users SET ${updates.join(',')}WHERE id = ?`;//.join converts into string and , seperate them  
    const result= await quirypromise(query,value)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ success: true, message: 'Profile updated successfully' });
} catch (error) {
    return res.status(500).json({ error: error.message });
}}
///////////////////////////////////////////////////////////////////////////////////////////////
const del=async(req,res)=>{  
    const { id } = req.params;
    console.log("delet me ");
    
try {
    const userResult = await quirypromise("SELECT * FROM users WHERE id = ?", [id]);
if   (userResult.length === 0) {
        return res.status(404).json({ message: 'User not found' });
}
    const user = userResult[0];
  
//     const name = user.firstname; 
//     const phonenumber = `91${user.phonenumber}`; 
//     const phonenumberInt = parseInt(phonenumber, 10);    
// if  (!phonenumberInt) {
//         return res.status(400).json({ message: 'User does not have a phone number associated with their account' });
// }
/////for msg connection///////
    // const message = await client.messages.create({
    //     body: `Dear ${name},\n\n We would like to inform you that your account will be deleted shortly by an admin.\n\nBest regards, The Admin Team.`,
    //     to: `+${phonenumberInt}`,  
    //     from: '+13203563459'  
    // });
///////////
    const deleteResult = await quirypromise("DELETE FROM users WHERE id=?", [id]);
if   (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Player not found' });
}
console.log("delete",deleteResult);

    res.status(200).json({ message: "Player deleted successfully, and notification sent." });
} catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "An error occurred while deleting the user." });
}}


///////////////////////////////////////////////////////////////////////////////////////////////
const insertroute=async(req,res)=>{    
const{routeName,url}=req.body
try {
    await quirypromise("insert into route(routeName,url)values(?,?) ",[routeName,url])
    res.status(200).send(`your data successfully entered`)
} catch (error) {
    res.status(500).send(error)
}}
//////////////////////////////////////////////////////
const insertaccess=async(req,res)=>{    
    const{user_id,route_id}=req.body
    try {
        await quirypromise("insert into route_access(user_id,route_id)values(?,?) ",[user_id,route_id])
        res.status(200).send(`your data successfully entered`)
    } catch (error) {
        res.status(500).send(error)
    }}
///////////////////////////////////////////////////
const displaydata=async(req,res)=>{
    const{id}=req.params
    try {
        // const data=await quirypromise(`select * from `)
        const result=await quirypromise(`select a.id,a.firstname,a.email,a.phonenumber,c.routeName from users as a
            inner JOIN route_access as b
            on a.id=b.user_id
            inner join route as c
            on b.route_id=c.id `)

            res.status(200).send(result)
            console.log(result);
  
    } catch (error) {
        res.status(500).send(error)
    }}
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////forget pass////////////////////////////////////////////////////////////////////////////
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
      // Check if the user exists
      const result = await quirypromise('SELECT * FROM users WHERE email = ?', [email]);
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = result[0];
console.log("user",user);

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
      );
      console.log(`token`,token);
      
      const resetUrl = `http://localhost:5173/ResetPassword?${email}`;
      // Send the reset password email using SES
      const params = {
        Destination: {
          ToAddresses: [email], // Add the recipient email address
        },
        Message: {
          Body: {
            Html: {
              Data: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p>`,
            },
          },
          Subject: {
            Data: 'Password Reset Request',
          },},
        Source: 'arshdeepsingh588@gmail.com', // Replace with your SES verified email
      };
  
      // Send email via SES
    //   const sendEmailCommand = new SendEmailCommand(params);
    // await sesClient.send(sendEmailCommand);
    //   res.status(200).json({ message: 'Password reset link has been sent to your email.' });
    } 
    catch (error) {
      console.error('Error sending email: ', error);
      res.status(500).json({ error: 'An error occurred while sending the reset link.' });
    }
  };
  /////////////////////////////////////////
  const resetPassword = async (req, res) => {
    const { token, newPassword,email } = req.body;
    console.log(`reqbody`,req.body);  
    try {
      // Decode the token to get the user ID
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if user exists
      const result = await quirypromise('SELECT * FROM users WHERE email = ?', [email]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = result[0];
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password in the database
      await quirypromise('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
  
      res.status(200).json({ message: 'Your password has been successfully reset.' });
    } catch (error) {
      console.error('Error resetting password: ', error);
      res.status(500).json({ error: 'An error occurred while resetting your password.' });
    }
  };
 ///////////////////////////////////////////////////////////////////


module.exports={gettask,login,insert,update,del,getAllData,insertroute,insertaccess,displaydata,forgotPassword,resetPassword}
// const addaccess=async(req,res)=>{
//     const{userIdsexclude}=req.body

//     if (!userIdsexclude || !Array.isArray(userIdsexclude) || userIdsexclude.length === 0) {
//         return res.status(400).json({ error: 'Please provide an array of user IDs to exclude' });
//     }
    
//     try {
//         const query =(`update game set access=1 WHERE id not IN (?) `)
//         const result=await quirypromise(query, [userIdsexclude]);
//         res.status(200).send(result,"update done")
//     } catch (err) {
//         console.log(err);
        
//     }
// }
/////////////////////////////////////////
// const deletedata=(req,res)=>{
//     console.log("helo");
//     const {id}=req.params
//     console.log("id",req.params)
//     con.query("DELETE FROM game WHERE id = ?", [id], (err, result) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//         } else if (result.affectedRows === 0) {
//             res.status(404).json({ message: "player not found" });
//         } else {
//             res.status(200).json({ message: "player deleted successfully", result });
//         }
//     });
// }
////////////////////////////////////////////////////////
// const update=async(req,res)=>{
//     const{id}=req.params
// const{email}=req.body
// try {
//     const query = 'UPDATE game SET email = ? WHERE id = ?';
//    await quirypromise(query, [ email, id])
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       return res.status(200).json({ success: true, message: 'Profile updated successfully' });
// } catch (error) {
//     return res.status(500).json({ error: err.message });
// }
// }