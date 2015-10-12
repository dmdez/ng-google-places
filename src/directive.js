
(function() {

  // https://gist.github.com/VictorBjelkholm/6687484
  // modified to have better structure for details

  function GooglePlacesDirective(GooglePlacesService, $window) {
    return {
      restrict: 'AC',
      bindToController: true,
      controller: "GooglePlacesController as googlePlaces",
      link: function(scope, element, attrs, ctrl) {
        var options = {
            types: [], //attrs.googlePlace !== "" ? attrs.googlePlace.split(',') : [],
            componentRestrictions: {
              country: 'us'
            },
            components: {}
        };

        var loadPlaces = function() {
          ctrl.gPlace = new google.maps.places.Autocomplete(element[0], options);
          google.maps.event.addListener(ctrl.gPlace, 'place_changed', ctrl.parsePlaces);
        }
        if ( attrs.googlePlacesOptions ) {
          angular.extend(options, scope.$eval(attrs.googlePlacesOptions));
        }
        if ( $window.google && $window.google.maps ) {
          loadPlaces();
        } else {
          GooglePlacesService.loadApi().then(function() {
            loadPlaces();
          });
        }
      },
      scope: {
        googlePlacesAddress    : '=',
        googlePlacesState      : '=',
        googlePlacesPostalcode : '=',
        googlePlacesCity       : '=',
        googlePlacesCountry    : '=',
        googlePlacesFormatted  : '=',
        googlePlacesLat        : '=',
        googlePlacesLng        : '=',
        googlePlacesPlaceId    : '=',
        googlePlacesStreet     : '='
      }
    };
  }



  angular
    .module("ng-google-places")
    .directive('googlePlaces', ["GooglePlacesService", "$window", GooglePlacesDirective]);

})();
