var express = require('express')
 ,bodyParser = require('body-parser')
 ,RestClient = require('node-rest-client').Client
 ,dataStore = require('nedb');
 
 
var app = express();
var restCli = new RestClient();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('.\\public'));
app.use('/static', express.static('.\\static'));

var db = new dataStore({filename: '.\\data\\store\\map.db'});

db.loadDatabase(function(err){
	if(err){
		console.log(err);
		process.exit(1);
	}
	
	restCli.get("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=" + process.env.API_KEY, function(data,response){
		db.remove({}, {multi:true},function(err, cnt){
			db.insert(data, function(err){
				if(err){
					console.log(err);
				}
			});			
		});
	});	
});


var router = express.Router();



router.get('/', function(req, res) {

	db.find({}, function(err,docs){
		res.json(docs);  
	});    
});

app.use('/api', router);


app.listen(process.env.PORT, function(){
	console.log('Serveur lancé');
});