let queryString = require('query-string');
let AuthService = require('./AuthService');
let AsyncStorage = require('react-native').AsyncStorage;
let baseUrl = require('./Globals').baseUrl;

class Photos {
  queryPhotos(obj, cb) {
    var self = this;
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }
      var url = `${baseUrl}photo/collection`,
          data = queryString.stringify({
            amount : obj.amount,
            latest : (obj.latest !== null) ? obj.latest : 0,
            lastQueryId : (obj.id !== null) ? obj.id : "",
            category : (obj.category === undefined) ? null : obj.category
          });

      var promise = fetch(url, {
        method : "post",
        headers : {
          Authorization : authInfo.header.Authorization
        },
        body : data
      });

      self.handleResult(promise, (result) => {
        cb(result);
      });

    });
  }

  queryUserLocationPhotos(obj, cb) {
    var self = this;
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }
      var url = `${baseUrl}gallery/userlocationcollection`,
          locations = JSON.stringify([obj.countryId, obj.stateRegionId, obj.cityId]);
          data = queryString.stringify({
            amount : obj.amount,
            lastQueryId : (obj.lastQueryId !== null) ? obj.lastQueryId : null,
            locationData : locations
          });

      var promise = fetch(url, {
        method : "post",
        headers : {
          Authorization : authInfo.header.Authorization
        },
        body : data
      });

      self.handleResult(promise, (result) => {
        cb(result);
      });
    });
  }

  queryUserCategoryPhotos(obj, cb) {
    var self = this;
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }
      var url = `${baseUrl}gallery/usercategorycollection`,
          locations = null;

      if (obj.hasOwnProperty('location')) {
        locations = JSON.stringify([
          obj.location.countryId,
          obj.location.stateRegionId,
          obj.location.cityId
        ]);
      }

      var data = queryString.stringify({
            amount : obj.amount,
            lastQueryId : (obj.lastQueryId !== null) ? obj.lastQueryId : "",
            category : (obj.category === undefined) ? null : obj.category,
            locationData : locations
          });

      var promise = fetch(url, {
        method : "post",
        headers : {
          Authorization : authInfo.header.Authorization
        },
        body : data
      });

      self.handleResult(promise, (result) => {
        cb(result);
      });
    });
  }

  getUpdatePhotoCount(id, cb) {
    var self = this;
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }
      var url = `${baseUrl}photo/updatecount`,
          data = queryString.stringify({
            lastQueryId : id
          });

      fetch(url, {
        method : "post",
        headers : {
          Authorization : authInfo.header.Authorization
        },
        body : data
      });

      self.handleResult(promise, (result) => {
        cb(result);
      });
    });
  }

  likePhoto(photo_id, cb) {
    var self = this;
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }

      var user_id = authInfo.user.id,
          photo_data = photo_id,
          url = `${baseUrl}photo/like`;

      var promise = fetch(url, {
        method : "post",
        headers : {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : authInfo.header.Authorization
        },
        body : JSON.stringify({
          userId : user_id,
          like : photo_data
        })
      });

      self.handleResult(promise, (result) => {
        cb(result);
      });
    });
  }

  getRandomPhotos(viewed_photos, cb) {
    var self = this;
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }

      var user_id = authInfo.user.id,
          views = (viewed_photos !== null) ? viewed_photos : [],
          url = `${baseUrl}photo/randomcollection`;

      var promise = fetch(url, {
        method : "post",
        headers : {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : authInfo.header.Authorization
        },
        body : JSON.stringify({
          userId : user_id,
          viewedPhotos : views
        })
      });

      self.handleResult(promise, (result) => {
        cb(result);
      });
    });
  }

  getCategoryPhotos(cb) {
    var self = this;
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }

      var url = `${baseUrl}photo/categoryphotos`;

      var promise = fetch(url, {
        method : "get",
        headers : {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : authInfo.header.Authorization
        }
      });

      self.handleResult(promise, (result) => {
        cb(result);
      });
    });
  }

  getCategoryAlbums(cb) {
    var self = this;
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }

      var url = `${baseUrl}gallery/usercategories`;

      var promise = fetch(url, {
        method : "post",
        headers : {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : authInfo.header.Authorization
        }
      });

      self.handleResult(promise, (result) => {
        cb(result);
      });
    });
  }

  getUserAlbumPhotos(type, cb) {
    var self = this;
    AuthService.getAuthInfo((err, authInfo) => {
      if (err) { return cb(err); }

      var url = `${baseUrl}gallery/albumcollection`;

      var promise = fetch(url, {
        method : "post",
        headers : {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : authInfo.header.Authorization
        },
        body : JSON.stringify({
          type : type
        })
      });

      self.handleResult(promise, (result) => {
        cb(result);
      });
    });
  }

  handleResult(promise, cb) {
    promise.then((response) => {
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
      console.log('inside result');
      console.log(result);
      cb(result);
    })
    .catch((err) => {
      console.log('inside error');
      console.log(err);
      return cb(err);
    });
  }
}

module.exports = new Photos();
