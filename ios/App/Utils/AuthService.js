let queryString = require('query-string');
let AsyncStorage = require('react-native').AsyncStorage;
let baseUrl = require('./Globals').baseUrl;
let _ = require('lodash');

let authKey = 'auth';
let userKey = 'user';

class AuthService {
  getAuthInfo(cb) {
    AsyncStorage.multiGet([authKey, userKey], (err, val) => {
      if (err) {
        return cb(err);
      }

      if (!val) {
        return cb();
      }
      var zippedObj = _.zipObject(val);

      if (!zippedObj[authKey]) {
        return cb();
      }

      var authInfo = {
          header: {
            Authorization: 'Bearer ' + zippedObj[authKey]
          },
          user: JSON.parse(zippedObj[userKey])
      }
      return cb(null, authInfo);
    });
  }

  login(creds, cb) {
    var data = queryString.stringify({
      email : creds.email,
      password : creds.password
    });
    var self = this;

    fetch(`${baseUrl}auth`, {
      method : 'post',
      body : data
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
      .then((response) => {
        return response.json();
      })
      .then((tokenResult) => {
        // Get user data
        self.getUserData(tokenResult.token, (user) => {
          // Store token and user data in localstorage
          AsyncStorage.multiSet([
            [authKey, tokenResult.token],
            [userKey, JSON.stringify(user)]
          ], (err) => {
            if (err) {
              throw err;
            }
            return cb({success : true});
          });

        });
      })
      .catch((err) => {
        return cb(err);
      });
  }

  register(data, cb) {
    var data = queryString.stringify(data);

    fetch(`${baseUrl}authregister`, {
      method : 'post',
      body : data
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Store token and user data in localstorage
        AsyncStorage.multiSet([
          [authKey, data.token],
          [userKey, JSON.stringify(data.userData)]
        ], (err) => {
          if (err) {
            throw err;
          }
          return cb({success : true});
        });
      })
      .catch((err) => {
        return cb(err);
      });
  }

  getUserData(token, cb) {
    fetch(`${baseUrl}authenticate/user?token=${token}&mobile=1`, {
      method: 'get'
    })
      .then((response) => {
        return response.json();
      })
      .then((userData) => {
        cb(userData.user);
      });
  }

  assignTemp(email, cb) {
    var data = queryString.stringify({email : email});
    fetch(`${baseUrl}authAssignTemp`, {
      method : 'post',
      body : data
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        cb(data);
      });
  }

  resetPassword(data, cb) {
    var data = queryString.stringify(data);
    fetch(`${baseUrl}authChangeCred`, {
      method : 'post',
      body : data
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        cb(data);
      });
  }

  changeProfileSettings(type, data, cb) {
    var self = this;
    this.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }

      var url = `${baseUrl}authProfileSettings`;

      fetch(url, {
        method : "post",
        headers : {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : authInfo.header.Authorization
        },
        body : JSON.stringify({
          type : type,
          data : data
        })
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
        return res.json();
      })
      .then((result) => {

        if (result != 0) {
          AsyncStorage.setItem(userKey, JSON.stringify(result.user), (err) => {
            if (err) {
              throw err;
            }
            cb(result);
          });
        }
      })
      .catch((err) => {
        return cb(err);
      });
    });
  }
}

module.exports = new AuthService();
