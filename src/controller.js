(function() {
  function GooglePlacesController($scope) {
    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };

    var mapping = {
        street_number: 'number',
        route: 'street',
        locality: 'city',
        administrative_area_level_1: 'state',
        country: 'country',
        postal_code: 'zip_code'
    };

    this.parsePlaces = function() {
      var place = this.gPlace.getPlace();
      var details = place.geometry && place.geometry.location ? {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      } : {};

      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          details[mapping[addressType]] = val;
        }
      }

      details.formatted = place.formatted_address;
      details.placeId = place.place_id;
      details.address = getStreetInfo(details);

      this.googlePlacesAddress    = details.address;
      this.googlePlacesState      = details.state;
      this.googlePlacesPostalcode = details.zip_code;
      this.googlePlacesCity       = details.city;
      this.googlePlacesCountry    = details.country;
      this.googlePlacesFormatted  = details.formatted;
      this.googlePlacesLat        = details.lat;
      this.googlePlacesLng        = details.lng;
      this.googlePlacesPlaceId    = details.placeId;
      this.googlePlacesStreet     = details.street;

      $scope.$apply();

    }.bind(this);

    function getStreetInfo(details) {
      var addressParts = [];

      if ( details.number )
        addressParts.push(details.number);

      if (details.street)
        addressParts.push(details.street);

      return addressParts.join(' ');
    }
  }

  angular
    .module("ng-google-places")
    .controller('GooglePlacesController', ["$scope", GooglePlacesController]);

})();
