var RestClient = require('node-rest-client').Client
 ,mongoCli = require('mongodb')
 , schedule = require('node-schedule');
 
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/jcd';

var restCli = new RestClient();

var db;

mongoCli.connect(url, function(err, _db){
	if(err){
		console.log(err);
		process.exit(1);
	}
	
	db = _db;
});

// every minutes
//var job = schedule.scheduleJob('0 */1 * * * *', processData);

// every hours and 1 minute
var job = schedule.scheduleJob('0 1 */1 * * *', processData);

function processData(){
	console.log('Working at: ' + new Date());
	var col = db.collection("velo");
	
	restCli.get("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=" + process.env.API_KEY, function(data,response){
		var curDate = new Date();
		data.forEach(function(item, index){			
			col.findOne({doc_id:item.number, date:curDate.toLocaleDateString()}, function(err, doc){
				if(doc){
					updateDoc(col, item, doc, curDate);
				}else{
					insertDoc(col, item, curDate);
				}		
			});					
		});
		
	});
};

function insertDoc(col, item, curDate){
	var docToInsert = {
		
		doc_id:item.number,
		date: curDate.toLocaleDateString(),
		
		loc:{
			lat: item.position.lat,
			lng: item.position.lng
		},
		lastupdated: item.last_update,
		data:{
			0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{},9:{},10:{},11:{},12:{},13:{},14:{},15:{},16:{},17:{},18:{},19:{},20:{},21:{},22:{},23:{}
		}
	};
	docToInsert.data[curDate.getHours()].bike_stands=item.bike_stands;
	docToInsert.data[curDate.getHours()].available_bike_stands=item.available_bike_stands;
	docToInsert.data[curDate.getHours()].available_bikes=item.available_bikes;
	
	col.insert(docToInsert, function(err,newDoc){
		if(err){
			console.log(err);
		}
	});
};

function updateDoc(col, item, docToUpdate, curDate){
	docToUpdate.data[curDate.getHours()].bike_stands=item.bike_stands;
	docToUpdate.data[curDate.getHours()].available_bike_stands=item.available_bike_stands;
	docToUpdate.data[curDate.getHours()].available_bikes=item.available_bikes;	
	
	col.update({_id:docToUpdate._id}, docToUpdate, function(err,newDoc){
		if(err){
			console.log(err);
		}
	});
};