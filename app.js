const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
var firebase = require("firebase/app");
require("firebase/database");
const winston = require('winston');

// Logger configuration
const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: './logs/collection.log'
        })
    ]
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

const TWO_HOURS=1000 * 60 * 60 * 2
const{
    PORT = 3005,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET="SHHH!!!, RED CaT",
    SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'
const users  =  [
    {id: 1, name: 'Alex', email: 'alex@gmail.com', password: "secret"}
    
]

const config = {
    apiKey: "AIzaSyCyGye-WMomVLnTRQ-8wlsXzSUJuJQG1do",
    authDomain: "nefirebase-7624e.firebaseapp.com",
    databaseURL: "https://nefirebase-7624e.firebaseio.com",
    projectId: "nefirebase-7624e",
    storageBucket: "",
    messagingSenderId: "75788997805",
    appId: "1:75788997805:web:edd317f89fd6270b352224"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
var database2=firebase.database();
const app=express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

app.use(session({
    name:SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret:SESS_SECRET,
    cookie: {

        maxAge: SESS_LIFETIME,
        sameSite: true, //strict
        secure: IN_PROD 
    }
}))

const redirectLogin = (req,res,next) => {
    if(!req.session.userId){
        res.send("Howdy")
    } else{
        next()
    }
}

const redirectHome = (req,res,next) => {
    if(req.session.userId){
        res.send("Hey")
    }else{
        next()
    }
}

app.get('/', (req,res) => {
    console.log(req.session)
    res.sendFile(__dirname + "/login.html")
})

app.get('/insert',redirectLogin, (req,res) => {
        
    res.sendFile(__dirname+"/oldLogin.html")
})

app.post('/fileupload', (req,res) => {
    var form = new formidable.IncomingForm();
   
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/Rishabh/Desktop/' + files.filetoupload.name;
      
      async function sendToHardik(){

        await fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
          });
    }

    async function check(){
          
        await fs.access(newpath, function (err) {
            if (err) {
                sendToHardik();
            }
            else{
                res.write("File Exists");
                res.end();
            }
           
            
          });
    }
    check();
    
//    axios.post("/",{
  
// })
 });


})



app.post('/login', redirectHome,(req,res) => {
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;

    console.log(email+" "+password)


    if (email && password) {
        const user = users.find(
            user => user.email === email && user.password === password
        )

        if(user) {
            req.session.userId = user.id
            return res.send("HEY")
            
           
        }
        else{
            res.send("Howdy")
        }
    }
   
})


app.post('/logout', (req,res) => {
    req.session.destroy(err =>{
        if (err) {
            return res.redirect('/insert')
        }

        res.clearCookie(SESS_NAME)
        res.send('loggedout')   
    })

})

app.listen(PORT,() =>console.log(
    `http://localhost:${PORT}/`
))



app.post('/fire', (req,res) => {
    var a=[]
    var resultS
    var key
    


  var ref=database.ref("/users")
  ref.on('value',gotData,errData)
  
  
  function gotData(data){
//    var key=Object.keys(data.val())
//    console.log(typeof(key))
//    console.log(key)
try {
    res.send(data.val())
    
} catch (error) {
    console.log(error)
}
  
 
  
  }
    
  
  function errData(err){
      console.log(err)
  }
})

app.post('/fireAshishIndivisual', (req,res) => {
    var a=[]
    var resultS
    var key
    
console.log(typeof(req.body))
console.log(req.body.CaseNo)
console.log(req.body["CaseNo"])

  var ref=database.ref("/users").child(req.body.CaseNo)
  ref.on('value',gotData,errData)
  
  
  function gotData(data){
//    var key=Object.keys(data.val())
//    console.log(typeof(key))
//    console.log(key)
try {
    res.send(data.val())
    
} catch (error) {
    console.log(error)
}
  
 
  
  }
    
  
  function errData(err){
      console.log(err)
  }
})

app.post('/fireAshish', (req,res) => {
    var a=[]
    var resultS
    var key
    


  var ref=database.ref("/users")
  ref.on('value',gotData,errData)
  
  
  function gotData(data){
//    var key=Object.keys(data.val())
//    console.log(typeof(key))
//    console.log(key)
try {
    res.send(Object.keys(data.val()))
    
} catch (error) {
    console.log(error)
}
  
 
  
  }
    
  
  function errData(err){
      console.log(err)
  }
})

app.post('/newUser', (req,res) => {
  var a=req.body.data;
    console.log(a)
  var ref=database.ref("/users")
  ref.child("1066").set({
    a
  });
  

})
app.post('/updateUser', (req,res) => {
    var a=req.body.data;
      console.log(a)
     database2.ref("/users").child(a["CaseNo"]).set({
        '1st Mnth':a["1st Mnth"],
        'Balance as on':a["Balance as on"],
        'CaseNo':a["CaseNo"],
        'EMI':a["EMI"],
        'Last Month':a["Last Month"],
        'Name':a["Name"],
        'Term':a["Term"],
        'date':a["date"],
        'loan':a["loan"]
      })
      .catch(function (error) {
        console.log(error);
      });
    res.send("Successful")
  
  })

  app.post('/recieve', (req,res) => {
      console.log(req.body)
      var name="Ramesh"
      var amount =10000
   
    
   var b= database.ref("/users").child(req.body.case).update({
        "moneyRecieved":1
      })

      let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date & time in YYYY-MM-DD HH:MM:SS format
var t=year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
var jso={
    "time":t,
    "name":req.body.name,
    "amount":req.body.amount,
    "case":req.body.case
}

      logger.info(jso);
    //   logger.info("bbbbbb")
    res.send(jso)

  })



var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
