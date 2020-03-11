const express = require('express');
const app = express();
const path = require('path');
const streamParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');

// some configuration
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "travelexperts"
});
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
  res.render("contact")
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





app.post("/post_form", (req, res) => {

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

