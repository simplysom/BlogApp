var express=require('express');
var bodyParser=require('body-parser');
var expressSanitizer=require('express-sanitizer');
var mongoose=require('mongoose');
var methodOverride=require('method-override');
var app=express();
mongoose.connect("mongodb+srv://som:som12345@cluster0.wmh8p.mongodb.net/<dbname>?retryWrites=true&w=majority",{useNewUrlParser:true});
const db=mongoose.connection;
db.on('error',error => console.error("error"));
db.once('open',() => console.log("connected to mongoose!!"));

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//Mongoose model config
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
}) 
/* 
Blog.create({
    title:"My first Blog",
    image:"https://image.shutterstock.com/image-photo/friends-hikers-sitting-on-bench-260nw-587557163.jpg",
    body:"This is my first blog"
}) */
var Blog=mongoose.model("Blog",blogSchema);
//Restful Routes
app.get('/',function(req,res){
    res.redirect("/blogs");
})
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    })
})

//Create route
app.get('/blogs/new',function(req,res){
    res.render('new');
})
//Show route
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog})
        }
    })
})
//edit route
app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog})
        }
    })
})
//update route
app.put('/blogs/:id',function(req,res){
    //req.body.blog.body=expressSanitizer(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

app.post('/blogs',function(req,res){
    /* var title=req.body.title;
    var image=req.body.image;
    var body=req.body.body;
    var new_blog={title:title,image:image,body:body}; */
    //req.body.blog.body=expressSanitizer(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){

        if(err){
            res.render('new');
        }
        else{
            res.redirect('/blogs');
        }
    })
})

//delete route
app.delete('/blogs/:id',function(req,res){
    Blog.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
})
app.listen(3000,function(){
    console.log("Server is running");
})