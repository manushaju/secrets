//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

// To connect to the database - todoDB
mongoose.connect('mongodb+srv://manu_shaju_mongo:626688@cluster0.rgqoc.mongodb.net/secretDB', { useNewUrlParser: true, useUnifiedTopology: true });

console.log(process.env.API_KEY);

const app = express();

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));


// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields:['password']});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) =>{
  res.render('home');
})

app.get('/login', (req, res) =>{
  res.render('login');
})

app.get('/register', (req, res) =>{
  res.render('register');
})

app.post('/register', (req, res) =>{
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save((err) =>{
    if (err){
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post('/login', (req, res) => {
  const userN = req.body.username;
  const pwd = req.body.password;
  User.findOne({email: userN}, (err, data) =>{
    if(!err){
      if(data){
        if (pwd == data.password){
          res.render('secrets');
        } else {
          res.render('login');
        }
      }
    }
  });

});

app.listen(process.env.PORT || 3000, () =>{
  console.log("Server started....");
});
