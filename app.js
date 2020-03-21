/* Author:        Jin Li (most parts, including database, server connection, and encryption), 
                  Yeji Soh(Overall structure and show package info on the images.), 
                  Jacobus Badenhorst(package date validation) */
//Date:          03/20/2020 
//Course Module: CPRG 210 XM5
//Assignment:    Proj-207 Travel Experts


// Import modules
const express = require('express');
const app = express();
const streamParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');
const textgen = require("./custom_modules/textgen");
const moment = require('moment');

// Some configurations
let pool = mysql.createPool({
  host: "ec2-35-164-148-141.us-west-2.compute.amazonaws.com",
  user: "root",
  password: "passwd1",
  database: "travelexpert",
  dateStrings:"date"
});

// Encryption
const hashsalt = 'd9399cd68197e17f7e656b481e217483';
app.use(streamParser.urlencoded({ extended: true }));

// Set pug engine
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

// Use static folder for css, images, and javascript
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
      let content2 = '';
      
      // Check if package date is valid. If end date >= current data, display. If start date < current date, make start date bold
      let dateColor = '';
      let currentDate = moment();
      packages.forEach(package => {

        // Get start and end dates
        let startDate = moment(`${package.PkgStartDate}`);
        let endDate = moment(`${package.PkgEndDate}`);

        // Set dates color to red if past, yellow if ongoing, and green if not happened yet
        if (currentDate >= endDate){
          dateColor = 'red';
        } else if (currentDate >= startDate && currentDate <= endDate) {
          dateColor = 'yellow';
        } else {
          dateColor = 'green';
        }

        // Insert package data into html string with variables and classes embedded
        let orderurl = "order/" + package.PackageId;
        content2 += `<figure class="img_${package.PackageId}"> <a href=${orderurl} target="_blank">
                    <img src="../img/${package.PkgImg}.JPG" class="gallery_img" alt="${package.PkgName}"> 
                    <section class="overlay_${package.PackageId}">
                    <p class=${dateColor}>
                    Name: <strong>${package.PkgName}</strong> <br>
                    Description: ${package.PkgDesc} <br>
                    Period: ${package.PkgStartDate} - ${package.PkgEndDate} <br>
                    Price: CAD ${package.PkgBasePrice}
                    </p>
                    </section>
                    </a>
                    </figure>`
      });

      res.render("index", {gallery2:content2});
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

// show agents from each agency from database, and additional contact info
app.get('/contact', (req, res) => {
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log(" contact connection is ok");
    let agencyquery = "select * from agencies";
    connection.query(agencyquery, function(err, result) {
      if (err) throw err;
      agencies = result;
  
      let agentsquery = "select * from agents where agents.AgencyId = ?";
      connection.query(agentsquery,['1'], function(err, result2) {
        if (err) throw err;
        agents1 = result2;
        connection.query(agentsquery,['2'], function(err, result3) {
          if (err) throw err;
          agents2 = result3
          res.render("contact", {agencies:agencies, agentList1:agents1, agentList2:agents2});
          connection.release();
        });
      });
    });
  });
});
  

// get thank-you pages
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


// main order form
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


// if page not found, paste in message
app.get('*', (req,res)=>{
    res.status(404).send('Sorry, we can NOT find the file reqeusted.');
});

