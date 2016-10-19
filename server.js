var express = require('express')
 ,bodyParser = require('body-parser')
 ,RestClient = require('node-rest-client').Client
 , mongoClient = require('mongodb');
 
 
var app = express();
var restCli = new RestClient();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/static'));


var db;
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/jcd';


mongoClient.connect(url, function(err, _db){
	if(err){
		console.log(err);
		process.exit(1);
	}
	db = _db;
});


var router = express.Router();


router.get('/:date', function(req, res) {
	var dte = req.params.date;
	var retour = new Array;
	
	console.log("param : " + dte);
	
	db.collection('velo').find({date:dte}).toArray(function(err, results){
		res.json(results);
	});  
});

app.use('/api', router);


app.listen(process.env.PORT, function(){
	console.log('Serveur lance');
});