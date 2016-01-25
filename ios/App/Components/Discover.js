let React = require('react-native');
let Router = require('react-native-custom-navigation');
let GeneralNavbar = require('./Helpers/GeneralNavigator');
let Photos = require('../Utils/Photos');
let reactMixin = require('react-mixin');
let styles = require('../Styles/Discover');
let Parallax = require('react-native-parallax');
let PhotoFeed = require('./PhotoFeed');

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
  AsyncStorage
} = React;

class Discover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories : null,
      chosenCategory : null
    };
  }

  componentWillMount() {
    if (this.props.updateShownStatus !== undefined) {
      this.props.updateShownStatus(true);
    }
    var self = this;
    Photos.getCategoryPhotos((data) => {
      if(data.badCredentials || data.unknownError) {
        // change state of isLoggedIn to false
        AsyncStorage.multiRemove(['auth', 'user'], () => {
          self.setState({showProgress : false});
          window.EventBus.trigger('expiredLogin', true);
        });
      } else {
        self.setState({categories : data});
      }
    });
  }

  nextPage(categoryId, categoryName) {
    this.props.route.push({
      component: PhotoFeed,
      title : categoryName,
      passProps : {
        category : categoryId
      },
      navbarComponent : GeneralNavbar,
      navbarPassProps : {
        title : categoryName
      }
    });
  }

  render() {
    var showCategories;
    if (this.state.categories !== null) {
      return (
        <ScrollView
          scrollEventThrottle={16}
          onScroll={this.onParallaxScroll}
          automaticallyAdjustContentInsets={false}
        >
          {this.state.categories.map((data, i, arr) => {
            var marginBottom = 0;
            if ((arr.length - 1) == i) { marginBottom = 49; }
            return (
              <TouchableOpacity style={[styles.categorySec, {marginBottom : marginBottom}]} key={i} onPress={() => { this.nextPage(data.category_id, data.category_name); }}>
                  <Parallax.Image
                    style={{flex: 1, height: 250}}
                    indicator='bar'
                    scrollY={this.state.parallaxScrollY}
                    overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.6)'}}
                    source={{ uri: data.url }}
                  >
                    <View style={styles.textContainer}>
                      <Text style={styles.categoryName}>{data.category_name.toUpperCase()}</Text>
                    </View>

                  </Parallax.Image>
              </TouchableOpacity>);
          })}
        </ScrollView>
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

reactMixin(Discover.prototype, Parallax.Mixin);

module.exports = Discover;
