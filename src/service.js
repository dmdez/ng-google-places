
(function() {

  function GooglePlacesService($q, $window) {
    function LoadScript() {
      var s = document.createElement('script'); // use global document since Angular's $document is weak
      s.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=initPlaces';
      document.body.appendChild(s);
    }

    function LoadApi() {
      var deferred = $q.defer();
      $window.initPlaces = function () {
        deferred.resolve();
      };
      // thanks to Emil Stenström: http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
      if ($window.attachEvent) {
        $window.attachEvent('onload', LoadScript);
      } else {
        $window.addEventListener('load', LoadScript, false);
      }
      return deferred.promise;
    }

    return {
      loadApi: LoadApi
    }
  }

  angular
    .module("ng-google-places")
    .factory("GooglePlacesService", ["$q", "$window", GooglePlacesService]);

})();
