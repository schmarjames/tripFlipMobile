let React = require('react-native');
let styles = require('../Styles/IntroStyles');
let Icon = require('react-native-vector-icons/FontAwesome');
let Separator = require('./Helpers/Separator');
let BlurView = require('react-native-blur').BlurView;

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

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProgress : false,
      changePassError : null,
      resetPassword : {
        email : null,
        tempPassword : null,
        newPassword : null,
        repeatNewPassword : null
      }
    };
  }

  updateResetFormData(data) {
    var resetPassword = this.state.resetPassword,
        formInput = Object.keys(data)[0];
    resetPassword[formInput] = data[formInput];
    this.setState({resetPassword: resetPassword});
  }

  submitNewPassData() {
    var authService = require('../Utils/AuthService');
    var Validator = require('../Utils/Validator');
    var v = new Validator();
    v.setRules({ email : [v.Email, "Please enter a valid email."] });

    var valid = v.validateData(this.state.resetPassword),
        self = this;

    this.setState({changePassError : null, showProgress : true});
    if (typeof valid === "boolean" && valid) {
      authService.resetPassword(this.state.resetPassword, (res) => {
        if(!!res.success) {
          this.setState({showProgress : false});
          self.state.changePasswordMessage = res.message;

          self.setState({
            changePassError : null,
            changePasswordMessage : ""
          }, () => {
            this.props.route.popToRoute({
              component: require('./Login')
            });
          });
        } else {
          this.setState({changePassError : res.message});
        }
      });
    }

    // set error
    this.setState({changePassError : valid.error});
    return false;
  }

  render() {
    var errorCtrl = <View />;
    var changePasswordMessage = <View />;

    if (this.state.changePassError !== null) {
      errorCtrl = <Text style={styles.error}>
        {this.state.changePassError}
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
        <View style={styles.changePasswordModal}>
          {this.props.changePasswordMessage}
          <View style={styles.loginModalInputWrapper}>
            <TextInput
              style={styles.loginModalInput}
              placeholder="Email"
              placeholderTextColor="#cdcdcd"
              onChangeText={(text) => this.updateResetFormData({email: text})}
            />
            <Separator />
              <TextInput
                style={styles.loginModalInput}
                placeholder="Temporary Password"
                password={true}
                placeholderTextColor="#cdcdcd"
                onChangeText={(text) => this.updateResetFormData({tempPassword: text})}
              />
              <Separator />
            <TextInput
              style={styles.loginModalInput}
              placeholder="New Password"
              password={true}
              placeholderTextColor="#cdcdcd"
              onChangeText={(text) => this.updateResetFormData({newPassword: text})}
            />
            <Separator />
            <TextInput
              style={styles.loginModalInput}
              placeholder="Repeat New Password"
              password={true}
              placeholderTextColor="#cdcdcd"
              onChangeText={(text) => this.updateResetFormData({repeatNewPassword: text})}
            />
          </View>
          <TouchableHighlight
            style={styles.loginModalBtn}
            onPress={this.submitNewPassData.bind(this)}
            underlayColor="white">
            <Text style={styles.text}>Change Password</Text>
          </TouchableHighlight>

          {errorCtrl}

          <ActivityIndicatorIOS
            style={styles.loader}
            animating={this.state.showProgress}
            size="large" />
        </View>
        </BlurView>
      </View>
    )
  }
}

module.exports = ChangePassword;
