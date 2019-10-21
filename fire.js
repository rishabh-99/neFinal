// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/database");

var i=0;
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
  var a=[];
  // Get a reference to the database service
  var database = firebase.database();
var ref=database.ref("/users")
ref.once('value',gotData,errData)

function gotData(data){
   a=Object.keys(data.val())
   var EMI={}
   for(var i=1;i<=10;i++){
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
   for(var i=0;i<a.length;i++){
    var mr=1;
    if(i%2==0){
      mr=0
    }
    database.ref("/users").child(a[i]).update({
      "MoneyRecieved":mr
    })

   }
 
  console.log(a)
 
}
  
  console.log("BBBBBBBB"+a)
function errData(err){
    console.log(err)
}
//  console.log(a)












///tes2t/HariNotSir/logs