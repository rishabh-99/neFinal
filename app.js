const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

const TWO_HOURS=1000 * 60 * 60 * 2
const{
    PORT = 3000,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET="SHHH!!!, RED CaT",
    SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'
const users  =  [
    {id: 1, name: 'Alex', email: 'alex@gmail.com', password: "secret"}
    
]

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
        
    res.sendFile(__dirname+"/file2.html")
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
            //return res.redirect('/insert')
            res.send("Hey")
           
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

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');


















