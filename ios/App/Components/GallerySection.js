let React = require('react-native');
let AuthService = require('../Utils/AuthService');
let General = require('../Styles/General');
let GalleryFeed = require('./GalleryFeed');
let Photos = require('../Utils/Photos');
let Search = require('./Search');
let Settings = require('./Settings');
let Separator = require('./Helpers/Separator');
let GridView = require('react-native-grid-view');
let Parallax = require('react-native-parallax');
let Popover = require('react-native-popover');
let Icon = require('react-native-vector-icons/Ionicons');
let reactMixin = require('react-mixin');
let EventEmitter = require('EventEmitter');
let Subscribable = require('Subscribable');

let ITEMS_PER_ROW = 2;

let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  ActivityIndicatorIOS,
  Animated,
  LayoutAnimation,
  ScrollView,
  NavigatorIOS,
  MapView,
  Image,
  StatusBarIOS,
  processColor,
  Dimensions,
  AsyncStorage
} = React;

class GallerySection extends React.Component {
  constructor(props) {
    super(props);

    this.galleryViews = ["categories", "countries", "local"];

    this.state = {
      galleryViewReady : false,
      curGalleryView : 'categories',
      galleryData : null,
      locationData : null,
      isVisible : false,
      buttonRect : {},
      showSearch : false,
      settingsVisible : false,
      settingsAnimated : true,
      transparent : false
    };

    this.searchOptions;

  }

  componentWillMount() {
    window.EventBus.on('navigationChanged', (data) => {
      if (data.current == 0) {
        //this.setState({curGalleryView : 'GallerySection'});
      }
    });
    this.addListenerOn(this.props.events, 'changeGalleryView', this.getGalleryList.bind(this));
    this.addListenerOn(this.props.events, 'showGalleryMainSearch', this.showSearch.bind(this));
  }

  componentDidMount() {
    window.EventBus.on('updatePhotoData', (data) => {
      this.getGalleryList();
    });

    window.EventBus.on('updateLike', (data) => {
      this.getGalleryList();
    });

    var self = this;
    this.getGalleryList();
  }

  getGalleryList(data) {
    var self = this;

    if (data !== undefined &&
        data.clearLocalData !== undefined &&
        data.clearLocalData) {
      this.setState({ locationData : null });
      return;
    }
    if (data !== undefined && this.galleryViews.indexOf(data.viewQuery) > -1) {
      this.setState({ curGalleryView : data.viewQuery });

      if (data.mainGalleryView) {
        this.props.changeGalleryViewState("GallerySection");
        this.props.route.pop();
      }
    }
      console.log('inside getGalleryList function');
      this.setState({ galleryViewReady : false, galleryData : null }, () => {
        // category albums
        if (this.galleryViews.indexOf(this.state.curGalleryView) > -1 && this.state.curGalleryView !== 'local') {
          Photos.getUserAlbumPhotos(this.state.curGalleryView, (data) => {
            if(data.badCredentials || data.unknownError) {
              // change state of isLoggedIn to false
              AsyncStorage.multiRemove(['auth', 'user'], () => {
                self.setState({showProgress : false});
                window.EventBus.trigger('expiredLogin', true);
              });
            } else {
              self.setState({
                galleryData : data,
                currentData : data,
                galleryViewReady : true
              });
            }
          });

          return;
        }

        /*else if (this.state.curGalleryView == 'local') {
          if (data.locationData !== undefined) {
              self.setState({
                locationData : data.locationData,
                galleryViewReady : true,
                showProgress : false
              });
              Photos.queryUserLocationPhotos(data.locationData, (data) => {
                if (data.badCredentials || data.unknownError) {
                    // change state of isLoggedIn to false
                    AsyncStorage.multiRemove(['auth', 'user'], () => {
                      self.setState({showProgress : false});
                      window.EventBus.trigger('expiredLogin', true);
                    });
                } else {
                  console.log("i got the local photos");
                  console.log(data);

                }
              });

          }
          return;
        }*/
      });

  }

  reRenderGalleryList(data) {
    this.setState({showSearch : false}, () => {
      this.props.events.emit('reviveGalleryNav');
      this.nextPage(data.id);
    });
  }

  showSearch(searchData) {
    if (searchData.type == 'allcountries') {
      this.searchOptions = searchData.options.map((options) => { return {id : options.country_id, name : options.country }; });
      this.setState({showSearch : true});
    }
  }

  closeSearch() {
    this.setState({showSearch : false});
    this.props.events.emit('reviveGalleryNav');
  }

