var express          = require ("express"),
    methodOverride   = require("method-override"),
    mongoose         = require ("mongoose"),
    bodyParser       = require("body-parser"),
    app              = express(),
    expressSanitizer = require("express-sanitizer");
    
    mongoose.connect("mongodb://localhost:27017/Restful_blog_app",{useNewUrlParser: true});
    app.set("view engine","ejs");
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());
    app.use(express.static("public"));
    app.use(methodOverride("_method"));
    
    var blogSchema= new mongoose.Schema({
        title:String,
        image:String,
        body:String,
        created:{type:Date, default: Date.now}
    })

    var Blog= mongoose.model("Blog",blogSchema);
   
    
    app.get("/",function(req,res){
        res.redirect("/blogs");
       
    });
    
     
    app.get("/blogs",function(req,res){
       Blog.find({},function(err,blogs){
           if(err){
               console.log("error!");
           }
           else{
               res.render("index", {blogs: blogs});
           }
        });
    });
    
    app.get("/blogs/new",function(req,res){
        res.render("new");
    });
    
    app.post("/blogs",function(req,res){
        req.body.blog.body =req.sanitize(req.body.blog.body)
        Blog.create(req.body.blog,function(err, newBLog){
           if(err){
               res.render("new");
           } 
           else{
               res.redirect("/blogs");
           }
        });
    });
    
    app.get("/blogs/:id",function(req,res){
       Blog.findById(req.params.id, function(err, foundBlog){
           if(err){
               res.redirect("/blogs");
           }
           else
           res.render("show",{blog:foundBlog});
       });
    });
    
    app.get("/blogs/:id/edit",function(req,res){
       Blog.findById(req.params.id, function(err, foundBlog){
           if(err){
               res.redirect("/blogs");
           }
           else
           res.render("edit",{blog:foundBlog});
       });
    });
    
    app.put("/blogs/:id",function(req,res){
        req.body.blog.body =req.sanitize(req.body.blog.body)
        Blog.findOneAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
            if(err){
                res.redirect("/blogs");
            }
            else{
               res.redirect("/blogs/"+req.params.id);
            }
        });
    });
    
    app.delete("/blogs/:id",function(req,res){
         Blog.findOneAndDelete(req.params.id, function(err){
            if(err){
                res.redirect("/blogs");
            }
            else{
               res.redirect("/blogs");
            }
        });
    });
    
    app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started"); 
    });