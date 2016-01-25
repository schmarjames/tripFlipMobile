let React = require('react-native');
let Separator = require('./Separator');
let General = require('../../Styles/General');

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
  Dimensions
} = React;

class ProfileHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userData : this.props.userData
    };
  }

  render() {

    console.log('profileheader');
    console.log(this.state.userData);
    return (
      <View style={{height : Dimensions.height / 5}}>
        <View style={{flex : 1, flexDirection : 'row', marginTop : 40}}>
          <View style={{flex: 2}}>
            <Image source={{uri: this.state.userData.profile_pic}} style={{width: 50, height: 50, borderRadius: 16, alignSelf: 'center', marginTop: 10, marginBottom: 10}} />
          </View>
          <View style={{flex: 3, textAlign: 'left', justifyContent : 'center'}}>
            <Text style={{color : '#000'}}>{this.state.userData.name}</Text>
          </View>
          <View style={{flex: 3, textAlign: 'left', justifyContent : 'center'}}>
            <TouchableHighlight
              style={General.actionOutlineBtn}
              onPress={this.openSettingsModal.bind(this, true)}
              underlayColor="white">
              <Text style={styles.text}>Edit Profile</Text>
            </TouchableHighlight>
          </View>

        </View>
        <Separator />
      </View>
    );
  }
}

module.exports = ProfileHeader;
