let React = require('react-native');
let ChangePassword = require('./ChangePassword');
let styles = require('../Styles/IntroStyles');
let Icon = require('react-native-vector-icons/FontAwesome');
let Separator = require('./Helpers/Separator');
let BlurView = require('react-native-blur').BlurView;
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
  ActivityIndicatorIOS
} = React;

class TempPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email : null,
      showProgress : false,
      showResetForm : false,
      forgotPasswordError : false,
      changePasswordMessage : ""
    };
  }

  goToChangePasswordPage() {
    this.props.route.push({
      component: ChangePassword,
      title: "Change Credentials"
    });
  }

  submitEmail() {
    var authService = require('../Utils/AuthService'),
        email = this.state.email;

    this.setState({forgotPasswordError : false, showProgress : true});

    authService.assignTemp(email, (res) => {
      this.setState({showProgress : false});
      if(!!res.success) {
        this.setState({changePasswordMessage: res.message});
        this.goToChangePasswordPage();
      } else {
        this.setState({forgotPasswordMessage: res.message});
        this.setState({forgotPasswordError : true});
      }
    });
  }

  render() {
    var errorCtrl = <View />;

    if (this.state.forgotPasswordError) {
      errorCtrl = <Text style={styles.error}>
        {this.state.forgotPasswordMessage}
      </Text>;
    }

    return (
      <View style={styles.container}>
        <View style={styles.bgWrapper}>
          <Image style={styles.bg} source={{uri : 'http://t.wallpaperweb.org/wallpaper/nature/2560x1440/exoticplace2560x1440wallpaper4412.jpg' }} />
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

        <View style={styles.forgotPasswordModal}>
          <View style={styles.forgotPasswordTopView}>
            <Text style={styles.changePassMessage}>
              Submit your email to reset your password.
            </Text>
          </View>
          <View style={styles.loginModalInputWrapper}>
            <TextInput
              style={styles.loginModalInput}
              placeholder="Email"
              placeholderTextColor="#cdcdcd"
              onChangeText={(text) => this.setState({email: text})}
            />
          </View>
          <TouchableHighlight
            style={styles.loginModalBtn}
            onPress={this.submitEmail.bind(this)}
            underlayColor="white">
            <Text style={styles.text}>Reset Password</Text>
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
    )
  }
}

module.exports = TempPassword;
