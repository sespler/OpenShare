// presets
var express     = require("express"),
    app         = express(),
    mysql       = require("mysql"),
    Sequelize   = require("sequelize"),
    bodyParser  = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var connection = new Sequelize("openshare", "seth", "root");


//==========================
//          MODELS
//==========================

// post monel
var Post = connection.define("post", {
    description: Sequelize.TEXT,
    author: Sequelize.STRING,
    image: Sequelize.STRING
});
// model for a user
var User = connection.define("user", {
    username: Sequelize.STRING,
    name: Sequelize.STRING,
    birthDate: Sequelize.STRING
});
// model for a comment
var Comment = connection.define("comment", {
    postId : Sequelize.STRING,
    content: Sequelize.TEXT,
    author: Sequelize.STRING
});


connection.sync();

// // CREATE A USER
// Post.create({
//     title: "this is some random gay post",
//     body: "gay gaythrem ipsum sorthrem ipsum sorem ipsum some gay lorem ipsum something gay gay gaythrem ipsum sorem ipsum some gay lorem ipsum something gay gay gaythrem ipsum sor",
//     author: "Sam Harris"
// });

//==========================
//          ROUTES
//==========================

app.get("/", function(req, res){
    res.send("fantastic this is the lading page");
});

// INDEX - SHOWS ALL THE POSTS
app.get("/posts", function(req, res){
    Post.findAll({}).then(function(thing){
        var posts = thing;
        res.render("posts", {posts: posts});
    });
});

// NEW - MAKES A NEW POST
app.get("/posts/new", function(req, res){
    res.render("new");
});

// NEW POST - CREATES THE NEW POST REQUEST  
app.post("/posts", function(req, res){
    // create the blog
    Post.create({
        description: req.body.post.description,
        author: req.body.post.author,
        image: req.body.post.image
    }).then(function(){
        res.redirect("/posts");
    }); 
});

// SHOW - SHOWS THE POST IN MORE DETAIL
app.get("/posts/:id", function(req, res){
    var renderPost;
    Post.findAll({
        where: {
            id: req.params.id
        }
    }).then(function(foundPost){
        renderPost = foundPost[0];
        Comment.findAll({
            where: {
                postId: req.params.id
            }
        }).then(function(comments){
            res.render("show", {post: renderPost, comments: comments });
        });
    });
});
// EDIT - EDIT THE POST YOU ARE LOOKING AT
app.get("/posts/:id/edit", function(req, res){
    Post.findAll({
        where: {
            id: req.params.id
        }
    }).then(function(foundPost){
        var renderPost = foundPost[0];
        res.render("edit", {post: renderPost});
    });
});
// UPDATE - UPDATE THE POST YOUR LOOKED AT
app.post("/posts/:id/update", function(req, res){
    Post.update({
        image: req.body.post.image,
        author: req.body.post.author,
        description: req.body.post.description
    }, {
        where: {
            id: req.params.id
        }
    }).then(function(){
        res.redirect("/posts");
    });
});

// DELETE - DELETE THE POST YOU ARE LOOKING AT
app.post("/posts/:id", function(req, res){
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(){
        Comment.destroy({
            where: {
                postId: req.params.id
            }
        }).then(function(){
            res.redirect("/posts");
        });
    });
});

// *************************
//      COMMENT ROUTES
// *************************
app.post("/comments/new/:id", function(req, res){
    Comment.create({
        content: req.body.comment.content,
        author: req.body.comment.author,
        postId: req.params.id
    }).then(function(){
        res.redirect("/posts")
    });
});


// start the server
app.listen(3000, function(){
    console.log("this is gay sir");
});

