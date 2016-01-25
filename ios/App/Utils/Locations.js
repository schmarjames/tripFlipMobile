let locations = require('./countryStateList');
let AuthService = require('./AuthService');
let AsyncStorage = require('react-native').AsyncStorage;
let baseUrl = require('./Globals').baseUrl;

class Locations {

  constructor() {
    this.countries = locations.countries.map(country => country.country);
    this.stateRegions = [];
  }

  getCountries() {
    return this.countries;
  }

  setStateRegions(country) {
    var self = this;
    locations.countries.forEach((element, index) => {
      if (element.country == country) {
        self.stateRegions = element.states;
        return;
      }
    });
  }

  getStateRegions() {
    return this.stateRegions;
  }

  getSearchOptions(cb) {
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }
      console.log(authInfo);
      var url = `${baseUrl}gallery/locationoptions`;

      fetch(url, {
        method : "post",
        headers : {
          Authorization : authInfo.header.Authorization
        }
      })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
              return response;
          }
          throw {
            badCredentials: response.status == 401,
            unknownError: response.status != 401
          }
        })
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((result) => {
          cb(result);
        })
        .catch((err) => {
          return cb(err);
        });
    });
  }
}

module.exports = Locations;
