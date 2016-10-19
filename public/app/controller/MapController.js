'use strict';

angular.module('mapApp')
	.controller('mapCtrl', mapCtrl);
	
	
mapCtrl.$inject = ['$scope', 'mapService', '$log'];


function mapCtrl($scope, mapService, $log){
	var vm = this;
	vm.message = "Hey You !";
	vm.center={
		lng: 4.842223,
        lat: 45.759723,
        zoom: 12};
	
	activate();
	
	var genMarker = L.ExtraMarkers.icon({
		type: 'extraMarker',
		icon: 'glyphicon-bookmark',
		markerColor: 'red',
		shape: 'square',
		prefix: 'glyphicon'
	  });
	  
	  
	function activate(){
		vm.markers = {};
		
		mapService.getAll().then(
			function successCallback(data){
				data.forEach(function(item, index){
					vm.markers[index] = returnMarkWithColor(item);				
				});
			
			
				//vm.markers = { pt1:returnMarkWithColor(data[0])};
			},
			function errorCallback(error){
				
			}
		);
	}
	
	function returnMarkWithColor(obj){
		var objReturn = {};
		
		objReturn.lat = obj.position.lat;
		objReturn.lng = obj.position.lng;
		objReturn.message = obj.name;
		objReturn.draggable = false;
		
		var ratio = obj.available_bike_stands/obj.available_bikes;
		
		//var marker = genMarker.options;
		
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