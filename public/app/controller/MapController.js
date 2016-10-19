'use strict';

angular.module('mapApp')
	.controller('mapCtrl', mapCtrl);
	
	
mapCtrl.$inject = ['$scope', 'mapService', '$log'];


function mapCtrl($scope, mapService, $log){
	var vm = this;
	vm.pojs = {};
	
	vm.center={
		lng: 4.842223,
        lat: 45.759723,
        zoom: 12};
	
	vm.submitSearch = submitSearch;
	
	var genMarker = L.ExtraMarkers.icon({
		type: 'extraMarker',
		icon: 'glyphicon-bookmark',
		markerColor: 'white',
		shape: 'square',
		prefix: 'glyphicon'
	  });
	
	activate();
	
	
	////////////////////
	//   function def
	///////////////////
	  
	function activate(){
		vm.markers = {};
		var dteToParse = new Date();
		vm.pojs.dte = dteToParse.getFullYear() + "-" + ((dteToParse.getMonth() + 1)%12) + "-" + dteToParse.getDate();
		vm.pojs.hour = new Date().getHours();
		
		getData(vm.pojs.dte, vm.pojs.hour);
	}
	
	function submitSearch(){
		getData(vm.pojs.dte, vm.pojs.hour);
		$log.info("search submited");
	}
	
	function getData(dte, hour){
		mapService.getAll(dte).then(
			function successCallback(data){
				data.forEach(function(item, index){
					vm.markers[index] = returnMarkWithColor(item, hour);				
				});
			
			},
			function errorCallback(error){
				
			}
		);
	}
	
	function returnMarkWithColor(obj, hour){
		var objReturn = {};
		
		objReturn.lat = obj.loc.lat;
		objReturn.lng = obj.loc.lng;
		objReturn.message = obj.name;
		objReturn.draggable = false;
		
		var ratio = obj.data[String(hour)].available_bikes/obj.data[String(hour)].bike_stands;
				
		var marker = jQuery.extend({},genMarker.options);
		
		if(ratio >= 0.8){
			marker.markerColor = 'green';
		}
		if(ratio < 0.8 && ratio >= 0.5){
			marker.markerColor = 'orange';
		}
		if(ratio < 0.5){
			marker.markerColor = 'red';
		}

		objReturn.icon = marker;
		
		return objReturn;
	}
}