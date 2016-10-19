'use strict';


angular.module('mapApp')
 .factory('mapService', mapService);
 
mapService.$inject = ['$http', '$log'];

function mapService($http, $log){
	
	var service = {getAll: getAll};
	
	return service;
	
	function getAll(){
		return $http.get('api/').then(successCallback, errorCallback);
	}
	
	
	function successCallback(response){
		return response.data;
	};
	
	function errorCallback(response){
		$log.error("Erreur survenue lors de l'appel du service distant requeteService", angular.toJson(response), "Erreur technique");
		//Wrapping the rejected response to the upper level
		return $q.reject(response);
	}
};