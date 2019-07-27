var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var routes = require("./controller/controller")
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 3000;
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extented: true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

// Routes
app.use(routes);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
