let React = require('react-native');
let styles = require('../Styles/SignupStyles');
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
  DeviceEventEmitter
} = React;

class SignUp extends React.Component {
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
          name: null,
          email : null,
          password : null,
          address : null,
          city : null,
          zipCode : null,
          country : null,
          stateRegion : null,
          avatarSource : null
        }
    };

    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);

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
      password : [this.v.Str, "Password is required."],
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

  componentDidMount() {
    DeviceEventEmitter.addListener('KeyboardWillShow', this.updateKeyboardSpace);
    DeviceEventEmitter.addListener('KeyboardWillHide', this.resetKeyboardSpace);
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
    authService.register(data, (results) => {
      if (results.success) {
          this.setState(Object.assign({showProgress : false}, results));
          this.props.isLoggedIn(true);
      }
    });
  }

  onSignUpPressed() {
    var valid = this.v.validateData(this.state.signupForm),
        self = this;

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

          var signupForm = this.state.signupForm;
          self.setState(Object.assign(signupForm, result[0].location));
          // run function to submit date via ajax
          self.submitData(this.state.signupForm);
        });
    }

    // set error
    this.setState({showProgress : false});
    this.setState({formError : valid.error});
    return false;
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

  render() {
    var errorCtrl = <View />;
    var avatar = <Icon name="ios-camera" style={{color: "#cdcdcd", fontSize: 26, alignSelf: 'center', paddingTop: 10, paddingBottom: 5}}></Icon>;
    var countrySelectText = <Text style={styles.countryText}>Select Country</Text>;
    var stateRegionSelectText = <Text style={styles.stateRegionText}>Select State /Region</Text>;

    if (this.state.formError != null) {
      errorCtrl = <Text style={styles.error}>
        {this.state.formError}
      </Text>;
    }

    if (this.state.avatarSource != null) {
        avatar = <Image source={this.state.avatarSource} style={{width: 50, height: 50, borderRadius: 16, alignSelf: 'center', marginTop: 10, marginBottom: 10}} />;
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

    let paddingTop = 110 - this.state.keyboardSpace / 3;

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

            <View style={[styles.signupForm, {top : paddingTop}]}>
              <View style={styles.signupInputWrapper}>
                <TouchableOpacity onPress={this.getProfilePicture.bind(this)}>
                  {avatar}
                </TouchableOpacity>
                <Separator />
                <TextInput
                  style={styles.signupInput}
                  placeholder="Name"
                  placeholderTextColor="#cdcdcd"
                  onChangeText={(text) => this.updateFormData({name : text})}
                  />
                <Separator />
                <TextInput
                  style={styles.signupInput}
                  placeholder="Email"
                  placeholderTextColor="#cdcdcd"
                  onChangeText={(text) => this.updateFormData({email: text})}
                />
                <Separator />
                <TextInput
                  style={styles.signupInput}
                  placeholder="Password"
                  placeholderTextColor="#cdcdcd"
                  password={true}
                  onChangeText={(text) => this.updateFormData({password: text})}
                />
                <Separator />
                <TextInput
                  style={styles.signupInput}
                  placeholder="Address"
                  placeholderTextColor="#cdcdcd"
                  onChangeText={(text) => this.updateFormData({address: text})}
                />
                <Separator />
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <TextInput
                    style={styles.halfInput}
                    placeholder="City"
                    placeholderTextColor="#cdcdcd"
                    onChangeText={(text) => this.updateFormData({city: text})}
                  />
                  <TextInput
                    style={styles.halfInput}
                    placeholder="Zip Code"
                    placeholderTextColor="#cdcdcd"
                    onChangeText={(text) => this.updateFormData({zipCode: text})}
                  />
                </View>
                <Separator />
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
                    <TouchableHighlight
                      style={styles.countrySelect}
                      onPress={this.showCountryPopover.bind(this)}
                      underlayColor="white">
                      {countrySelectText}
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={styles.citySelect}
                      onPress={this.showStateRegionPopover.bind(this)}
                      underlayColor="white">
                      {stateRegionSelectText}
                    </TouchableHighlight>
                  </View>
              </View>
                <TouchableHighlight
                  style={styles.signUpBtn}
                  onPress={this.onSignUpPressed.bind(this)}
                  underlayColor="white">
                  <Text style={styles.text}>Create Profile</Text>
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
      <ListPopover
      list={this.selectItems}
      isVisible={this.state.isVisible}
      onClick={this.setItem.bind(this)}
      onClose={this.closePopover.bind(this)}/>
        </View>
    )
  }
};

module.exports = SignUp;
