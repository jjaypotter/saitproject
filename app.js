const express = require('express');
const app = express();
const path = require('path');
const streamParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
const crypto = require('crypto');

// some configuration
let pool = mysql.createPool({
  host: "ec2-35-164-148-141.us-west-2.compute.amazonaws.com",
  user: "root",
  password: "passwd1",
  database: "travelexpert"
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

app.get('/', (req, res)=> {
  res.render("index")
});

app.get('/index', (req, res) => {
  res.render("index")
});

app.get('/register', (req, res) => {
  res.render("register")
});

app.get('/contact', (req, res) => {
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log(" contact connection is ok");
    let agentsquery = "select * from agents";
    connection.query(agentsquery, function(err, result, fields) {
      if (err) throw err;
      // console.log(result);
      // Object.keys(result).forEach(function(key) {
      //   let row = result[key];
      //   console.log(row.AgtFirstName)
      // });
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

app.get('/order', (req, res) => {
  res.render("order")
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
    });
    connection2.release();
  });
  res.redirect('/thanks-register')
});




app.post("/order_form", (req, res) => {

    res.redirect('/thanks-booking')
});
 




// app.get('/view_custInfo', (req, res) => {
// });

// app.get("/vacation-packages", (req,res)=>{
//     conn.connect((err) => {
//         if (err) throw err;
//         conn.query(sql, (err, result, fields) => {
//         })
//     })
// });

app.get('*', (req,res)=>{
    res.status(404).send('Sorry, we can NOT find the file reqeusted.');
});

