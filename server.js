const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();

const db = require("./db");
const User = require("./user");
const Place = require("./place");
// console.log(Place);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("GET / is Working");
});

// CRUD: Create, Read, Update, Delete

app.get("/places", (req, res) => {
  // use this if mongoDB didn't work for you
  // res.json(arrServer);

  Place.find({}, (err, data) => {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      res.json(data);
    }
  });
});

app.get("/places/:id", (req, res) => {
  // console.log("37:", req.params.id);

  Place.findById(req.params.id, (err, data) => {
    if (err) {
      console.log("ERROR: ", err);
    } else {
        res.json(data);
    }
  });
});

// Favorite an article
app.post('/add/favorite', function(req, res, next) {
  var articleId = req.body.article_id;
  Place.findById(articleId).then(function (article) {
    if (!article) { return res.sendStatus(404); }

  User.findOne({email: req.body.userEmail}).then(function(user){
    if (!user) { return res.sendStatus(401); }

    return user.favorite(articleId).then(function(){
      return article.updateFavoriteCount().then(function(article){
        return res.json({article: article.toJSONFor(user)});
      });
    });
  })
}).catch(next);
});

// Unfavorite an article
app.post('/delete/favorite', function(req, res, next) {
  var articleId = req.body.article_id;
  Place.findById(articleId).then(function (article) {
    if (!article) { return res.sendStatus(404); }

  User.findOne({email: req.body.userEmail}).then(function (user){
    if (!user) { return res.sendStatus(401); }

    return user.unfavorite(articleId).then(function(){
      return article.updateFavoriteCount().then(function(article){
        return res.json({article: article.toJSONFor(user)});
      });
    });
  })
}).catch(next);
});

// USER
app.post("/users/register", (req, res) => {
  User.create(req.body, (err, newUser) => {
    if (err) {
      // console.log("ERROR: ", err);
      res.status(400).json({ message: "This email already taken" });
    } else {
      // res.status(201).json(newUser);
      res.status(201).json({ message: "Create New User Successfully" });
    }
  });
});

app.post("/users/login", (req, res) => {
  User.find({ email: req.body.email }, (err, arrUserFound) => {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      // console.log(arrUserFound);
      if (arrUserFound.length === 1) {
        // we found the user
        if (req.body.password === arrUserFound[0].password) {
          // password correct
          res.status(200).json({
            message: "Login Successfully",
            username: arrUserFound[0].email,
          });
        } else {
          // password incorrect
          res.status(400).json({
            message: "Wrong Password",
          });
        }
      } else {
        res.status(404).json({
          message: "The email entered is not registered",
        });
      }
    }
  });
});

app.listen(5000, () => {
  console.log("SERVER IS WORKING ..");
});

/*
the up endpoint is replace to these two
app.get("/completed", (req, res) => {
  Place.find({ isCompleted: true }, (err, data) => {
    if (err) {
      console.log("ERR", err);
    } else {
      // console.log(data);
      res.json(data);
    }
  });
});

app.get("/not_completed", (req, res) => {
  Place.find({ isCompleted: false }, (err, data) => {
    if (err) {
      console.log("ERR", err);
    } else {
      // console.log(data);
      res.json(data);
    }
  });
});
*/
