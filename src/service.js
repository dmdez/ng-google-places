
(function() {
  var loaded = false;
  window.addEventListener("load", function () {
    loaded = true;
  });

  function GooglePlacesLoadApi($q, $window, GooglePlaces) {

    function LoadScript() {
      var s = document.createElement('script'); // use global document since Angular's $document is weak
      s.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=initPlaces';
      if (GooglePlaces.apiKey)
        s.src += '&key=' + GooglePlaces.apiKey;
      document.body.appendChild(s);
    }

    function LoadApi() {
      var deferred = $q.defer();
      $window.initPlaces = function () {
        deferred.resolve();
      };
      // thanks to Emil Stenström: http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
      if (loaded) {
        LoadScript();
      } else if ($window.attachEvent) {
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
    .factory("GooglePlacesLoadApi", ["$q", "$window", "GooglePlaces", GooglePlacesLoadApi])
    .provider('GooglePlaces', [function() {
      var apiKey;
      return {
        setApiKey: function(key) {
          apiKey = key;
        },
        $get: function () {
          return {
            apiKey: apiKey
          }
        }
      }
    }]);

})();
