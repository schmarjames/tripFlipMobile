let React = require('react-native');
let styles = require('../Styles/PhotoFeedStyles');
let Photos = require('../Utils/Photos');
let Auth = require('../Utils/AuthService');
let WeatherData = require('./WeatherData');
let Lightbox = require('./Helpers/Lightbox');
let AsyncStorage = require('react-native').AsyncStorage;
let LinearGradient = require('react-native-linear-gradient');
let Icon = require('react-native-vector-icons/Ionicons');

let {
  RefresherListView,
  LoadingBarIndicator
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
  StatusBarIOS
} = React;

class PhotoRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoData : this.props.photoData,
      opacity : new Animated.Value(0)
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    if (newProps.photoData !== this.state.photoData) {
      this.setState({ photoData : newProps.photoData });
    }
  }

  showImage() {
    Animated.spring(                          // Base: spring, decay, timing
      this.state.opacity,                 // Animate `likeBounceValue`
      {
        toValue: 1                        // Bouncier spring
      }
    ).start();
  }

  render() {
    StatusBarIOS.setStyle('default');
    var image, likeButton = <View></View>;
    if (this.props.lightBox) {
      image = <Lightbox author={this.state.photoData.author} likes={this.state.photoData.likes} weather={this.state.photoData.weatherCondition}>
                <Image
                  resizeMode="cover"
                  source={{uri : this.state.photoData.url}}
                  style={styles.entryImage}
                  onLoadEnd={this.showImage.bind(this)}
                />
              </Lightbox>;
    } else {
      image = <TouchableOpacity onPress={() => this.props.nextPage(this.state.photoData)}>
                <Image
                  resizeMode="cover"
                  source={{uri : this.state.photoData.url}}
                  style={styles.entryImage}
                  onLoadEnd={this.showImage.bind(this)}
                />
              </TouchableOpacity>;
    }

    if (this.props.likeButton) {
      likeButton = <TouchableOpacity onPress={() => this.props.likePhoto(this.state.photoData)}>
                    <Icon
                      name={this.state.photoData.likedByUser ? "ios-heart" : "ios-heart-outline" }
                      style={styles.likeIcon}></Icon>
                   </TouchableOpacity>;
    }
    return (


        <Animated.View style={{opacity : this.state.opacity}}>
            <View style={styles.entryImageWrap}>
              {image}
            </View>

            <LinearGradient colors={[processColor('transparent'), processColor('rgba(0, 0, 0, 0.6)')]} style={styles.linearGradient}>
              <Text style={styles.entryBottomSection}>
                {this.state.photoData.city.toUpperCase()}, {(this.state.photoData.country == "United States") ? this.state.photoData.state_region.toUpperCase() : this.state.photoData.country.toUpperCase()}
              </Text>
              {likeButton}
            </LinearGradient>
        </Animated.View>
    );
  }
}

module.exports = PhotoRow;
