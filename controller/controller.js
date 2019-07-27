var mongoose = require("mongoose")
var express = require("express");
var router = express.Router();

//using axios and cheerio for scraping
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models")

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

router.get("/", function (req, res) {
  res.render("index")
})

router.get("/saved", function (req, res) {
  res.render("saved");
})

// A GET route for scraping the echoJS website
router.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.npr.org/sections/news").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $("div.item-info").each(function (i, element) {

      var result = {};
      result.title = $(this).children("h2.title").children("a").text();
      result.link = $(this).children("h2.title").children("a").attr("href");
      result.summary = $(this).children("p.teaser").children("a").text();
      result.save = false;

      // Create a new Article using the `result` object built from scraping.  Activity 20
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db.  Activity 20
router.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
  console.log(req.params.id);
  db.Note.find({ article: req.params.id })
    .then(function (dbArticles) {
      res.json(dbArticles)
    })
    .catch(function (error) {
      res.json(error)
    });
})

// Route for saving/updating an Article's associated Note.  Activity 20
router.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Note.findOneAndUpdate({ _id: dbNote._id }, { article: req.params.id }, { new: true });//{new:true}
    })
    .catch(function (error) {
      res.json(error)
    })
})
router.post("/savethisarticle/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { artsave: true })
    .then(function (dbNote) {
      res.json(dbNote)
    })
    .catch(function (error) {
      res.json(error)
    })
})

//deletes article and all notes associated with it
router.delete("/deletethisarticle/:id", function (req, res) {
  db.Note.deleteMany({ article: req.params.id })
    .then(function () {
      db.Article.deleteOne({ _id: req.params.id })
        .then(function () {
          res.send();
        })
        .catch(function (err) {
          console.log(err);
        })
    })
    .catch(function (error) {
      res.json(error)
    })
})

module.exports = router;