const express = require("express");
const db = require("./db/conn");
const path = require("path");
const app = express();
const port = process.env.port || 3000;
const bodyParser = require('body-parser');
const { ENGINE_METHOD_ALL } = require("constants");
const hbs = require("hbs");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const jwtsecret = "hlo+L3n7JyMxtQllx8PnXdOBvQ2UnIuxTSJokZ+Xh7MXZxTA6e7aVqsVoIyfuM5dpgogAh0bKvJo4eGmECK21Q=="

// setting the path
const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use('/bootstrap.css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css/bootstrap.css')))
//middleware
app.use(cookieParser());
app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', views_path);
hbs.registerPartials(partials_path)
// routing
hbs.registerHelper('ifvalue', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this)
  } else {
    return options.inverse(this);
  }
});

app.get("/",(req,res) => {
try{
  let decoded = jwt.verify(req.cookies.jwt, jwtsecret);
    loggedin=true
    res.render("index",{loggedin,email:decoded.email});
}
catch(err){
  res.clearCookie('jwt')
  res.render("index");
}
  //res.render("index");
})
app.get("/getstarted",(req,res) => {
  if(req.cookies.jwt==null){
    res.redirect("/signin")
  }
  try{
  let decoded = jwt.verify(req.cookies.jwt, jwtsecret);
  loggedin=true
  res.render("getstarted",{loggedin,email:decoded.email});
}
catch(err){
  res.clearCookie('jwt')
  res.redirect("/signin")
}})
app.get("/pass-saved",(req,res) => {
  if(req.cookies.jwt==null){
    res.redirect("/signin")
  }
  try{
  let decoded = jwt.verify(req.cookies.jwt, jwtsecret);
  loggedin=true
  res.render("pass-saved",{loggedin,email:decoded.email});
}
catch(err){
  res.clearCookie('jwt')
  res.redirect("/signin")
}
})
app.get("/add-passwd",(req,res) => {
  if(req.cookies.jwt==null){
    res.redirect("/signin")
  }
  try{
  let decoded = jwt.verify(req.cookies.jwt, jwtsecret);
  loggedin=true
  res.render("add-passwd",{loggedin,email:decoded.email});
}
catch(err){
  res.clearCookie('jwt')
  res.redirect('/signin')
}
})
app.get("/github",(req,res) => {
  res.render("github");
})
app.get("/signup",(req,res) => {
  res.render("signup");
})
app.get("/signup-fail",(req,res) => {
  res.render("signup-fail");
})
app.get("/signup-success",(req,res) => {
  res.render("signup-success");
})
app.get("/signin",(req,res) => {
  if(req.cookies.jwt!=null){
    res.redirect("/getstarted")
  }

  res.render("signin");
})
app.get("/signout",(req,res)=>{
  if(req.cookies.jwt==null){
    res.redirect("/signin")
  }
  res.clearCookie('jwt')
  res.redirect("/signout-landing");
})
app.get("/signout-landing",(req,res)=>{
  res.render("signout");
})
app.get("/createentry",(req,res)=>{
  if(req.cookies.jwt==null){
    res.redirect("/signin")
  }
  try{
  let decoded = jwt.verify(req.cookies.jwt, jwtsecret);
  loggedin=null
  res.render("createentry",{loggedin,email:decoded.email});
}
catch(err){
  res.clearCookie('jwt')
  res.redirect('/signin')
}})
//app.get(path, callback)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//databse apis

  app.get('/api', (request, response) => {
    response.status(401).json(`Unauthorized/Forbidden`);
  })
  
  app.get('/api/getdata', db.getdata) 
  app.post('/api/signup', db.signup)
  app.post('/api/signin', db.signin)
  app.post('/api/createentry', db.createentry)

//db.test()

//server create
app.listen(port, () => {
    console.log(`Server is running at port number ${port}`);
})
