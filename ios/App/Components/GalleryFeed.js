let React = require('react-native');
let styles = require('../Styles/PhotoFeedStyles');
let Photos = require('../Utils/Photos');
let PhotoRow = require('./PhotoRow');
let Search = require('./Search');
let Auth = require('../Utils/AuthService');
let WeatherData = require('./WeatherData');
let AsyncStorage = require('react-native').AsyncStorage;
let LinearGradient = require('react-native-linear-gradient');
let Icon = require('react-native-vector-icons/Ionicons');
let Lightbox = require('./Helpers/Lightbox');
let reactMixin = require('react-mixin');
let EventEmitter = require('EventEmitter');
let Subscribable = require('Subscribable');

let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  ActivityIndicatorIOS,
  Animated,
  LayoutAnimation,
  processColor,
  StatusBarIOS,
  Dimensions
} = React;

class GalleryFeed extends React.Component {
  constructor(props) {
    super(props);
    this.photoCollection = [];
    this.state = {
      ds : new ListView.DataSource({
        rowHasChanged : (row1, row2) => row1 !== row2
      }),
      showProgress : false,
      queryingMore : false,
      queryId : props.queryId,
      localObj : props.localObj,
      showSearch : false,
      searchType : null,
    };

    this.categoryDataObj = null;
    this.countryDataObj = null;
    this.previousScroll = 0;
    //this.updateFeedNotification();
  }

  componentWillMount() {
    this.addListenerOn(this.props.events, 'showGallerySpecificSearch', this.showSearch.bind(this));
  }

  componentDidMount() {
    var self = this;
    this.setState({showProgress : true});

    window.EventBus.on('updateLike', (data) => {
      var newArr = JSON.parse(JSON.stringify(self.photoCollection));
      console.log('updateLike');
      console.log(data.id);
      for (i=0; i < newArr.length; i++) {
          if (newArr[i].id == data.id) {
            if (data.add) {
              newArr[i].likes++;
              newArr[i].likedByUser = true;
            } else {
              newArr[i].likes--;
              newArr[i].likedByUser = false;
            }
          }

      }
      self.setState({ds : self.state.ds.cloneWithRows(newArr)}, () => {
        self.photoCollection = JSON.parse(JSON.stringify(newArr));
      });
    });

    // Check the feedType prop to determine the photos to query
    if (this.props.feedType == 'categories') {
      this.categoryDataObj = {
        amount : 10,
        lastQueryId : null,
        category : this.state.queryId
      };

      Photos.queryUserCategoryPhotos(this.categoryDataObj, this.delegateFeedRequest.bind(this));
    }

    else if (this.props.feedType == 'countries') {
      this.countryDataObj = {
        amount : 10,
        lastQueryId : null,
        countryId : this.state.queryId,
        stateRegionId : null,
        cityId : null
      };

      Photos.queryUserLocationPhotos(this.countryDataObj, this.delegateFeedRequest.bind(this));
    }

    else if (this.props.feedType == 'local') {
      this.countryDataObj = {
        amount : 10,
        lastQueryId : null,
        countryId : this.state.localObj.countryId,
        stateRegionId : this.state.localObj.stateRegionId,
        cityId : this.state.localObj.cityId
      };

      Photos.queryUserLocationPhotos(this.countryDataObj, this.delegateFeedRequest.bind(this));
    }
  }

  delegateFeedRequest(data) {
    if(data.badCredentials || data.unknownError) {
      // change state of isLoggedIn to false
      AsyncStorage.multiRemove(['auth', 'user'], () => {
        this.setState({showProgress : false});
        window.EventBus.trigger('expiredLogin', true);
      });
    } else {
      this.setState({ds : this.getDataSource(data)});
      this.setState({showProgress : false});
    }
  }

