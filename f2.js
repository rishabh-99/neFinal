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

  // Get a reference to the database service
  var database = firebase.database();

var ref=database.ref("/users")
ref.on('value',gotData,errData)

function gotData(data){
 var key=Object.keys(data.val())
 console.log(typeof(key))
 console.log(key)
 

}
  

function errData(err){
    console.log(err)
}
//  console.log(a)
  