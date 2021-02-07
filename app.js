const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const _ = require("lodash");

const app = express();

////for using public folders /////////
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


////////////////////////////  mongoose initialization //////////////////////

mongoose.connect('mongodb://localhost:27017/memesDB', {useNewUrlParser: true, useUnifiedTopology:true });
mongoose.set('useFindAndModify', false);


const memeSchema = {
  id : Number, 
  name : String,
  caption : String,
  url : String
};


const Meme = mongoose.model("Meme", memeSchema);
 
 ///////////////////////   default meme ////////////////////
const meme1 = new Meme ({
	id : 1,
   name : "Amber",
   caption : "By owner",
   url : "https://humornama.com/wp-content/uploads/2020/10/Shuru-Majboori-Me-Kiye-The-meme-template-of-Mirzapur.jpg"
});
const meme2 = new Meme ({
	id : 2,
   name : "Amber",
   caption : "By owner",
   url : "https://humornama.com/wp-content/uploads/2020/10/Shuru-Majboori-Me-Kiye-The-meme-template-of-Mirzapur.jpg"
});

// const defaultMeme = [meme1, meme2];


///////////////////////////  home page  //////////////////////
app.get("/", function(req, res){
	Meme.find({}, function(err, memes) {
		if(memes.length === 0){
			Meme.insertMany(defaultMeme, function(err){
				if(err){
					console.log(err);
				}else{
				console.log("Added default meme");
			    }
			});
			res.redirect("/");
		}else{
			res.render("memes", {memeItems : memes});
		}
	});
});



////////////////////  post request ///////////////////////

app.post("/", function(req, res) {

	const newMeme = new Meme({
	id : req.body.id,
	name : req.body.name,
	caption : req.body.caption,
	url : req.body.url
	});
	
    newMeme.save();
    res.redirect("/");
	
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(3000, function() {
  console.log("Server started successfully");
});


