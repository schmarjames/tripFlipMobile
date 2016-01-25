let React = require('react-native');
let styles = require('../Styles/SettingsStyles');
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

class passwordSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProgress : false,
      changePassError : null,
      resetPassword : {
        currentPassword : null,
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
    v.setRules({
      currentPassword : [v.Str, "Current password is required."],
      newPassword : [v.Str, "New password is required."],
      repeatNewPassword : [v.Str, "Confirm your new password."]
    });

    var valid = v.validateData(this.state.resetPassword),
        self = this;

    this.setState({changePassError : null, showProgress : true});
    if (typeof valid === "boolean" && valid) {
      authService.changeProfileSettings("password", this.state.resetPassword, (res) => {
        if(!!res.success) {
          this.setState({showProgress : false});
          self.state.changePasswordMessage = res.message;

          self.setState({
            changePassError : null,
            changePasswordMessage : ""
          }, () => {
            this.props.route.popToRoute({
              component: require('./Settings')
            });
          });
        } else {
          window.EventBus.trigger('expiredLogin', true);
        }
      });
    }
    // set error
    this.setState({changePassError : valid.error});
    this.setState({showProgress : false});
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
        <View>
          {this.props.changePasswordMessage}
          <View style={styles.signupInputWrapper}>
            <TextInput
              style={styles.signupInput}
              placeholder="Enter Your Current Password"
              placeholderTextColor="#cdcdcd"
              onChangeText={(text) => this.updateResetFormData({currentPassword: text})}
            />
            <Separator />
            <TextInput
              style={styles.signupInput}
              placeholder="Enter Your New Password"
              password={true}
              placeholderTextColor="#cdcdcd"
              onChangeText={(text) => this.updateResetFormData({newPassword: text})}
            />
            <Separator />
            <TextInput
              style={styles.signupInput}
              placeholder="Enter Your Repeat New Password"
              password={true}
              placeholderTextColor="#cdcdcd"
              onChangeText={(text) => this.updateResetFormData({repeatNewPassword: text})}
            />
          <Separator />
          </View>
          <TouchableHighlight
            style={[styles.signUpBtn, {marginLeft: 10, marginRight: 10}]}
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
      </View>
    )
  }
}

module.exports = passwordSettings;
