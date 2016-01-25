let React = require('react-native');
let styles = require('../Styles/PhotoFeedStyles');
let Photos = require('../Utils/Photos');
let PhotoRow = require('./PhotoRow');
let Auth = require('../Utils/AuthService');
let WeatherData = require('./WeatherData');
let Lightbox = require('./Helpers/Lightbox');
let AsyncStorage = require('react-native').AsyncStorage;
let LinearGradient = require('react-native-linear-gradient');
let Icon = require('react-native-vector-icons/Ionicons');

let {
  RefresherListView
} = require('react-native-refresher');

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

class PhotoFeed extends React.Component {
  constructor(props) {
    super(props);
    this.photoCollection = [];
    this.state = {
      ds : new ListView.DataSource({
        rowHasChanged : (row1, row2) => row1 !== row2
      }),
      showProgress : false,
      queryingMore : false,
      category : (props.category !== undefined && props.category !== null) ? props.category : null
    };
    //this.updateFeedNotification();
    this.previousScroll = 0;
    this.rows = {};
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

    Photos.queryPhotos({
      amount : 10,
      latest : null,
      id : null,
      category : this.state.category
    },
    (data) => {
      if(data.badCredentials || data.unknownError) {
        // change state of isLoggedIn to false
        AsyncStorage.multiRemove(['auth', 'user'], () => {
          self.setState({showProgress : false});
          window.EventBus.trigger('expiredLogin', true);
        });
      } else {
        self.setState({ds : self.getDataSource(data)});
        self.setState({showProgress : false});
      }
    });
  }

  getDataSource(data) {
    var self = this;
    this.photoCollection = this.photoCollection.concat(data);
    return this.state.ds.cloneWithRows(this.photoCollection);
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

  showPhotoDetails(obj) {
    this.props.route.push({
      component: require('./PhotoDetails'),
      passProps : {
        photo : obj
      }
    });
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
            self.props.showLogin(true);
            self.setState({showProgress : false});
          });
        } else {
          if (!isNaN(data)) {
            var y = JSON.parse(JSON.stringify(self.photoCollection));
            if (data) {
              y[index].likes++;
              y[index].likedByUser = true;
              window.EventBus.trigger('updateLike', {id : id, add : true});
            } else {
              y[index].likes--;
              y[index].likedByUser = false;
              window.EventBus.trigger('updateLike', {id : id, add : false});
            }
            self.setState({ds : self.state.ds.cloneWithRows(y)}, () => {
              self.photoCollection = JSON.parse(JSON.stringify(y));
            });
          }
        }
      });
    }

  renderPhoto(photo, sec, i) {
    var marginTop = (this.photoCollection[0].id == photo.id) ? {marginTop : 64} : {marginTop : 0};
    if (i == 0) { this.rows[sec] = []; }
    console.log(photo.likedByUser);
    return (
      <View style={[styles.entryWrap, marginTop]}>
        <PhotoRow
          photoData={photo}
          lightBox={true}
          likeButton={true}
          likePhoto={this.likePhoto.bind(this)}
        />
      </View>

    );
  }

  onEndReached(e) {
    // this method may fire on load ListView, so check
    // to make sure that the collection array has photos
    // or an error will be thrown
    if (this.photoCollection.length < 1)  { console.log("pre fire"); return false; }
    console.log("on end reach");
    var self = this,
        lastQueryId = this.photoCollection[this.photoCollection.length-1].id;

    this.setState({showProgress : true, showMoreProgress : true});
    Photos.queryPhotos({
      amount : 10,
      latest : null,
      id : lastQueryId,
      category : this.state.category
    },
    (data) => {
      if(data.badCredentials || data.unknownError) {
        // change state of isLoggedIn to false
        AsyncStorage.multiRemove(['auth', 'user'], () => {
          self.setState({showProgress : false, showMoreProgress : true});
          window.EventBus.trigger('expiredLogin', true);
        });
      } else {
        self.setState({ds : self.getDataSource(data)});
        self.setState({showProgress : false, showMoreProgress : false});
      }
    });
  }

  reloadPhotos() {
    if (!this.state.queryingMore) {
      this.setState({queryingMore : true});

      var self = this,
          lastQueryId = this.photoCollection[0].id;

      this.setState({showProgress : true});
      Photos.queryPhotos({
        amount : 0,
        latest : 1,
        id : lastQueryId,
        category : this.state.category
      },
      (data) => {
        if(data.badCredentials || data.unknownError) {
          // change state of isLoggedIn to false
          AsyncStorage.multiRemove(['auth', 'user'], () => {
            self.setState({showProgress : false});
            window.EventBus.trigger('expiredLogin', true);
          });
        } else {
          if (data.length > 0) {

            var newArr = JSON.parse(JSON.stringify(self.photoCollection));
            data.forEach(function(obj) {
              newArr.unshift(obj);
            });

            self.setState({queryingMore : false, showProgress : false});
            self.setState({ds : self.state.ds.cloneWithRows(newArr)});
            return;
          }
          self.setState({queryingMore : false, showProgress : false});
        }
      });
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

  }

  render() {
    StatusBarIOS.setStyle('default');
    return (
      <View style={styles.container}>

        <RefresherListView
          style={{height: Dimensions.get('window').height, position: "relative"}}
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.ds}
          onScroll={this.handleScroll.bind(this)}
          onRefresh={this.reloadPhotos.bind(this)}
          indicator={<View />}
          renderRow={this.renderPhoto.bind(this)}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={80}
          directionalLockEnabled={true}
        >

          <View style={styles.moreLoadWrap}>
            <ActivityIndicatorIOS
              style={styles.moreFeedsLoader}
              animating={this.state.showMoreProgress}
              size="large" />
          </View>
        </RefresherListView>

        <View style={styles.moreLoadWrap}>
          <ActivityIndicatorIOS
            style={styles.feedLoader}
            animating={this.state.showProgress}
            size="large" />
        </View>
      </View>
    );
  }
}

module.exports = PhotoFeed;
