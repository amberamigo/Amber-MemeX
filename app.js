const express = require("express");
// const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const _ = require("lodash");

const app = express();

////for using public folders /////////
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());
// app.use(express.urlencoded());


////////////////////////////  mongoose initialization //////////////////////

mongoose.connect('mongodb://localhost:27017/memesDB', {useNewUrlParser: true, useUnifiedTopology:true });
mongoose.set('useFindAndModify', false);


const memeSchema = {
  id : String, 
  name : String,
  caption : String,
  url : String
};


const Meme = mongoose.model("Meme", memeSchema);

 
 ///////////////////////   default meme ////////////////////
// const meme1 = new Meme ({
// 	id : "1",
//    name : "Amber",
//    caption : "By owner",
//    url : "https://humornama.com/wp-content/uploads/2020/10/Shuru-Majboori-Me-Kiye-The-meme-template-of-Mirzapur.jpg"
// });



var editMeme;

///////////////////////////  home page  //////////////////////
app.get("/", function(req, res){
	Meme.find({}, function(err, memes) {
			res.render("memes", {memeItems : memes});
	});
});


//////////////////////////////////////////  for memes in json for api //////////////////////////////////////////////////////
app.get("/memes", function(req, res) {
	Meme.find({}, function(err, memes) {
		res.json(memes);
	});
});


//////////////////////////////////////////////  post request //////////////////////////////////////////////////////////////
var uniqueId = 1;
app.post("/", function(req, res) {

	const newMeme = new Meme({
	id : uniqueId.toString(),
	name : req.body.name,
	caption : req.body.caption,
	url : req.body.url
	});
    
    Meme.find({name : req.body.name, caption : req.body.caption, url : req.body.url}, function(err, memes) {
			if(memes.length){
				console.log("exists");
				res.status(409).send("Oh uh, Duplicate post!!!");
			}else{
				uniqueId++;
	
                 newMeme.save(function(err){
    	          if(err)
    		         console.log(err);
                 });
                 res.redirect("/");
			}
	});
});
/////////////////////////////////////////////////// for post using api calls /////////////////////////////////////////////
app.post("/memes", function(req, res) {

	const newMeme = new Meme({
	id : uniqueId.toString(),
	name : req.body.name,
	caption : req.body.caption,
	url : req.body.url
	});

	  Meme.find({name : req.body.name, caption : req.body.caption, url : req.body.url}, function(err, memes) {
			if(memes.length){
				console.log("exists");
				res.status(409).send("Oh uh, Duplicate post!!!");
			}else{
				uniqueId++;
	
                 newMeme.save(function(err){
    	          if(err)
    		         console.log(err);
                 });
                  res.json({"id" : (uniqueId-1).toString()});
			}
	});
});


///////////////////////////////////////////// API call for a particular meme ///////////////////////////////////////////
app.get("/memes/:memeId", function(req, res) {
	const id = req.params.memeId;
	console.log(id);
	Meme.find({id : id}, function(err, meme) {
		if(!meme.length){
			res.status(404).send("Oh uh, No match found");
		}else{
			res.json(meme);
		}
	});
    
});
////////////////////////////////////////////////  updating url and caption  /////////////////////////////////////
app.patch('/memes/:id', function (req, res) {
	var memeId = req.params.id;
     Meme.updateOne({id : memeId}, { $set: {caption: req.body.caption, url: req.body.url }}, function(err, res){
   	if(err)
   		console.log(err);
   });
    res.redirect("/");

});

app.post('/memes/edit', function (req, res) {
	cap = req.body.caption;
	url = req.body.url;

   Meme.find({id : editMeme}, function(err, mem){
   	console.log(mem);
   });
   Meme.updateOne({id : editMeme}, { $set: {caption: req.body.caption, url: req.body.url }}, function(err, res){
   	if(err)
   		console.log(err);
   });
    res.redirect("/");
});

app.post("/edit", function(req, res) {
	var newMeme = req.body.id;
	editMeme = newMeme;
     
    res.render("update");
});

// function closeForm() {
//   document.getElementById("myForm").style.display = "none";
// }
// })


//////////////////////////////////////////////////    server local host //////////////////////////////////////////////
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(3000, function() {
  console.log("Server started successfully");
});


