var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoMovieNews", { useNewUrlParser: true });

// Routes

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });


app.get("/saved", function(req, res) {
    res.sendFile(path.join(__dirname, "public/articleSave.html"));
});

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://screenrant.com/movie-news/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:

        let counter = 0;
        // var dataArr = [];
    $("article .bc-info").each(function(i, element) {
      // Save an empty result object
      var result = {};
      
      result.url = $(this).find("a").attr("href")
      result.title = $(this).find(".bc-title").text()

      result.summary = $(this).children(".bc-excerpt").text()

      // Create a new Article using the `result` object built from scraping
     if (result.title && result.url && result.summary){

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
          counter++;
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
      }
          

    });


    // If we were able to successfully scrape and save an Article, send a message to the client
    res.sendFile(path.join(__dirname, "public/index.html"));

  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(show) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(show);
    })
    .catch(function(err, show) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for grabbing a specific Article by id, and update it's isSaved property
app.put("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that updates the matching one in our db...
  db.Article.update({ _id: req.params.id}, {$set: {isSaved: true}})

    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});




// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});




// route for deleting an article
  app.delete("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that updates the matching one in our db...
    db.Article.remove({ _id: req.params.id})

    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});