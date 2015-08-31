# ng-google-places
Angular module for Google Places

## Usage
Make sure Google Places API library is loaded

### Straight Up

```
<input type="text" class="googlePlaces">
```

### Affecting other variables

If you want to populate other scoped variables with parts of the selected Google Places address:

```
<form ng-init="location={}">
  <input type="text" class="googlePlaces" ng-model="location.address"
    google-places-address="location.address"
    google-places-state="location.state"
    google-places-postalcode="location.postalcode"
    google-places-city="location.city"
    google-places-country="location.country"
    google-places-formatted="location.formattedAddress"
    google-places-lat="location.lat"
    google-places-lng="location.lng"
    google-places-place-id="location.placeId"
    google-places-street="location.street">
</form>
```
This will help fill out other parts of a form based off of the Google Places results.
