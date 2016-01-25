let React = require('react-native');
let BackgroundGeolocation = require('react-native-background-geolocation');
let GeoSettings = require('./bgGeoSettings');
let queryString = require('query-string');
let AuthService = require('./AuthService');
let AsyncStorage = require('react-native').AsyncStorage;
let baseUrl = require('./Globals').baseUrl;
let Locations = require('../Utils/Locations');

let { PushNotificationIOS, AppStateIOS } = React;

let countryKey = 'country';
let regionKey = 'state';
let cityKey = 'city';

class bgGeoService {
  constructor(mainViewTabState, changeGalleryView) {
    var self = this;
    this.mainViewTabState = mainViewTabState;
    this.changeGalleryView = changeGalleryView;

    this.baseMapBoxGeoCodeUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
    this.apiKey = "pk.eyJ1Ijoic2NobWFyaiIsImEiOiJjaWdvYzRrOG4wMDIxdDdrbjZsc2c3ampvIn0.PrBgPwo8A7wiuy5wu3HYiQ";
    this.locations = new Locations();
    this.appIsActive = (AppStateIOS.currentState == 'background') ? false : true;

    AppStateIOS.addEventListener('change',
      (currentAppState) => this.appIsActive = (currentAppState == 'background') ? false : true
    );

    this.bgGeo = BackgroundGeolocation;
    this.bgGeo.configure(GeoSettings);

    // This handler fires whenever bgGeo receives a location update.
    this.bgGeo.on('location', this.checkCurrentLocation.bind(this));

    // This handler fires whenever bgGeo receives an error
    this.bgGeo.on('error', (error) => {
      var type = error.type;
      var code = error.code;
      alert(type + " Error: " + code);
    });

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    this.bgGeo.on('motionchange', (location) => {
        console.log('- [js]motionchanged: ', JSON.stringify(location));
    });

    this.bgGeo.start(() => {
      console.log('- [js] BackgroundGeolocation started successfully');

      // Fetch current position
      this.bgGeo.getCurrentPosition({timeout: 30}, (location) => {
        console.log('- [js] BackgroundGeolocation received current position: ', JSON.stringify(location));
        var coords = {
          latitude : location.coords.latitude,
          longitude : location.coords.longitude
        };
        this.geoPromise(coords).then(this.checkCurrentLocation);
      });
    });
  }

  /*
   * Stores the users initial location on start of background geo tracking
   * @params err String, data array
   *
   * return void
   */
  storeInitialLocation(data) {
    var locationData = this.simplifyData(data);

    AsyncStorage.multiSet([
      [countryKey, locationData['country']],
      [regionKey, locationData['region']],
      [cityKey, locationData['place']]
    ]);
  }

  simplifyData(data) {
    var features = data.features,
        locationData = {};

    features.forEach((loc) => {
      var locType = loc.id.split(".")[0];
      locationData[locType] = loc.text;
    });
    return locationData;
  }

  toggleAppState(state) {
    return (state == 'background') ? false : true ;
  }

  /*
   * Matches users current location data with stored location
   * to check for change
   *
   * @params
   * return bool
   */
  isSameLocation(newLoc, curCountry) {
    var features = newLoc.features,
    results = features.filter((loc) => {
      var locType = loc.id.split(".")[0];
      if (locType == curCountry) return loc;
    })[0];

    return (results !== undefined) ? true : false;
  }

  checkCurrentLocation(location) {
    console.log('- [js]location: ', JSON.stringify(location));
    var self = this,
        coords = {
          latitude : location.coords.latitude,
          longitude : location.coords.longitude
        };
        this.geoPromise(coords).then((data) => {
          AsyncStorage.multiGet([countryKey, regionKey, cityKey], (err, val) => {
            if (err) return;
            if (!self.isSameLocation(data, countryKey)) {
              self.processUsersLocation(data);
            }

          });
        });
  }

  processUsersLocation(newLoc) {
    var self = this,
        loc = this.simplifyData(newLoc);

    this.storeInitialLocation(newLoc);
    this.locations.getSearchOptions((data) => {
      if(data.badCredentials || data.unknownError) {
        // change state of isLoggedIn to false
        AsyncStorage.multiRemove(['auth', 'user']);
      } else {
        if (!this.appIsActive) {
        for (i=0; i <= data.length; i++) {
          if (data[i].country == loc.country) {

              this.changeGalleryView({
                viewQuery : "local",
                mainGalleryView : true,
                locationData : {
                  amount : 10,
                  lastQueryId : null,
                  countryId : data[i].country_id,
                  stateRegionId : null,
                  cityId : null
                }
              });

              this.mainViewTabState("Gallery");
              PushNotificationIOS.presentLocalNotification({alertBody : "this is a test local notification by schmar james!"});
              return;
          }
        }

        this.changeGalleryView({clearLocalData : true});
        return;
      }
    }
  });
  }

  geoPromise(coords) {
    return fetch(`${this.baseMapBoxGeoCodeUrl}${coords.longitude},${coords.latitude}.json?types=country,region,place&access_token=${this.apiKey}`, {
      method : "get",
    })
      .then((res) => {
        return res.json();
      });
  }


}

module.exports = bgGeoService;
