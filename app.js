// const express = require("express");
// const mongoose = require("mongoose")

// const app = express();

// app.use(express.static('public'));

// app.set('view engine', 'ejs');


// const dbURI = 'mongodb+srv://joel:admin123#@cluster0.r0foa.mongodb.net/node-auth'
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifieldTopology: true, useCreateIndex: true})
//  .then((result)=>app.listen(3000))
//  .catch((err)=> console.log(err));

//  app.get('/', (req, res)=> res.render('home'));
//  app.get('/smoothes', (req, res)=> res.render('smoothes'));



// app.js
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser =require('cookie-parser');
const { requireAuth, checkuser } = require("./middleware/authMiddleware");

const app = express();

//middle ware...
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


app.set('view engine', 'ejs');


//Mongo DB Configuration....
const dbURI = 'mongodb+srv://joel:admin@cluster0.r0foa.mongodb.net/node-auth';
mongoose.connect(dbURI)
  .then(() => app.listen(3000, () => console.log("Server is running on port 3000")))
  .catch((err) => console.log("Connection error:", err));

// Use the authentication routes
app.get('*', checkuser);
app.use(authRoutes);
app.get('/header', (req, res) => res.render('header'));
app.get('/smoothes', requireAuth, (req, res) => res.render('smoothes'));


//Cookies
// app.get('/set-cookies', (req, res)=>{
//   //res.setHeader( 'set-cookie', 'newUser=true');
//   res.cookie('newUser', false);
//   res.cookie('isEmploy',true,{   maxAge:1000*60*60*24,secure:true, httpOnly:true});
  
  
//   res.send("You got Cookies....!")
// });

// //
// app.get('/read-cookies', (req, res)=>{
//   const cookies =req.cookies;
//   console.log(cookies.newUser);
//   res.json(cookies);
// });   