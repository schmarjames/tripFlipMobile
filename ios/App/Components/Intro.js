let React = require('react-native');
let Swiper = require('react-native-swiper');
let Router = require('react-native-custom-navigation');
let styles = require('../Styles/IntroStyles');
let Icon = require('react-native-vector-icons/Ionicons');

let Signup = require('./Signup');
let Login = require('./Login');


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
  Dimensions
} = React;

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        showProgress: false
    };
  }

  goToSignUpPage() {
    var self = this;
    this.props.route.push({
      component: Signup,
      title: "SignUp",
      passProps : {
        isLoggedIn : self.isLoggedIn.bind(self)
      }
    });
  }

  goToLogInPage() {
    var self = this;
    this.props.route.push({
      component: Login,
      passProps : {
        isLoggedIn : self.isLoggedIn.bind(self)
      },
      title : "Sign In"
    });
  }

  isLoggedIn(status) {
    this.props.isLoggedIn(status);
  }

  componentDidMount() {
    if (this.props.expireLogin) {
      this.goToLogInPage();
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <Swiper style={styles.swipeWrapper} showButtons={true} height={Dimensions.get('window').height - (Dimensions.get('window').height / 4)}>
          <View style={styles.slide1}>
            <View style={styles.bgWrapper}>
              <Image style={styles.bg} source={require('../Assets/greece.jpg')} />
              <View style={styles.bgOverlay}></View>
            </View>
            <Text style={styles.welcomeSlideText}>Explore beautiful travel photography across the globe.</Text>
          </View>
          <View style={styles.slide1}>
            <View style={styles.bgWrapper}>
              <Image style={styles.bg} source={require('../Assets/bar01.jpg')} />
              <View style={styles.bgOverlay}></View>
            </View>
            <Text style={styles.welcomeSlideText}>Save favorites to your personal photo album.</Text>
          </View>
          <View style={styles.slide1}>
            <View style={styles.bgWrapper}>
              <Image style={styles.bg} source={require('../Assets/italy.jpg')} />
              <View style={styles.bgOverlay}></View>
            </View>
            <Text style={styles.welcomeSlideText}>Get directions to your favorite photos destination.</Text>
          </View>
        </Swiper>

        <View style={styles.introButtons}>
          <TouchableHighlight
            style={[styles.signInBtn, {height : (Dimensions.get('window').height / 4) / 2, marginTop : 0, marginBottom : 0}]}
            onPress={this.goToLogInPage.bind(this)}
            underlayColor="white">
            <View style={styles.signInBtnInnerWrap}>
              <Icon name="email" style={styles.btnIcon}></Icon>
              <Text style={styles.signInText}>Sign in with email</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.signUpBtn, {height : (Dimensions.get('window').height / 4) / 2, marginTop : 0, marginBottom : 0, borderRadius : 0}]}
            onPress={this.goToSignUpPage.bind(this)}
            underlayColor="white">
            <Text style={styles.text}>Sign Up</Text>
          </TouchableHighlight>
        </View>

        <Text style={styles.title}>Trip Flip</Text>
      </View>
    )
  }
};

module.exports = Intro;