  reRenderGalleryList(data) {
    this.setState({showSearch : false}, () => {
      this.props.events.emit('reviveGalleryNav');
      // Check the feedType prop to determine the photos to query
      if (this.props.feedType == 'categories') {
        this.categoryDataObj = {
          amount : 10,
          lastQueryId : null,
          category : this.state.queryId,
          location : {
            countryId : null,
            stateRegionId : null,
            cityId : null
          }
        };

        this.categoryDataObj.location[data.chosenProp] = data[data.chosenProp];
        Photos.queryUserCategoryPhotos(this.categoryDataObj, this.reNewDataSource.bind(this));
      }

      else if (this.props.feedType == 'countries') {
        this.setState({queryId : data.countryId});
        this.countryDataObj = {
          amount : 10,
          lastQueryId : null,
          countryId : this.state.queryId,
          stateRegionId : null,
          cityId : null
        };

        this.countryDataObj[data.chosenProp] = data[data.chosenProp];
        Photos.queryUserLocationPhotos(this.countryDataObj, this.reNewDataSource.bind(this));
      }

      else if (this.props.feedType == 'local') {
        this.countryDataObj = {
          amount : 10,
          lastQueryId : null,
          countryId : this.state.localObj.countryId,
          stateRegionId : this.state.localObj.stateRegionId,
          cityId : this.state.localObj.cityId
        };

        this.countryDataObj[data.chosenProp] = data[data.chosenProp];
        Photos.queryUserLocationPhotos(this.countryDataObj, this.reNewDataSource.bind(this));
      }
    });
  }

  showSearch(searchData) {
    if (searchData.type == 'specificCountries') {
      this.searchOptions = searchData.options.filter((options) => {
        if (options.country_id == this.state.queryId) {
          return options;
        }
      })
      .map((options) => {
        return {
          stateRegionId: options.state_region_id,
          stateRegionName : options.state_region,
          cityId : options.city_id,
          cityName : options.city
        };
      });

      this.setState({searchType : searchData.type, showSearch : true});
    }

    if (searchData.type == 'allLocations') {
      this.searchOptions = searchData.options.map((options) => {
        return {
          countryId : options.country_id,
          countryName : options.country,
          stateRegionId: options.state_region_id,
          stateRegionName : options.state_region,
          cityId : options.city_id,
          cityName : options.city
        };
      });

      this.setState({searchType : searchData.type, showSearch : true});
    }
  }

  getDataSource(data) {
    var self = this;
    this.photoCollection = this.photoCollection.concat(data);
    return this.state.ds.cloneWithRows(this.photoCollection);
  }

  reNewDataSource(data) {
    var self = this;
    if(data.badCredentials || data.unknownError) {
      // change state of isLoggedIn to false
      AsyncStorage.multiRemove(['auth', 'user'], () => {
        this.setState({showProgress : false});
        window.EventBus.trigger('expiredLogin', true);
      });
    } else {
        this.photoCollection = data;
        this.setState({ds : this.state.ds.cloneWithRows(this.photoCollection)});
        this.setState({showProgress : false});
    }



  }

  closeSearch() {
    this.setState({showSearch : false});
    this.props.events.emit('reviveGalleryNav');
  }

  updateFeedNotification() {
    var self = this;
    setInterval(() => {
      var lastQueryId = this.photoCollection[0].id;
      Photos.getUpdatePhotoCount(lastQueryId, (data) => {
        if(data.badCredentials || data.unknownError) {
          // change state of isLoggedIn to false
          AsyncStorage.multiRemove(['auth', 'user'], () => {
            self.setState({showProgress : false});
            window.EventBus.trigger('expiredLogin', true);
          });
        } else {
          self.props.updateFeedBadge(data);
        }
      });
    }, 4000);
  }

