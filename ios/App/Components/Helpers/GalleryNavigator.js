let React = require('react-native');
let NavItem = require('./NavItems');
let NavbarContent = require('./Navbar');
let Popover = require('react-native-popover');
let styles = require('../../Styles/GalleryNavbar');
let reactMixin = require('react-mixin');
let EventEmitter = require('EventEmitter');
let Subscribable = require('Subscribable');



let {
  Image,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  Animated,
  Dimensions
} = React;

let axisWidth = Dimensions.get('window').width - 120;

class NavbarWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title : null,
      displaySearch : false,
      displayBack : false,
      currentView : props.currentView,
      isVisible : false,
      fromRect : {},
      navOpacity : new Animated.Value(1),
      topPos : new Animated.Value(0),
      navBackground : {backgroundColor: '#ffffff', borderBottomWidth: 1},
      displayGalleryMenu : false,
      albumListSelected : ""
    }
  }

  componentWillMount() {
    window.EventBus.on('navigationChanged', (data) => {
      console.log('navigationChanged');
      console.log(data.current);
      console.log(data.component);

      if (data.component && (data.component != 'Discover' && data.component != 'PhotoFeed')) {
        if (data.current == 0) {
          var currentView = this.props.getCurrentGalleryViewState();
          this.toggleSearchButton(currentView, true);
        }

        if (data.current == 2) {
          this.setState({
            navBackground : {backgroundColor: 'transparent', borderBottomWidth: 0, color : "#ffffff"},
            displaySearch : false,
          });
        }

        else {
          this.setState({
            navBackground : {backgroundColor: '#ffffff', borderBottomWidth: 1, color: "#333"}
          });
        }

        if (data.current == 1) {
          this.setState({displaySearch : true});
        }

        this.setState({albumListSelected : ""});
      }

    });
    this.addListenerOn(this.props.events, 'changeSearchViewStatus', this.toggleSearchButton.bind(this));
    this.addListenerOn(this.props.events, 'reviveGalleryNav', () => {
      Animated.spring(
        this.state.navOpacity,
        {
          toValue: 1
        }
      ).start();
    });

    window.EventBus.on('animateNav', (status) => {
      if (!status) {
        Animated.spring(
          this.state.topPos,
          {
            toValue: 0,
            friction : 10
          }
        ).start();
      } else {
        Animated.spring(
          this.state.topPos,
          {
            toValue: -64,
            friction : 10
          }
        ).start();
      }
    });
  }

  componentWillReceiveProps(newProps) {

    if (newProps.currentView !== this.state.currentView) {
      this.setState({ currentView : newProps.currentView });
    }
  }

  componentDidMount() {
    window.EventBus.on('closePopover', (data) => {
        this.setState({isVisible : data.close});
    });

    window.EventBus.on('show', (data) => {
      if (data.current > 0) {
        this.setState({displayBack : true});
      }

      else if (data.current == 0) {
        this.setState({displayBack : false});
      }
    });
  }

  push() {
    if (this.props.route.index > 4) {
      return;
    }

    this.props.route.push({
      component: DemoView,
    });
  }

  showMenu(buttonMeasurments) {

    if (!buttonMeasurments) {
      this.setState({isVisible: false, buttonRect : {}});
    } else {
      this.setState({isVisible: true, buttonRect: buttonMeasurments});
    }
  }

  toggleSearchButton(status, firstView) {
    var galleryView = this.props.getCurrentGalleryViewState();
    if (this.state.albumListSelected == 'categories') {
        this.setState({displaySearch : false});
    }

    if (this.state.albumListSelected == 'countries') {
        this.setState({displaySearch : true});
    }

    if (this.state.albumListSelected == '') {
        if (status == 'categories' && galleryView == 'GallerySection') {
          this.setState({displaySearch : true});
        }

        if (status == 'categories' && galleryView == 'categories') {
            this.setState({displaySearch : false});
        }
    }
  }

  showSearch() {
    var currentView = this.props.getCurrentGalleryViewState();
    // fire search view event based on where user is at in the gallery
    if (currentView == "GallerySection") {
      // countries view of main gallery section
      this.props.toggleSearchView({type : 'allcountries'});
    }

    else if (currentView == 'categories') {
      this.props.toggleSearchView({type : 'allLocations'});
    }

    else if (currentView == 'countries') {
      this.props.toggleSearchView({type : 'specificCountries'});
    }

    Animated.spring(
      this.state.navOpacity,
      {
        toValue: 0
      }
    ).start();
  }

  render() {
    var title = <View></View>;

    if (this.state.title !== null) {
      title = <Text>{this.state.title}</Text>;
    }

    return (
      <Animated.View style={[{opacity : this.state.navOpacity, borderColor: '#c8c8c8', top : this.state.topPos}, this.state.navBackground]}>
        <NavbarContent
          displayGalleryMenu={this.state.displayGalleryMenu}
          displayBack={this.state.displayBack}
          displaySearch={this.state.displaySearch}
          title={this.props.title}
          showSearch = {this.showSearch.bind(this)}
          showMenu = {this.showMenu.bind(this)}
          goBack = {this.props.route.pop}/>
        <View style={styles.navTitle}>
          {title}
        </View>

        <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            onClose={this.closePopover}
            placement="bottom">
            <View style={styles.popoverWrapper}>
              <TouchableHighlight onPress={() => {
                  var self = this;
                  this.setState({albumListSelected: "categories"});
                  this.setState({ isVisible : false, displaySearch : false, displayGalleryMenu: false }, () => {

                    self.props.changeGalleryView({
                      viewQuery : "categories",
                      mainGalleryView : (this.props.getCurrentGalleryViewState() == "GallerySection") ? false : true
                    });
                  });
                }}
                underlayColor="transparent">
                <View style={styles.popoverView}>
                  <Text>Categories</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => {
                  var self = this;
                  this.setState({albumListSelected: "countries"});
                  self.setState({ isVisible : false, displayGalleryMenu: false }, () => {

                    self.props.changeGalleryView({
                      viewQuery : "countries",
                      mainGalleryView : (this.props.getCurrentGalleryViewState() == "GallerySection") ? false : true
                    });
                  });

                }}
                underlayColor="transparent">
                <View style={styles.popoverView}>
                  <Text>Countries</Text>
                </View>
              </TouchableHighlight>
            </View>
          </Popover>
      </Animated.View>
      );
  }
}

reactMixin(NavbarWrapper.prototype, Subscribable.Mixin);

module.exports = NavbarWrapper;
