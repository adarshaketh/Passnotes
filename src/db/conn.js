const createClient = require('@supabase/supabase-js').createClient;
const setTimeoutP = require('timers/promises').setTimeout;
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const supabase = createClient('https://zdgbrfpyxjayivwwfvys.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZ2JyZnB5eGpheWl2d3dmdnlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MTAwODc3MywiZXhwIjoxOTg2NTg0NzczfQ.qDAUQ__CeaHTxvAjCs9c2IZiFK_bHtSCkn9oqwi9O_0')
//
let jwtsecret = "hlo+L3n7JyMxtQllx8PnXdOBvQ2UnIuxTSJokZ+Xh7MXZxTA6e7aVqsVoIyfuM5dpgogAh0bKvJo4eGmECK21Q=="

//
const showpasswd = (request, response) => {

      response.status(200).json(results.rows)
}

  
  const addpasswd = (request, response) => {


      response.redirect("/add-passwd")
}
const signup = (req,res)=>{
const {email,password} = req.body
if((email==""||password=="")||(email==null||password==null)){
  res.status(401).json({error:"Enter email and password properly!"})
}
else{
async function signupdata(email,password){
  try{
    const { data, error } = await supabase.auth.signUp({email,password}) 
  if(error){
    console.log(error)
    res.status(201).redirect("/signup-fail")
  }
  else{
    try{
    const { error } = await supabase
  .from('users')
  .insert({email })
if(error){
  console.log(error)
}
}
catch(err){
console.log(err)
}
    res.status(201).redirect("/signup-success")
  }
}
catch(error){
  res.status(201).redirect("/signup-fail")
}
}
signupdata(email,password)
}
}

const signin = (req,res)=>{
const {email,password} = req.body
  if((email==""||password=="")||(email==null||password==null)){
    res.status(401).json({error:"Enter email and password properly!"})
  }
  else{
    async function signindata(email,password){
      try{
    const { data, error } = await supabase.auth.signInWithPassword({email,password}) 
    res.cookie('jwt', data.session.access_token, { httpOnly: true });
    res.redirect("/getstarted")

    //res.status(201).json({jwt:data.session.access_token})
    }
    catch(err){
      res.status(401).redirect("/signin-invalid")
    }
}
signindata(email,password)
}
}
async function test(){
   const { data, error } = await supabase.auth.signInWithPassword({
    email: 'ad.arshak103@gmail.com',
    password: 'password123',
  }) 
const { data1, error1 } = await supabase.auth.getSession()
console.log(data.session.access_token)
}
  const createentry = (req,res)=>{
    const { tagname, url, username, email, password } = req.body
    if(req.cookies.jwt==null){
      res.redirect("/signin")
    }
    if(password==null|password==''){
      res.status(401).json({error:"Enter required fields"})
    }else{
    try{
    let decoded = jwt.verify(req.cookies.jwt, jwtsecret);
      let email1 = decoded.email
      async function createmasterkeydb(email1,tagname, url, username, email, password){
        const { error } = await supabase
        .from('password')
        .insert({ coreuser: email1, tagname: tagname, url,username,email,password })
          if(error==null){
            let createstatus="true"
            res.render('createentry',{createstatus})
          }
          else{
            let createstatus="false"
            res.render('createentry',{createstatus})
          }
        
        }
      createmasterkeydb(email1,tagname, url, username, email, password)
      }
    catch(err){
      loggedin=false
      res.render("index");
    }}
  }
  
  const getdata = (req,res)=>{
    if(req.cookies.jwt==null){
      res.redirect("/signin")
    }
    try{
      let decoded = jwt.verify(req.cookies.jwt, jwtsecret);
        let email1 = decoded.email
        async function getfromdb(email1){
          const { data, error } = await supabase
          .from('password')
          .select()
          .eq('coreuser' ,email1)
            if(error==null){
              res.status(200).json(data)
            }
            else{
              res.status(500).json({error:"Unknown Error"})
            }
          
          }
          getfromdb(email1)
        }
      catch(err){
        loggedin=false
        res.render("index");
      }
  }


  module.exports = {
    showpasswd,
    addpasswd,
    signup,
    signin,
    createentry,
    getdata,
    test
  }
