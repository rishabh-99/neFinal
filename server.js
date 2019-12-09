var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const winston = require('winston');


var cors = require('cors');




// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 9000);
app.use(cors());
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
            console.log(req.body)
        var username = req.body.email,
            password = req.body.password;
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
        // firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
        // .then(function(result) {
        //     req.session.user=req.body.email
        //   res.redirect('/dashboard')
        //   console.log(result)
        // }).catch(function(error) {
        //   res.redirect('/login')
        //   console.log(error)
        // });
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
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
          });
          
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
app.get('/indivisual', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/indivisual.html');
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
  
        EMI["1"]={
            "AmountRecieved":"NIL",
            "ModeCash":"NIL",
            "ModeCheque":"NIL",
            "ModeDeposit":"NIL",
            "RecievedOn":"NIL",
            "RecievedBy":"NIL",
            "MoneyRecieved":0
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
        "currentMonth":1,
        "moneyRecieved":0
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
      console.log(req.body.data)
   if(req.body.data.pass!="secret"){
       res.send("Password Incorrect")
   }
   else{
    var a=req.body.data;
      console.log(a)
     database2.ref("/users").child(a["CaseNo"]).update({
        '1st Mnth':a["1st Mnth"],
        'Balance':a["Balance"],
        'Cheque':a["Cheque"],
        'EMII':a["EMII"],
        'Last Month':a["Last Month"],
        'Name':a["Name"],
        'Term':a["Term"],
        'Date':a["Date"],
        'Total':a["Total"],
        'Due':a["Due"],
        'loan':a["Loan"]
      }).then(function(data){
          console.log(data)
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

app.post('/fireAshishDefaulters', (req,res) => {
    var a=[]
    var resultS
    var key
    


  var ref=database.ref("/users")
  ref.on('value',gotData,errData)
  
  
  function gotData(data){
//    var key=Object.keys(data.val())
//    console.log(typeof(key))
//    console.log(key)
var defaulters=[]
var normal=[]
    var ab=data.val()
    var arr=Object.keys(ab)
try {
    for(var i=0;i<arr.length;i++){
        // console.log("AAAAAAAAAAAAA     "+ab[arr[i]].CurrentMonth)
        if(ab[arr[i]]["moneyRecieved"]=='1'){
          normal.push(`${arr[i]}`)
          
        }
        else{
          defaulters.push(`${arr[i]}`)
        }
        
      }
      var total=defaulters.concat(normal)
      res.send(total)
    
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
        var dataEMI={};
                  if(req.body.username=='alex@gmail.com'&&req.body.password=='secret'){
                      
                    function createEMI(){
                        var mode=req.body.Rdata.Mode
                        if(mode=="Cash"){
                            dataEMI={
                                "AmountRecieved": req.body.Rdata.AmountRecieved,
                                "ModeCash": req.body.Rdata.Det,
                                "ModeCheque": "NIL",
                                "ModeDeposit":"NIL",
                                "MoneyRecieved":1,
                                "RecievedBy": req.body.Rdata.RecievedBy,
                                "RecievedOn": req.body.Rdata.RecievedOn,
                                "RecievedOnMonth": req.body.Rdata.RecievedOnMonth,
                                "RecievedOnYear": req.body.Rdata.RecievedOnYear
                            }
                          
        
                        }
                        else if(mode=="Cheque"){
                            dataEMI={
                                "AmountRecieved": req.body.Rdata.AmountRecieved,
                                "ModeCash": "NIL",
                                "ModeCheque": req.body.Rdata.Det,
                                "ModeDeposit":"NIL",
                                "MoneyRecieved":1,
                                "RecievedBy": req.body.Rdata.RecievedBy,
                                "RecievedOn": req.body.Rdata.RecievedOn,
                                "RecievedOnMonth": req.body.Rdata.RecievedOnMonth,
                                "RecievedOnYear": req.body.Rdata.RecievedOnYear
                            }
                          
                        }
                        else if(mode=="Deposit"){
                            dataEMI={
                                "AmountRecieved": req.body.Rdata.AmountRecieved,
                                "ModeCash": "NIL",
                                "ModeCheque": "NIL",
                                "ModeDeposit":req.body.Rdata.Det,
                                "MoneyRecieved":1,
                                "RecievedBy": req.body.Rdata.RecievedBy,
                                "RecievedOn": req.body.Rdata.RecievedOn,
                                "RecievedOnMonth": req.body.Rdata.RecievedOnMonth,
                                "RecievedOnYear": req.body.Rdata.RecievedOnYear
                            }
                            
                            
                        }
                        
                    }
                        createEMI()
                      
                  }
                  else{
                      res.send("Incorrect Password")
                  }
              


               
         

    

   
//   

})




// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`http://localhost:${app.get('port')}`));

