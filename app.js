const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const lodash = require("lodash");
const date = require(__dirname + "/date.js");

mongoose.connect('mongodb+srv://<username:<password>@cluster0-yanef.mongodb.net/blogDB', {useNewUrlParser: true});

//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const homeStartingContent = "Hello! Welcome to my personal blog website! The website is implemented in HTML, CSS, JavaScript with tools and frameworks like Node.js, Express.js, EJS, body-parser and lodash. If you have any questions, feel free to contact me. Thank you for visiting my website!";
const aboutContent = "I am a graduate student in the Department of Computer Science at the University of California, Irvine. I am now pursuing the degree of Master of Computer Science, and will graduate in December, 2020. I will be a Software Development Engineer Intern at Amazon between June and September of 2020 in Seattle, WA. My goal is to become a full-time Full Stack Developer upon graduation. Before I attended UCI, I obtained my Bachelor degree of Computer Science at Jilin University in Changchun, China. The best honors I was awarded during my undergraduate career were the First Class Scholarship and Outstanding Student of College in the College of Computer Science and Technology.";
const contactContents = ["yuliz12@uci.edu", "https://www.linkedin.com/in/yulinzhang0822", "https://github.com/yulinzhang0822", "https://sites.google.com/view/yulinzhang"];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogSchema = new mongoose.Schema ({
  title: String,
  date: String,
  content: String
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res) {
  Blog.find({}, function(err, foundBlogs) {
    if(!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        blogs: foundBlogs
      });
    }
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const blogTitle = req.body.blogTitle;
  const blogDate = date.getDate();
  const blogContent = req.body.blogContent;
  const blog = new Blog({
    title: blogTitle,
    date: blogDate,
    content: blogContent
  });
  blog.save(function(err) {
    if(!err) {
      res.redirect("/");
    }
  });
});

app.get("/blogs/:blogID", function(req, res) {
  const requestedBlogID = req.params.blogID;
  Blog.findOne({_id: requestedBlogID}, function(err, foundBlog) {
    if(!err) {
      res.render("blog", {
        title: foundBlog.title,
        date: foundBlog.date,
        content: foundBlog.content
      });
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContents: contactContents});
});

let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
