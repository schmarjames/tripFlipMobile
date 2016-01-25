let React = require('react-native');
let MainSection = require('./MainSection');
let TempPassword = require('./TempPassword');
let NavItem = require('./Helpers/NavItems');
let styles = require('../Styles/IntroStyles');

let BlurView = require('react-native-blur').BlurView;
let Separator = require('./Helpers/Separator');

let {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS
} = React;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        email : "",
        password : "",
        badCredentials : null,
        showProgress: false,
        unknownError : null
    };
  }

  showForgotPasswordPage() {
    this.props.route.push({
      component: TempPassword,
      title: "Forgot Password"
    });
  }

  onLoginPressed(event) {
    var self = this;
    if (this.state.email == null || this.state.password == null) {
      return false;
    }
    this.setState({badCredentials : null});
    this.setState({unknownError : null});
    this.setState({showProgress: true});

    var authService = require('../Utils/AuthService');
    authService.login({
      email : this.state.email.toLowerCase().trim(),
      password : this.state.password
    }, (results) => {
        if (results.line != undefined) {
          this.setState({showProgress : false, badCredentials : true, unknownError : true });
        }
        if (results.success) {
            this.setState(Object.assign({showProgress : false}, results));
            self.props.isLoggedIn(true);
            self.props.route.popToTop();
        }
        if(results.badCredentials) {
          this.setState({showProgress : false, badCredentials : true });
        }
    });
  }

  render() {
    var errorCtrl = <View />;
    if (!this.state.success && this.state.badCredentials) {
      errorCtrl = <Text style={styles.error}>
        Your credentials are incorrent.
      </Text>;
    }

    if (!this.state.success && this.state.unknownError) {
      errorCtrl = <Text style={styles.error}>
        There has been an unexpencted issue with your login.
      </Text>;
    }

    return (
      <View style={styles.container}>
        <View style={styles.bgWrapper}>
          <Image style={styles.bg} source={require('../Assets/greece.jpg')} />
          <View style={styles.bgOverlay}></View>
        </View>
        <BlurView blurType="dark"
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'transparent',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }}
        >

        <View ref='loginModal' style={styles.loginModal}>
          <TouchableOpacity onPress={this.showForgotPasswordPage.bind(this)}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={styles.loginModalInputWrapper}>
            <TextInput
              style={styles.loginModalInput}
              placeholder="Email"
              placeholderTextColor="#cdcdcd"
              onChangeText={(text) => this.setState({email: text})}
            />
            <Separator />
            <TextInput
              style={styles.loginModalInput}
              placeholder="Password"
              placeholderTextColor="#cdcdcd"
              password={true}
              onChangeText={(text) => this.setState({password: text})}
            />
          </View>
          <TouchableHighlight
            style={styles.loginModalBtn}
            onPress={this.onLoginPressed.bind(this)}
            underlayColor="white">
            <Text style={styles.text}>Log In</Text>
          </TouchableHighlight>
          <View style={styles.bottomSection}>
            {errorCtrl}

            <ActivityIndicatorIOS
              style={styles.loader}
              animating={this.state.showProgress}
              size="large" />
          </View>
        </View>
        </BlurView>
      </View>
    );
  }
};

module.exports = Login;
