let React = require('react-native');
let AuthService = require('../Utils/AuthService');
let styles = require('../Styles/SettingsStyles');
let Icon = require('react-native-vector-icons/Ionicons');
let Separator = require('./Helpers/Separator');
let ListPopover = require('./Helpers/ListPopover');
let BlurView = require('react-native-blur').BlurView;
let Locations = require('../Utils/Locations');
let UIImagePickerManager = require('NativeModules').UIImagePickerManager;
let Validator = require('../Utils/Validator');
let RNGeocoder = require('react-native-geocoder');
let _ = require('lodash');

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

class ProfileSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        keyboardSpace: 0,
        isKeyboardOpened : false,
        item : "Select Item",
        isVisible : false,
        showProgress : false,
        selectCountryFirst : false,
        formError : null,
        signupForm : {
          name: this.props.userData.name,
          email : this.props.userData.email,
          address : this.props.userData.address,
          city : this.props.userData.city,
          zipCode : this.props.userData.zip_code,
          country : this.props.userData.country,
          stateRegion : this.props.userData.state_region,
          avatarSource : this.props.userData.profile_pic
        },
        user : this.props.userData
    };

    this.originalData = Object.assign({}, this.state.signupForm);

    // Select Box Flags
    this.countryMode = false;
    this.stateRegionMode = false;

    // New Location Object to supply locations to menus
    this.locations = new Locations();
    this.selectItems = [];

    this.options = {
      title: 'Select Avatar',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      returnBase64Image: true,
      returnIsVertical: false
    };

    this.v = new Validator();

    this.signupFormRules = {
      name: [this.v.Str, "Name is required."],
      email : [this.v.Email, "Please enter a valid email."],
      address : [this.v.Str, "Address is required."],
      city : [this.v.Str, "City is required."],
      zipCode : [this.v.ZipCode, "Please enter a valid zip code."],
      country : [this.v.Str, "Country is required."],
      stateRegion : [this.v.Str, "State / Region is rquired."],
      avatarSource : [this.v.Str, "There is an issue with your profile image.", null]
    };

    this.v.setRules(this.signupFormRules);
  }

  updateKeyboardSpace(frames) {
    if (frames !== undefined && frames.end !== undefined) {
      this.setState({keyboardSpace: frames.end.height});
    }
  }

  resetKeyboardSpace() {
    this.setState({keyboardSpace: 0});
  }

  stepTwoSignUpPage(category) {
    this.props.route.push({
      component: SignUpSecondStep,
      title: SignUp,
      passProps : {
        category : category,
        showLogin : this.toggleLogin.bind(this)
      }
    });
  }

  showCountryPopover() {
    this.selectItems = this.locations.getCountries();
    this.countryMode = true;
    this.setState({isVisible: true});
  }

  showStateRegionPopover() {
    if (this.state.signupForm.country === null) {
      this.setState({selectCountryFirst : true});
      return false;
    }
    this.selectItems = this.locations.getStateRegions();
    this.stateRegionMode = true;
    this.setState({isVisible: true});
  }

  closePopover() {
    this.countryMode = false;
    this.stateRegionMode = false;
    this.setState({isVisible: false});
  }

  setItem(item) {
    var signupForm = this.state.signupForm;
    if (this.countryMode) {

      // Set state for country
      signupForm.country = item;
      // Reset state for state / region
      signupForm.stateRegion = null;

      this.setState({signupForm: signupForm});
      this.setState({selectCountryFirst : false});

      this.locations.setStateRegions(this.state.signupForm.country);
      this.countryMode = false;
    } else if (this.stateRegionMode) {
      signupForm.stateRegion = item;
      this.setState({signupForm: signupForm});
      this.stateRegionMode = false;
    }
  }

  backToIntro() {
    this.props.closeSignupForm();
  }

  submitData(data) {
    var authService = require('../Utils/AuthService');
    authService.changeProfileSettings('profile', data, (results) => {

      if (results) {
          this.setState({showProgress : false});
          this.props.route.pop();
      }
    });
  }

  submitSettings() {
    var valid = this.v.validateData(this.state.signupForm),
        self = this;

    // check for profile data change
    if (!_.isMatch(this.originalData, this.state.signupForm)) {
      this.setState({showProgress : true});
      if (typeof valid === "boolean" && valid) {
          // validate address
          this.validateAddress((result) => {
            if (typeof result !== "object") {
              // return error message
              this.setState({showProgress : false});
              self.setState({formError : "Please enter a valid address."});
              return false;
            }

            var signupForm = this.state.signupForm,
                profilePic = (this.state.avatarSource) ? this.state.avatarSource : this.state.user.profile_pic;
                mergedObj = Object.assign(result[0].location, {avatarSource : profilePic});
                console.log(profilePic);
            self.setState({signupForm : Object.assign(signupForm, mergedObj)});
            // run function to submit date via ajax
            self.submitData(this.state.signupForm);
          });
      }

      // set error
      this.setState({showProgress : false});
      this.setState({formError : valid.error});
      return false;
    } else {
      // navigate back to settings view
      this.props.route.pop();
    }
  }

  validateAddress(cb) {
    var signupForm = this.state.signupForm,
        address = `${signupForm.address}, ${signupForm.city}, ${signupForm.stateRegion} ${signupForm.zipCode}`;
    RNGeocoder.geocodeAddress(address, (err, data) => {
      if (err) {
        cb(err);
        return;
      }
      cb(data);
    });
  }

  getProfilePicture() {
    UIImagePickerManager.showImagePicker(this.options, (type, response) => {
      if (type !== 'cancel') {
        var source;
        if (type === 'data') { // New photo taken OR passed returnBase64Image true -  response is the 64 bit encoded image data string
          source = {uri: 'data:image/jpeg;base64,' + response, isStatic: true};
        } else { // Selected from library - response is the URI to the local file asset
          source = {uri: response};
        }
        this.setState({avatarSource:source});
      } else {
        console.log('Cancel');
      }
    });
  }

  updateFormData(data) {
    var signupForm = this.state.signupForm,
        formInput = Object.keys(data)[0];
    signupForm[formInput] = data[formInput];
    this.setState({signupForm: signupForm});
  }

  closeSettings() {
    this.props.closeSettings(false);
  }

  goToPasswordSettings() {
    this.props.route.push({
      component: require('./PasswordSettings'),
      title : 'Change Password',
      titleStyle : {
        color : '#333'
      }
    });
  }

  render() {
    console.log(this.state.user);
    console.log(this.state.avatarSource);
    var errorCtrl = <View />;
    var avatar = <Image source={{uri : this.state.user.profile_pic}} style={{width: 50, height: 50, borderRadius: 16, alignSelf: 'center', marginTop: 10, marginBottom: 10}} />;
    var countrySelectText = <Text style={styles.countryText}>Current Country: {this.state.user.country}</Text>;
    var stateRegionSelectText = <Text style={styles.stateRegionText}>Current State /Region: {this.state.user.state_region}</Text>;

    if (this.state.formError != null) {
      errorCtrl = <Text style={styles.error}>
        {this.state.formError}
      </Text>;
    }

    if (this.state.avatarSource && this.state.avatarSource != null) {
        avatar = <Image source={{uri : this.state.user.avatarSource}} style={{width: 50, height: 50, borderRadius: 16, alignSelf: 'center', marginTop: 10, marginBottom: 10}} />;
    }

    if (this.state.signupForm.country != null) {
        var countryText = (this.state.signupForm.country.length > 14) ? ((this.state.signupForm.country.substring(0, 14-3)) + '...') : this.state.signupForm.country;
        countrySelectText = <Text style={styles.countryText}>{countryText}</Text>;
    }

    if (this.state.signupForm.stateRegion != null) {
      var stateRegionText = (this.state.signupForm.stateRegion.length > 14) ? ((this.state.signupForm.stateRegion.substring(0, 14-3)) + '...') : this.state.signupForm.stateRegion;
      stateRegionSelectText = <Text style={styles.stateRegionText}>{ this.state.signupForm.stateRegion }</Text>;
    }

    if (this.state.selectCountryFirst == true) {
      errorCtrl = <Text style={styles.error}>Select a country first.</Text>;
    }

    return (
      <View style={{flex: 1, height : Dimensions.get('window').height, backgroundColor: '#ffffff'}}>

              <View style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                marginTop: 64
              }}>
              <View>
                <TouchableOpacity onPress={this.getProfilePicture.bind(this)}>
                  {avatar}
                </TouchableOpacity>
                <Separator />
                <TextInput
                  style={styles.signupInput}
                  placeholder="Name"
                  placeholderTextColor="#cdcdcd"
                  defaultValue={this.state.user.name}
                  onChangeText={(text) => this.updateFormData({name : text.trim()})}
                  />
                <Separator />
                <TextInput
                  style={styles.signupInput}
                  placeholder="Email"
                  placeholderTextColor="#cdcdcd"
                  defaultValue={this.state.user.email}
                  onChangeText={(text) => this.updateFormData({email: text.trim()})}
                />
                <Separator />
                <TextInput
                  style={styles.signupInput}
                  placeholder="Address"
                  placeholderTextColor="#cdcdcd"
                  defaultValue={this.state.user.address}
                  onChangeText={(text) => this.updateFormData({address: text.trim()})}
                />
                <Separator />
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <TextInput
                    style={styles.halfInput}
                    placeholder="City"
                    placeholderTextColor="#cdcdcd"
                    defaultValue={this.state.user.city}
                    onChangeText={(text) => this.updateFormData({city: text.trim()})}
                  />
                  <TextInput
                    style={styles.halfInput}
                    placeholder="Zip Code"
                    placeholderTextColor="#cdcdcd"
                    defaultValue={this.state.user.zip_code}
                    onChangeText={(text) => this.updateFormData({zipCode: text.trim()})}
                  />
                </View>
                <Separator />
                <TouchableHighlight
                  style={styles.countrySelect}
                  onPress={this.showCountryPopover.bind(this)}
                  underlayColor="white">
                  {countrySelectText}
                </TouchableHighlight>
                <Separator />
                <TouchableHighlight
                  style={styles.citySelect}
                  onPress={this.showStateRegionPopover.bind(this)}
                  underlayColor="white">
                  {stateRegionSelectText}
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.optionRow}
                  onPress={this.goToPasswordSettings.bind(this)}
                  underlayColor="white">
                    <View style={[styles.settingLinkInnerWrap, {width : Dimensions.get('window').width}]}>
                      <Text style={[styles.optionText, styles.settingLinkText]}>Change Password</Text>
                      <Icon style={styles.optionIcon} name={"chevron-right"}></Icon>
                    </View>
                </TouchableHighlight>
              </View>
              <TouchableHighlight
                style={[ styles.signUpBtn, {marginLeft : 10, marginRight : 10}]}
                onPress={this.submitSettings.bind(this)}
                underlayColor="white">
                <Text style={styles.text}>Save Changes</Text>
              </TouchableHighlight>
              <View style={styles.bottomSection}>
                {errorCtrl}

                <ActivityIndicatorIOS
                  style={styles.loader}
                  animating={this.state.showProgress}
                  size="large" />
              </View>
            </View>
          <ListPopover
          list={this.selectItems}
          isVisible={this.state.isVisible}
          onClick={this.setItem.bind(this)}
          onClose={this.closePopover.bind(this)}/>
        </View>
    )
  }
};

module.exports = ProfileSettings;
