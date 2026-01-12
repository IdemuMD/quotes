const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require('method-override');

const app = express();

const path = require("path")

const default_routes = require("./router/default_routes.js");
const quote_routes = require("./router/quotes_routes.js");

mongoose.connect("mongodb://10.12.2.181:27017/quotes", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use(express.urlencoded({extended:true}))

app.use(methodOverride('_method'));

app.listen(3000, ()=>{
    console.info("Successfully running the server");
});

app.use(default_routes);
app.use('/quotes', quote_routes);
