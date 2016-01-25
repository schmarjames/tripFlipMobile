let React = require('react-native');
let AuthService = require('../Utils/AuthService');
let styles = require('../Styles/SettingsStyles');
let reactMixin = require('react-mixin');
//let styles = require('../Styles/SettingStyles');
let Icon = require('react-native-vector-icons/Ionicons');
let Separator = require('./Helpers/Separator');
let ListPopover = require('./Helpers/ListPopover');
let BlurView = require('react-native-blur').BlurView;
let Locations = require('../Utils/Locations');
let UIImagePickerManager = require('NativeModules').UIImagePickerManager;
let Validator = require('../Utils/Validator');
let RNGeocoder = require('react-native-geocoder');

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
  ScrollView,
  Dimensions
} = React;

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user : this.props.userData
    };
    console.log(this.props.userData);
    this.settingTypes = [
      {
        name : 'ProfileSettings',
        title : 'My Account',
        settingModule : require('./ProfileSettings')
      },
      /*{
        name : 'NotificationSettings',
        title : 'Notification',
        settingModule : require('./NotificationSettings')
      }*/
    ];
  }

  goToSettingType(settingType) {
    var self = this,
        settingPage = this.settingTypes.filter((setting) => {
          if (setting.name == settingType) {
            return setting;
          }
        })[0];

    if (settingPage !== undefined) {
      AuthService.getAuthInfo((err, authInfo) => {
        this.props.route.push({
          component: settingPage.settingModule,
          passProps : {
            userData : authInfo.user,
          },
          title : settingPage.title,
          titleStyle : {
            color : '#333'
          }
        });
      });

    }
  }

  render() {

    return(
      <View style={styles.container}>
        <View style={styles.subheader}>
          <Text>Profile</Text>
        </View>
        <TouchableHighlight
          style={styles.optionRow}
          onPress={this.goToSettingType.bind(this, 'ProfileSettings')}
          underlayColor="white">
            <View style={[styles.settingLinkInnerWrap, {width : Dimensions.get('window').width}]}>
              <Text style={[styles.optionText, styles.settingLinkText]}>My Account</Text>
              <Icon style={styles.optionIcon} name={"chevron-right"}></Icon>
            </View>
        </TouchableHighlight>
      </View>
    );
  }
};

module.exports = Settings;