  likePhoto(photo) {
    var self = this,
        index = this.photoCollection.findIndex((el, idx, array) => {
          if (el.id == photo.id) { return true; }
          return false;
        }),
        id = photo.id;

    Photos.likePhoto(id, (data) => {
      if (data.badCredentials || data.unknownError) {
        // change state of isLoggedIn to false
        AsyncStorage.multiRemove(['auth', 'user'], () => {
          self.setState({showProgress : false});
          window.EventBus.trigger('expiredLogin', true);
        });
      } else {
        if (!isNaN(data)) {
          var y = JSON.parse(JSON.stringify(self.photoCollection));
          if (data) {
            y[index].likes++;
            y[index].likedByUser = true;
          } else {
            y[index].likes--;
            y[index].likedByUser = false;
          }
          self.setState({ds : self.state.ds.cloneWithRows(y)}, () => {
            self.photoCollection = JSON.parse(JSON.stringify(y));
          });

        }

      }
    });
  }

  showPhotoDetails(obj) {
    window.EventBus.trigger('closePopover', {close: false});
    this.props.route.push({
      component: require('./PhotoDetails'),
      passProps : {
        photo : obj
      }
    });
  }

  renderPhoto(photo) {
    var marginTop = (this.photoCollection.indexOf(photo) == 0) ? {marginTop : 64} : {marginTop : 0};
    return (

      <View style={[styles.entryWrap, marginTop]}>
        <PhotoRow
          photoData={photo}
          nextPage={this.showPhotoDetails.bind(this)}
          lightBox={false}
        />
      </View>


    );
  }

  onEndReached(e) {
    // this method may fire on load ListView, so check
    // to make sure that the collection array has photos
    // or an error will be thrown
    if (this.photoCollection.length < 1)  { return false; }

    var self = this,
        lastQueryId = this.photoCollection[this.photoCollection.length-1].id;
    this.setState({showProgress : true, showMoreProgress : true});

    if (this.props.feedType == 'categories') {
      this.categoryDataObj.lastQueryId = lastQueryId;
      console.log(this.categoryDataObj);
      Photos.queryUserCategoryPhotos(this.categoryDataObj, this.delegateFeedRequest.bind(this));
    }

    else if (this.props.feedType == 'countries') {
        this.countryDataObj.lastQueryId = lastQueryId;
      Photos.queryUserLocationPhotos(this.countryDataObj, this.delegateFeedRequest.bind(this));
    }
  }

  handleScroll(e) {

    var navHeight = 64;
    var topOffset = e.nativeEvent.contentOffset.y;

    if (topOffset > navHeight) {
        if (topOffset > this.previousScroll) {
            window.EventBus.trigger('animateNav', true);
        } else {
            window.EventBus.trigger('animateNav', false);
        }
    } else {
      window.EventBus.trigger('animateNav', false);
    }
    this.previousScroll = topOffset;
    console.log(this.previousScroll);
 }

  render() {
    StatusBarIOS.setStyle('default');
    var showCategories,
        searchView = <View></View>;

    if (this.state.showSearch) {
      searchView = <Search
            searchType={this.state.searchType}
            searchOptions={this.searchOptions}
            getSearchedData={this.reRenderGalleryList.bind(this)}
            closeSearch={this.closeSearch.bind(this)}
          />;
    }

    return (
      <View style={styles.container}>

        <ListView
          style={{height: Dimensions.get('window').height-55, position: "relative"}}
          dataSource={this.state.ds}
          renderRow={this.renderPhoto.bind(this)}
          onScroll={this.handleScroll.bind(this)}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={80}
        >

          <View style={styles.moreLoadWrap}>
            <ActivityIndicatorIOS
              style={styles.moreFeedsLoader}
              animating={this.state.showMoreProgress}
              size="large" />
          </View>
        </ListView>

        <View style={styles.moreLoadWrap}>
          <ActivityIndicatorIOS
            style={styles.feedLoader}
            animating={this.state.showProgress}
            size="large" />
        </View>

        {searchView}
      </View>
    );
  }
}

reactMixin(GalleryFeed.prototype, Subscribable.Mixin);

module.exports = GalleryFeed;
