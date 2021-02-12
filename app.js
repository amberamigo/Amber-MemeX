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
const port = 3000;
console.log(port);
mongoose.connect('mongodb://localhost:27017/meme', {useNewUrlParser: true, useUnifiedTopology:true }).then(() => console.log('MongoDB connected'));
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



var editMeme;  // id of the meme to be edited

///////////////////////////////////////////  home page  ///////////////////////////////////////////////////
app.get("/", async function(req, res){
	const allMemes = await Meme.find({});
			res.render("memes", {memeItems : allMemes});
});


//////////////////////////////////////////  to get all memes in JSON //////////////////////////////////////////////////////
app.get("/memes", async function(req, res) {
		const allMemes = await Meme.find({});
		res.json(allMemes);
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

	 Meme.find({name : req.body.name, caption : req.body.caption, url : req.body.url})
	      .then(async function(memes){
	      	if(memes.length){
				res.status(409).send("Oh uh, Duplicate post!!!");
			   }else{
			   	   uniqueId++;
                   const savedMeme = await newMeme.save();
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

	  Meme.find({name : req.body.name, caption : req.body.caption, url : req.body.url})
	      .then(async function(memes){
	      	if(memes.length){
				res.status(409).send("Oh uh, Duplicate post!!!");
			   }else{
			   	   uniqueId++;
                   const savedMeme = await newMeme.save();
                     res.json({"id" : (uniqueId-1).toString()});
			   }
			});
});


///////////////////////////////////////////// API call for a particular meme ///////////////////////////////////////////
app.get("/memes/:memeId", async function(req, res) {
	const id = req.params.memeId;
  try{
	await Meme.find({id : id}, function(err, meme) {
		if(!meme.length){
			res.status(404).send("Oh uh, No match found");
		}else{
			res.json(meme);
		}
	});
    } catch(err){
    	res.status(400).send({message : err.message});
    }
});
////////////////////////////////////////////////  updating url and caption  /////////////////////////////////////
app.patch('/memes/:id', async function (req, res) {
	cap = req.body.caption;
	url = req.body.url;
	editMeme = req.params.id;
try{
   if(!cap.length){
        await Meme.updateOne({id : editMeme}, { $set: {url: req.body.url }}, function(err, res){
   	        if(err)
   		        console.log(err);
            });
     }else if(!url.length){
     	await  Meme.updateOne({id : editMeme}, { $set: {caption: req.body.caption}}, function(err, res){
   	        if(err)
   		        console.log(err);
            });
     }else{
     	await Meme.updateOne({id : editMeme}, { $set: {caption: req.body.caption, url: req.body.url }}, function(err, res){
   	        if(err)
   		        console.log(err);
            });
     }

    console.log(res);
    res.json(res.statusCode);
} catch(err){
	res.status(400).json({message : err.message});
}
});

app.post('/memes/edit', async function (req, res) {
	cap = req.body.caption;
	url = req.body.url;

 try{
   if(!cap.length){
        await Meme.updateOne({id : editMeme}, { $set: {url: req.body.url }}, function(err, res){
   	        if(err)
   		        console.log(err);
            });
     }else if(!url.length){
     	await  Meme.updateOne({id : editMeme}, { $set: {caption: req.body.caption}}, function(err, res){
   	        if(err)
   		        console.log(err);
            });
     }else{
     	await Meme.updateOne({id : editMeme}, { $set: {caption: req.body.caption, url: req.body.url }}, function(err, res){
   	        if(err)
   		        console.log(err);
            });
     }
    res.redirect("/");
} catch(err){
	res.status(400).json({message : err.message});
}
});

app.post("/edit", function(req, res) {
	var newMeme = req.body.id;
	editMeme = newMeme;
     
    res.render("update");
});


//////////////////////////////////////////////////    server local host //////////////////////////////////////////////
// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 8081;
// }



app.listen(port, function() {
  console.log("Server started successfully at " + port);
});
