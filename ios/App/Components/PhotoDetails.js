let React = require('react-native');
let Mapbox = require('react-native-mapbox-gl');
let Lightbox = require('./Helpers/Lightbox');
var ActivityView = require('react-native-activity-view');
let styles = require('../Styles/PhotoDetailsStyles');
let Photos = require('../Utils/Photos');
let Auth = require('../Utils/AuthService');
let WeatherData = require('./WeatherData');
let AsyncStorage = require('react-native').AsyncStorage;
let ParallaxView = require('react-native-parallax-view');
let LinearGradient = require('react-native-linear-gradient');
var { createIconSetFromFontello } = require('react-native-vector-icons');
var fontelloConfig = require('../Fonts/fontello/config.json');
var FontelloIcon = createIconSetFromFontello(fontelloConfig, 'weather', 'weather.ttf');
let Ionicon = require('react-native-vector-icons/Ionicons');

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
  MapView,
  Modal,
  LinkingIOS,
  StatusBarIOS,
  Dimensions
} = React;

class PhotoDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.photo);

    var self = this;

    this.state = {
      photo : props.photo,
      showLightImage : false,
      fadeValue: new Animated.Value(0),
      animated : true,
      transparent : false,
      mapVisible : false,
      region : {
        latitude : props.photo.lat,
        longitude : props.photo.long
      },
      annotations : [{
           coordinates : [props.photo.lat, props.photo.long],
           "type" : "point",
           'strokeColor': '#fffff',
       'fillColor': 'blue',
       'id': 'zap'
        }]
    };
    console.log("PHOTO DETAIL");
    console.log(this.state.photo);
  }

  toggleMap(status) {
    this.setState({mapVisible : status});
  }

  getWeatherIcon() {
    var iconCode = this.state.photo.weather.iconCode;
    var weatherIcon;

    switch(iconCode) {
      case  '01d':
        weatherIcon = 'sun';
        break;
      case '01n':
        weatherIcon = 'moon';
        break;
      case '02d':
        weatherIcon = 'cloud-sun';
        break;
      case '02n':
        weatherIcon = 'cloud-moon';
        break;
      case '03d':
        weatherIcon = 'cloud';
        break;
      case '03n':
        weatherIcon = 'cloud';
        break;
      case '04d':
        weatherIcon = 'clouds';
        break;
      case '04n':
        weatherIcon = 'clouds';
        break;
      case '09d':
        weatherIcon = 'rain';
        break;
      case '09n':
        weatherIcon = 'rain';
        break;
      case '10d':
        weatherIcon = 'rain';
        break;
      case '10n':
        weatherIcon = 'rain';
        break;
      case '11d':
        weatherIcon = 'clouds-flash-alt';
        break;
      case '11n':
        weatherIcon = 'clouds-flash-alt';
        break;
      case '13d':
        weatherIcon = 'snow-heavy';
        break;
      case '13n':
        weatherIcon = 'snow-heavy';
        break;
      case '50d':
        weatherIcon = 'fog';
        break;
      case '50n':
        weatherIcon = 'fog';
        break;
      default :
        weatherIcon = 'clouds';
    }
    return weatherIcon;
  }

  likePhoto(photo) {
    var self = this,
        id = photo.id,
        photo = this.state.photo;

    Photos.likePhoto(id, (data) => {
      if (data.badCredentials || data.unknownError) {
        // change state of isLoggedIn to false
        AsyncStorage.multiRemove(['auth', 'user'], () => {
          self.setState({showProgress : false});
          window.EventBus.trigger('expiredLogin', true);
        });
      } else {
        if (!isNaN(data)) {
          if (data) {
            photo.likes = this.state.photo.likes++;
            photo.likedByUser = true;

            this.setState({photo : photo});
          } else {
            photo.likes = this.state.photo.likes--;
            photo.likedByUser = false;

            this.setState({photo : photo});
          }
          window.EventBus.trigger('updatePhotoData', {id : id});
          window.EventBus.trigger('updateLike', {id : id, add : false});
        }

      }
    });
  }

  sharePhoto(url) {
    ActivityView.show({
      text: 'ActivityView for React Native',
      url: 'https://github.com/naoufal/react-native-activity-view',
      imageUrl: url
    });
  }

  toggleLightImageState(status) {

    Animated.timing(                          // Base: spring, decay, timing
        this.state.fadeValue,                 // Animate `likeBounceValue`
        {
          toValue: (status) ? 1 : 0,                        // Bouncier spring
        }
      ).start(this.setState({showLightImage : status}));
  }

  navigateToLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        LinkingIOS.openURL(`http://maps.apple.com/?saddr=${position.coords.latitude},${position.coords.longitude}&daddr=${this.state.photo.lat},${this.state.photo.long}`);
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  render() {
    StatusBarIOS.setStyle('default');
    var weatherIcon = this.getWeatherIcon();
    var lightImage = <View style={{height: 250, width: Dimensions.width}}></View>;

    if (this.state.showLightImage) {
      lightImage = <Animated.Image
        resizeMode="cover"
        source={{uri : this.state.photo.url}}
        style={[styles.entryImage, {opacity : this.state.fadeValue}]}
      />;
    } else {
      lightImage = <View style={{height: 250, width: Dimensions.width}}></View>
    }

    return (
      <ParallaxView
        backgroundSource={{uri : this.state.photo.url}}
        windowHeight={(Dimensions.get('window').height /2)-25}
        header={(

            <Lightbox
              author={this.state.photo.author}
              likes={this.state.photo.likes}
              weather={{weather:"what"}}
              onOpen={this.toggleLightImageState.bind(this, true)}
              onClose={this.toggleLightImageState.bind(this, false)}
              >
              {lightImage}
            </Lightbox>
        )}
      >
        <View style={{height : (Dimensions.get('window').height - 200), width: Dimensions.get('window').width}}>
          <View style={styles.photoDetails}>

            <View style={styles.space}>
              <Text style={styles.locationText}>
                {this.state.photo.city.toUpperCase()}, {(this.state.photo.country == "United States") ? this.state.photo.state_region.toUpperCase() : this.state.photo.country.toUpperCase()}
              </Text>
            </View>

            <View style={styles.space}>
              <Text style={styles.authorInfo}>
                By: {this.state.photo.author}
              </Text>
            </View>

            <View style={styles.space}>
              <View style={styles.photoLikeInfo}>
                <Text style={styles.photoText}>{this.state.photo.likes} Likes</Text>
              </View>
            </View>

            <View style={styles.weatherWrapper}>
              <View style={styles.weatherIconWrapper}>
                <FontelloIcon
                  name={weatherIcon}
                  style={styles.weatherIcon}></FontelloIcon>
              </View>
              <View style={styles.weatherDetailWrapper}>
                <View>
                  <Text style={styles.weatherText}>{Math.floor(this.state.photo.weather.temp)}</Text>
                </View>
                <View>
                  <FontelloIcon
                    name={'fahrenheit'}
                    style={styles.weatherDegreeIcon}></FontelloIcon>
                </View>

              </View>
            </View>

            <View style={{marginTop : 80}}>
              <Text style={styles.photoText}>{this.state.photo.weather.description}</Text>
            </View>

          </View>
          <View style={styles.detailButtons}>
            <TouchableOpacity onPress={() => this.likePhoto(this.state.photo)}>
              <Ionicon
                name={this.state.photo.likedByUser ? "ios-heart" : "ios-heart-outline" }
                style={styles.detailIcon}></Ionicon>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.sharePhoto(this.state.photo.url)}>
              <Ionicon
                name={"share"}
                style={styles.detailIcon}></Ionicon>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleMap.bind(this, true)}>
              <Ionicon
                name={"map"}
                style={styles.detailIcon}></Ionicon>
            </TouchableOpacity>
          </View>

          <View>
            <Modal
              animated={this.state.animated}
              transparent={this.state.transparent}
              visible={this.state.mapVisible}
              >
              <Mapbox
                accessToken={'pk.eyJ1Ijoic2NobWFyaiIsImEiOiJjaWdvYzRrOG4wMDIxdDdrbjZsc2c3ampvIn0.PrBgPwo8A7wiuy5wu3HYiQ'}
                centerCoordinate={this.state.region}
                zoomLevel={14}
                styleURL={'asset://styles/streets-v8.json'}
                annotations={this.state.annotations}
                style={{height: Dimensions.height, width: Dimensions.width}}
              />
              <View style={styles.modalButtonsWrapper}>
                <View style={{flex: 2, alignItems: 'flex-start'}}>
                  <TouchableOpacity onPress={this.toggleMap.bind(this, false)}>
                    <Ionicon
                      name={"close-circled"}
                      style={styles.detailIcon}></Ionicon>
                  </TouchableOpacity>
                </View>

                <View style={{flex: 2, alignItems: 'flex-end'}}>
                  <TouchableOpacity onPress={() => this.navigateToLocation()}>
                    <Ionicon
                      name={"ios-navigate"}
                      style={styles.detailIcon}></Ionicon>
                  </TouchableOpacity>
                </View>

              </View>
            </Modal>
          </View>

        </View>

      </ParallaxView>

    );
  }
}

module.exports = PhotoDetails;
