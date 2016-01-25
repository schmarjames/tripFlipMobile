let React = require('react-native');
let Router = require('react-native-custom-navigation');
let NavItem = require('./Helpers/NavItems');
let GalleryNavbar = require('./Helpers/GalleryNavigator');
let styles = require('../Styles/IntroStyles');
let PhotoFeed = require('./PhotoFeed');
let GallerySection = require('./GallerySection');
let Discover = require('./Discover');
let Explorer = require('./Explorer');
let Settings = require('./Settings');
let Locations = require('../Utils/Locations');
let Icon = require('react-native-vector-icons/Ionicons');
let Entypo = require('react-native-vector-icons/Entypo');
let Separator = require('./Helpers/Separator');
let BlurView = require('react-native-blur').BlurView;
let EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');

//let bgGeoService = require('../Utils/bgGeoService');


let {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  TabBarIOS,
  StatusBarIOS
} = React;

// weather api key dc917ecc31f3df833231b3804d609fed

class MainSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab : "Discover",
      feedCount : undefined,
      explorerView : false,
      locationSearchData : null,
      currentGalleryView : "GallerySection",
      searchViewStatus : "GallerySection"
    };

    this.locations = new Locations();

    this.discoverRoute = {
      component : Discover
    };

    this.settingsRoute = {
      component : Settings,
      title : 'Settings',
      titleStyle : '#333'
    };

    //this.bgGeo = new bgGeoService(this.changeTabState.bind(this), this.changeGalleryView.bind(this));
  }

  changeTabState(state) {
    this.setState({ selectedTab : state });
  }

  componentWillMount() {
    this.eventEmitter = new EventEmitter();
    this.explorerRoute = {
      component : Explorer,
      passProps : {
        events: this.eventEmitter
      }
    };

    this.galleryRoute = {
      component : GallerySection,
      passProps : {
        changeGalleryViewState : this.changeGalleryViewState.bind(this),
        events : this.eventEmitter,
        gestures : null
      }
    };
  }

  changeGalleryViewState(view) {
    this.setState({currentGalleryView : view});
    this.eventEmitter.emit('changeSearchViewStatus', view);
  }

  getCurrentGalleryViewState() {
    return this.state.currentGalleryView;
  }

  changeGalleryView(data) {
    // call gallery view change event
    this.eventEmitter.emit('changeGalleryView', data);
  }

  toggleSearchView(data) {
    var searchData = {
      type : data.type,
      options : this.state.locationSearchData
    };

    if (data.type == 'allcountries') {
      this.eventEmitter.emit('showGalleryMainSearch', searchData);
      return;
    }

    if (data.type == 'allLocations' || data.type == 'specificCountries') {
      this.eventEmitter.emit('showGallerySpecificSearch', searchData);
      return;
    }
  }

  queryLocationSearchOptions() {
    this.locations.getSearchOptions((data) => {
      if(data.badCredentials || data.unknownError) {
        // change state of isLoggedIn to false
        AsyncStorage.multiRemove(['auth', 'user'], () => {
          this.setState({showProgress : false});
          window.EventBus.trigger('expiredLogin', true);
        });
      } else {
        this.setState({locationSearchData : data});
      }
    });
  }

  notifyFeedUpdates(data) {
    if (data > 0) {
      this.setState({feedCount : data});
    }
    return;
  }

  render() {
    //StatusBarIOS.setStyle('default');
    return(
      <TabBarIOS
        tintColor="#204F84"
        barTintColor="#000"
        translucent={true}
      >
        <Icon.TabBarItem
          iconName="map"
          title="Album"
          selected={this.state.selectedTab === 'Gallery'}
          onPress={() => {
            this.setState({
              selectedTab: 'Gallery'
            });
            this.queryLocationSearchOptions();
            this.eventEmitter.emit('explorerStatusEvent', {status : false});
            window.EventBus.trigger('closePopover', {close: false});
          }}>

          <Router
            navbarComponent={GalleryNavbar}
            navbarPassProps={{
              changeGalleryView : this.changeGalleryView.bind(this),
              events : this.eventEmitter,
              toggleSearchView : this.toggleSearchView.bind(this),
              getCurrentGalleryViewState : this.getCurrentGalleryViewState.bind(this)
            }}
            initialRoute={this.galleryRoute} />

        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="map"
          title="Discover"
          selected={this.state.selectedTab === 'Discover'}
          onPress={() => {
            this.setState({
              selectedTab: 'Discover'
            });

          this.eventEmitter.emit('explorerStatusEvent', {status : false});
          window.EventBus.trigger('closePopover', {close: false});
          }}>
          <Router
            backButtonComponent={NavItem.BackButton}
            initialRoute={this.discoverRoute} />
        </Icon.TabBarItem>
        <Entypo.TabBarItem
          iconName="aircraft-take-off"
          title="Feed"
          selected={this.state.selectedTab === 'Feed'}
          badge={this.state.feedCount > 0 ? this.state.feedCount : undefined}
          onPress={() => {
            this.setState({
              selectedTab: 'Feed'
            });

          this.eventEmitter.emit('explorerStatusEvent', {status : false});
          window.EventBus.trigger('closePopover', {close: false});
          }}>
          <PhotoFeed updateFeedBadge={this.notifyFeedUpdates.bind(this)}
          />
        </Entypo.TabBarItem>
        <Icon.TabBarItem
          iconName="earth"
          title="Explore"
          selected={this.state.selectedTab === 'Explorer'}
          onPress={() => {
            this.setState({
              selectedTab: 'Explorer'
            });

          this.eventEmitter.emit('explorerStatusEvent', {status : true});
          window.EventBus.trigger('closePopover', {close: false});
          }}>
          <Router backButtonComponent={NavItem.BackButton} initialRoute={this.explorerRoute}/>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-settings"
          title="Settings"
          selected={this.state.selectedTab === 'Settings'}
          onPress={() => {
            this.setState({
              selectedTab: 'Settings'
            });

          this.eventEmitter.emit('explorerStatusEvent', {status : false});
          window.EventBus.trigger('closePopover', {close: false});
          }}>
          <Router
            backButtonComponent={NavItem.BackButton}
            initialRoute={this.settingsRoute} />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}

module.exports = MainSection;
