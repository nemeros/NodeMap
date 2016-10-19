'use strict';


angular.module('mapApp')
 .factory('mapService', mapService);
 
mapService.$inject = ['$http', '$log', '$q'];

function mapService($http, $log, $q){
	
	var service = {getAll: getAll};
	
	return service;
	
	var lastDateCalled;
	var dataCache;
	
	function getAll(dte){
		if(dte === lastDateCalled){
			var defer = $q.defer();
			
			defer.resolve(dataCache);
			return defer.promise;
		}
		
		lastDateCalled = dte;
		return $http.get('api/'+dte).then(successCallback, errorCallback);
	}
	
	function successCallback(response){
		
		dataCache = response.data;
		return response.data;
	};
	
	function errorCallback(response){
		$log.error("Erreur survenue lors de l'appel du service distant requeteService", angular.toJson(response), "Erreur technique");
		//Wrapping the rejected response to the upper level
		return $q.reject(response);
	}
};