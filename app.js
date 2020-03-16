const express = require('express');
const app = express();
// const path = require('path');
const streamParser = require('body-parser');
// const fs = require('fs');
const mysql = require('mysql');
const crypto = require('crypto');
const textgen = require("./custom_modules/textgen");


// some configuration
let pool = mysql.createPool({
  host: "ec2-35-164-148-141.us-west-2.compute.amazonaws.com",
  user: "root",
  password: "passwd1",
  database: "travelexpert",
  dateStrings:"date"
});
const hashsalt = 'd9399cd68197e17f7e656b481e217483';
app.use(streamParser.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + '/static'));


// service listening and page routing
app.listen(8000, (err) => {
  if (err) throw err;
  console.log("Server listening to port 8000...")
});


// index page, packages are from database
app.get('/', (req, res)=> {
  pool.getConnection(function(err, connection3) {
    if (err) throw err;
    console.log("package connection is ok");
    let pkquery = "select * from packages";
    connection3.query(pkquery, function(err, packages) {
      if (err) throw err;
      // let content2 = '<h1> try to see </h1>';
      let content2 = '';
      packages.forEach(package => {
        let orderurl = "order/" + package.PackageId;
        content2 += `<figure class=""> <a href=${orderurl} target="_blank">
                    <img src="img/logo_index.JPG" class="" alt="${package.PkgName}">
                    <div class="">
                    <p>Location: <strong>${package.PkgName}</strong> <br>Avaialbel: In Summer, ${package.PkgName}, In Winter, ${package.PkgName} <br></p>
                    </div>
                    </a>
                    </figure>`
      });
      // console.log(content2);
      res.render("index", {gallery1:packages, gallery2:content2});
      connection3.release();
    });
  });
});



app.get('/index', (req, res) => {
  res.redirect("/");
});

app.get('/register', (req, res) => {
  res.render("register")
});


// show some agents from database, and additional contact info
app.get('/contact', (req, res) => {
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log(" contact connection is ok");
    let agentsquery = "select * from agents";
    connection.query(agentsquery, function(err, result, fields) {
      if (err) throw err;
      res.render("contact", {result:result});
      connection.release();
    });
  });
});


app.get('/thanks-register', (req, res) => {
  res.render("thanksRegister")
});

app.get('/thanks-booking', (req, res) => {
  res.render("thanksBooking")
});


// read the package selection from index page and display related info
app.get('/order/:packageChoice', (req, res) => {
  let pkId = req.params.packageChoice;
  pool.getConnection(function(err, connection4) {
    if (err) throw err;
    let pdquery = "select * from packages where packageId=?" ;
    connection4.query(pdquery,[pkId], function(err, result) {
      if (err) throw err;
      res.render("order", {pkDetails:result[0]});
      connection4.release();
    });
  });
});


// store all the registered information to customer table, password is hashed before storing
app.post("/post_form", (req, res) => {
  pool.getConnection(function(err, connection2) {
    if (err) throw err;
    let query2 = "INSERT INTO customers (CustUserID, CustPasswd, CustName, CustAddress, CustCity, CustProv, CustPostal, CustPhone, CustEmail, CustMsg ) VALUES (?,?,?,?,?,?,?,?,?,?) ";
    let hashpw = crypto.pbkdf2Sync(req.body.password, hashsalt, 1000, 64, `sha512`).toString('hex');
    let data1 = [req.body.userID, hashpw, req.body.name, req.body.address, req.body.city, req.body.prov, req.body.postalCode, req.body.phone, req.body.email, req.body.message];
    connection2.query(query2, data1, function(err, result) {
      if (err) throw err;
      console.log(result.affectedRows);
      connection2.release();
      res.redirect('/thanks-register')
    });
  });
});


app.post("/order_form", (req, res) => {
  let custAccount = req.body.userID;
  let custPw = req.body.password;
  let hashpw = crypto.pbkdf2Sync(custPw, hashsalt, 1000, 64, `sha512`).toString('hex');
  let accountQuery = "select * from customers where CustUserID=?"
  pool.getConnection(function(err, connection5) {  
    if (err) throw err;
    connection5.query(accountQuery, custAccount, function(err, result) {
      if (err) throw err;
      if (hashpw == result[0].CustPasswd) {
        console.log("password is good");
        let insertOrder = "INSERT INTO bookings(BookingDate,BookingNo,TravelerCount,CustomerId,PackageId) VALUES (?,?,?,?,?)";
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let bookingDate = year + "-" + month + "-" + date;
        // https://usefulangle.com/post/187/nodejs-get-date-time
        let bookingNo = textgen.maketext(8)
        let orderInfo = [bookingDate,bookingNo,req.body.travelerCount,result[0].CustomerId,req.body.pkgID];
        connection5.query(insertOrder, orderInfo, function(err, result) {
          if (err) throw err;
          console.log(result.affectedRows);   // double check this one
        });
        connection5.release();
        res.redirect('/thanks-booking');
      }else{
        res.send(500,'wrong account or password')
        connection5.release();
      };
    });
  });  
});


app.get('*', (req,res)=>{
    res.status(404).send('Sorry, we can NOT find the file reqeusted.');
});

