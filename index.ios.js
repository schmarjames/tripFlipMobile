/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var BackboneEvents = require('backbone-events-standalone');
let Router = require('react-native-custom-navigation');
let Intro = require('./ios/App/Components/Intro');
let MainSection = require('./ios/App/Components/MainSection');
let AuthService = require('./ios/App/Utils/AuthService');
let NavItem = require('./ios/App/Components/Helpers/NavItems');
window.EventBus = BackboneEvents.mixin({});
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS
} = React;

class tripflipApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn : false,
      expireLogin : false,
      checkingAuth: true,
    };

    this.introRoute = {
      component : Intro,
      passProps : {
        isLoggedIn : this.isLoggedIn.bind(this),
        expireLogin : this.state.expireLogin
      }
    };
  }

  componentDidMount() {
    window.EventBus.on('expiredLogin', (status) => {
      this.setState({expireLogin : status});
    });

    AuthService.getAuthInfo((err, authInfo) => {
      this.setState({
        checkingAuth : false,
        isLoggedIn : authInfo != null
      });
    });
  }

  expireLogin(status) {
    this.setState({expireLogin : status});
  }

  isLoggedIn(status) {
    this.setState({isLoggedIn : status, expireLogin : false});
  }

  render() {
    if(this.state.checkingAuth) {
      return (
        <View>
          <ActivityIndicatorIOS
            animating={true}
            size="large"
            />
        </View>
      );
    }

    if (this.state.isLoggedIn && this.state.expireLogin == false) {
      return (
        <MainSection expireLogin={this.expireLogin.bind(this)}/>
      );
    } else {
      /*
      <Intro
        logUserIn={this.logUserIn.bind(this)}
        showSignUpForm={this.toggleSignUp.bind(this)}
        showForgotPasswordForm={this.forgotPassword.bind(this)}
        expired={this.state.expireLogin}
        toggleLogin={this.toggleLogin.bind(this)}
        />
      */
      return (
        <Router
          backButtonComponent={NavItem.AuthBack}
          initialRoute={this.introRoute}
          />
      );
    }
  }
};

AppRegistry.registerComponent('tripflipApp', () => tripflipApp);
