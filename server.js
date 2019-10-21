var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var firebase = require("firebase/app");
require("firebase/database");
const winston = require('winston');





// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());


app.use(express.static(__dirname+'/public'));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 86400000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


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






// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});




// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/login.html');
    })
    .post((req, res) => {
        var username = req.body.login[0],
            password = req.body.login[1];
            console.log(req.body)
            if(username!="alex@gmail.com"){
                res.redirect('/login')
            }
            if(password!='secret'){
                res.redirect('/login')
            }
            else{
                         req.session.user = username;
                res.redirect('/dashboard');

            }

        // User.findOne({ where: { username: username } }).then(function (users) {
        //     console.log(users)
        //     if (!user) {
        //         res.redirect('/login');
        //     } else if (!user.validPassword(password)) {
        //         res.redirect('/login');
        //     } else {
        //         req.session.user = user.dataValues;
        //         res.redirect('/dashboard');
        //     }
        // });
    });


// route for user's dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect('/login');
    }
});


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});


app.get('/newUser', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/newUser.html');
    } else {
        res.redirect('/login');
    }
});

app.get('/display', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/disp.html');
    } else {
        res.redirect('/login');
    }
});

app.post('/newUser', (req,res) => {

     
        var a=[];
        // Get a reference to the database service
        var database = firebase.database();
      var ref=database.ref("/users")
       ref.once('value', gotData,errData).then(function(){
       var l=a.length
       console.log(a[l-1])
       var nextEle=parseInt(a[l-1])+1;
       console.log(req.body)
       var EMI={}
    for(var i=1;i<=req.body["Term"];i++){
        var month=""+i;
        EMI[month]={
            "AmountRecieved":"NIL",
            "ModeCash":"NIL",
            "ModeCheque":"NIL",
            "ModeDeposit":"NIL",
            "RecievedOn":"NIL",
            "RecievedBy":"NIL",
            "MoneyRecieved":0
        }
    }
    console.log(EMI)
        var ref=database.ref("/users")
        ref.child(nextEle).set({
        '1st Mnth':req.body["1st Month"],
        'Balance':req.body["Balance"],
        "Cheque":"",
        'Date':req.body["Date"],
        "EMI":EMI,
        'EMII':req.body["EMI"],
        'Last Month':req.body["Last Month"],
        'Name':req.body["Name"],
        'Term':req.body["Term"],
        "Total":"",
        "due":"",
        'loan':req.body["Loan"],
        "CurrentMonth":"Month 1"
    });
    
    var ref=database.ref("/users")
        ref.child(nextEle).update({
        EMI
    }).then(function(res){
        console.log(res)
    })
      
        
      })
      
      function gotData(data){
          if(data.val()==undefined||data.val()==null){
              a=a.push(0)
          }   
          else{
              a=Object.keys(data.val())
       
          }
          
        console.log("C"+a.length)
       
      }
        
       
      function errData(err){
          console.log(err)
      }
    
    
    
    // var a=req.body.data;
    //   console.log(a)
   
    
  
  })

  app.post('/updateUser', (req,res) => {
   if(req.body.data.pass!="secret"){
       res.send("Password Incorrect")
   }
   else{
    var a=req.body.data.data;
      
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
   }
  
  })

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
    res.send(data)
    
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

app.post('/fireAshishIndivisual', (req,res) => {
   var cno=req.body.caseNo;


  var ref=database.ref("/users").child(cno)
  ref.on('value',gotData,errData)
  
  
  function gotData(data){
//    var key=Object.keys(data.val())
//    console.log(typeof(key))
var i;
var v=data.val()
    //   for(i in v["EMI"]){
    //       delete v["EMI"][i]
    //   }
      delete v["EMI"]
try {
    
    console.log(v)
    res.send(v)
    
    
} catch (error) {
    console.log(error)
}
  
 
  
  }
    
  
  function errData(err){
      console.log(err)
  }
})
app.post('/recieve', (req,res) => {


    

    console.log(req.body)
   if(req.body.data.pass!="secret"){
       res.send("Incorrect Password")
   }
   else{
        var b= database.ref("/users").child(req.body.data.caseNo).update({
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
const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: `./logs/${year+"-"+month}.log`
        })
    ]
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

// prints date & time in YYYY-MM-DD HH:MM:SS format
var t=year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
var jso={
  "time":t,
  "caseNo":req.body.data.caseNo,
  "amount":req.body.data.amount,
  "name":req.body.data.name
}

    logger.info(jso);
  //   logger.info("bbbbbb")
  res.send("Successful")
   }

})

app.post('/lastElement', (req,res) => {
   
//  console.log(a)
    
  
  })


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`http://localhost:${app.get('port')}`));

