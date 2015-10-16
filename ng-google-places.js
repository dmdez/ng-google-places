(function() {
    angular.module("ng-google-places", []);
})();

(function() {
    function GooglePlacesDirective(GooglePlacesLoadApi, $window) {
        return {
            restrict: "AC",
            bindToController: true,
            controller: "GooglePlacesController as googlePlaces",
            link: function(scope, element, attrs, ctrl) {
                var options = {
                    types: [],
                    componentRestrictions: {
                        country: "us"
                    },
                    components: {}
                };
                var loadPlaces = function() {
                    ctrl.gPlace = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(ctrl.gPlace, "place_changed", ctrl.parsePlaces);
                };
                if (attrs.googlePlacesOptions) {
                    angular.extend(options, scope.$eval(attrs.googlePlacesOptions));
                }
                if ($window.google && $window.google.maps) {
                    loadPlaces();
                } else {
                    GooglePlacesLoadApi.loadApi().then(function() {
                        loadPlaces();
                    });
                }
            },
            scope: {
                googlePlacesAddress: "=",
                googlePlacesState: "=",
                googlePlacesPostalcode: "=",
                googlePlacesCity: "=",
                googlePlacesCountry: "=",
                googlePlacesFormatted: "=",
                googlePlacesLat: "=",
                googlePlacesLng: "=",
                googlePlacesPlaceId: "=",
                googlePlacesStreet: "="
            }
        };
    }
    angular.module("ng-google-places").directive("googlePlaces", [ "GooglePlacesLoadApi", "$window", GooglePlacesDirective ]);
})();

(function() {
    function GooglePlacesController($scope) {
        var componentForm = {
            street_number: "short_name",
            route: "long_name",
            locality: "long_name",
            administrative_area_level_1: "short_name",
            country: "long_name",
            postal_code: "short_name"
        };
        var mapping = {
            street_number: "number",
            route: "street",
            locality: "city",
            administrative_area_level_1: "state",
            country: "country",
            postal_code: "zip_code"
        };
        this.parsePlaces = function() {
            var place = this.gPlace.getPlace();
            var details = place.geometry && place.geometry.location ? {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            } : {};
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
            this.googlePlacesAddress = details.address;
            this.googlePlacesState = details.state;
            this.googlePlacesPostalcode = details.zip_code;
            this.googlePlacesCity = details.city;
            this.googlePlacesCountry = details.country;
            this.googlePlacesFormatted = details.formatted;
            this.googlePlacesLat = details.lat;
            this.googlePlacesLng = details.lng;
            this.googlePlacesPlaceId = details.placeId;
            this.googlePlacesStreet = details.street;
            $scope.$apply();
        }.bind(this);
        function getStreetInfo(details) {
            var addressParts = [];
            if (details.number) addressParts.push(details.number);
            if (details.street) addressParts.push(details.street);
            return addressParts.join(" ");
        }
    }
    angular.module("ng-google-places").controller("GooglePlacesController", [ "$scope", GooglePlacesController ]);
})();

(function() {
    var loaded = false;
    window.addEventListener("load", function() {
        loaded = true;
    });
    function GooglePlacesLoadApi($q, $window, GooglePlaces) {
        function LoadScript() {
            var s = document.createElement("script");
            s.src = "https://maps.googleapis.com/maps/api/js?libraries=places&callback=initPlaces";
            if (GooglePlaces.apiKey) s.src += "&key=" + GooglePlaces.apiKey;
            document.body.appendChild(s);
        }
        function LoadApi() {
            var deferred = $q.defer();
            $window.initPlaces = function() {
                deferred.resolve();
            };
            if (loaded) {
                LoadScript();
            } else if ($window.attachEvent) {
                $window.attachEvent("onload", LoadScript);
            } else {
                $window.addEventListener("load", LoadScript, false);
            }
            return deferred.promise;
        }
        return {
            loadApi: LoadApi
        };
    }
    angular.module("ng-google-places").factory("GooglePlacesLoadApi", [ "$q", "$window", "GooglePlaces", GooglePlacesLoadApi ]).provider("GooglePlaces", [ function() {
        var apiKey;
        return {
            setApiKey: function(key) {
                apiKey = key;
            },
            $get: function() {
                return {
                    apiKey: apiKey
                };
            }
        };
    } ]);
})();