  nextPage(id, title) {
    window.EventBus.trigger('closePopover', {close: false});
    if (this.state.curGalleryView !== 'local') {
      this.props.changeGalleryViewState(this.state.curGalleryView);

      this.props.route.push({
        component: GalleryFeed,
        passProps : {
          feedType : this.state.curGalleryView,
          queryId : id,
          localObj : null,
          events : this.props.events
        },
        navbarPassProps : {
          title : title
        }
      });
    } else {
      this.props.changeGalleryViewState(this.state.curGalleryView);

      this.props.route.push({
        component: GalleryFeed,
        passProps : {
          feedType : this.state.curGalleryView,
          queryId : null,
          localObj : this.state.locationData,
          events : this.props.events
        },
        navbarPassProps : {
          title : title
        }
      });
    }
  }

  renderItem(data) {
    StatusBarIOS.setStyle('default');
    var sideMargin = (!Boolean((this.state.currentData.indexOf(data) + 1) % 2)) ? {marginLeft : 2} : {marginRight : 2};

    var id, title, amount;
    console.log('RENDERITEM');
    console.log(sideMargin);
    if (this.state.curGalleryView == 'categories') {
      id = data['category_id'];
      title = data['category_name'];
      amount = data['likesAmount'];
    } else {
      id = data['country_id'];
      title = data['country'];
      amount = "";
    }
    return (
      <View  style={[styles.imageSec, sideMargin]}>
        <TouchableOpacity style={{width: Dimensions.get('window').width / 2, height: 250}} onPress={() => { this.nextPage(id, title); }}>
            <Parallax.Image
              style={{flex: 1, height: Dimensions.get('window').height / 4}}
              indicator='bar'
              overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.3)'}}
              source={{ uri: String(data.url) }}
            >
              <View style={styles.textContainer}>
                <Text style={styles.categoryName}>{title}</Text>
                <Text style={styles.likesAmount}>{amount}</Text>
              </View>

            </Parallax.Image>
        </TouchableOpacity>
      </View>
    );
  }

  goToSettingsPage() {
    this.props.route.push({
      component: Settings,
      passProps : {
        title : Settings,
        titleStyle : {
          color : '#000'
        }
      }
    });
  }

  render() {
    var showCategories,
        searchView = <View></View>;

    if (this.state.showSearch) {
      searchView = <Search
            searchType={'allcountries'}
            searchOptions={this.searchOptions}
            getSearchedData={this.reRenderGalleryList.bind(this)}
            closeSearch={this.closeSearch.bind(this)}
          />;
      } else {
        searchView = <View></View>;
      }

    if (this.state.galleryViewReady && this.state.curGalleryView !== 'local') {
      return (
        <ScrollView style={{marginTop : 64}}>
          <GridView
            items={this.state.currentData}
            itemsPerRow={ITEMS_PER_ROW}
            renderItem={this.renderItem.bind(this)}
            style={styles.listView}
            scrollEnabled={true}
          />
        {searchView}
      </ScrollView>
      );
    } else if (this.state.curGalleryView == 'local') {
      var localView = <View>
          <Text>There are no photos located new your location...</Text>
        </View>;

      if (this.state.locationData !== null) {
        localView = <View>
          <Text>You currently have photos near your location. Would you like to view them?</Text>
            <TouchableHighlight
              style={{position : 'absolute', top : 200, left: 100}}
              onPress={this.nextPage.bind(this)}
              underlayColor="white">
              <Text>View Local Photos</Text>
            </TouchableHighlight>
        </View>;
      }

      return (
        <View>
          {usersProfileSection}
          {localView}
        </View>
      );
    } else {
      return (<View>
        <ActivityIndicatorIOS
          style={styles.feedLoader}
          animating={this.state.showProgress}
          size="large" />
      </View>);
    }
  }
}

var styles = StyleSheet.create({
  imageSec: {
    height: Dimensions.get('window').width / 2.2,
    flex: 1,
    marginTop: 2,
    marginBottom: 2,
    alignItems: 'center',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  title: {
    fontSize: 10,
    marginBottom: 8,
    width: 90,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    flex: 1,
    height: 200
  },
  listView: {
    margin: 4,
    backgroundColor: 'transparent'
  },
  textContainer : {
    height: 50,
    marginTop: 50
  },
  categoryName : {
    textAlign: "center",
    color : "#ffffff",
    fontSize: 12,
    fontFamily: General.font,
  },
  likesAmount : {
    textAlign: "center",
    color : "#ffffff",
    fontSize: 12,
    fontFamily: General.font,
  },
  map: {
    flex : 1,
    height : Dimensions.get('window').height
  }
});

reactMixin(GallerySection.prototype, Subscribable.Mixin);

module.exports = GallerySection;
