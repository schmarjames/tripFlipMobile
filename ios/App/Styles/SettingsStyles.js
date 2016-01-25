let React = require('react-native');
let General = require('./General');
let { StyleSheet, Dimensions } = React;

var styles = StyleSheet.create({
  container : {
    flex : 1,
    flexDirection : 'column',
    backgroundColor : "#ffffff",
    paddingTop : 65,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  subheader : {
    width : Dimensions.get('window').width,
    height : 45,
    backgroundColor : "#cdcdcd",
    paddingLeft : 20,
    justifyContent : 'center'
  },
  optionRow : {
    width : Dimensions.get('window').width,
    justifyContent : 'center',
    paddingLeft : 15,
    paddingRight : 15,
    height : 45,
    borderWidth : 1,
    borderColor : '#cdcdcd'
  },
  settingLinkInnerWrap : General.buttonIconWrap,
  optionText : {
    flex : 2,
    height : 45,
    justifyContent : 'center',
    alignItems : 'center',
    color : '#000'
  },
  settingLinkText : {
  },

  // profile setting styles
  bgWrapper : {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  bgOverlay : {
    backgroundColor: '#000',
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.8
  },
  bg : {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center'
  },
  signupForm : {
    flex: 1,
  //  flexDirection: 'column',
    height: 430,
    //marginTop: 100,
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  loader : {
    alignSelf: 'center',
    marginTop: 20
  },
  error : {
    alignSelf: 'center',
    color: General.error,
    fontSize: 16
  },
  signupInputWrapper : {
    flex: 1,
    //height: 300,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 3
  },
  bottomSection : {
    height: 30,
    marginTop: 20,
    backgroundColor : 'transparent',
    justifyContent : 'center'
  },
  closesignup : {
    fontSize: 40,
    color: General.secColor,
    position: 'absolute',
    top: 30,
    left: 30
  },
  signupInput : {
    height: 40,
    backgroundColor: General.inputBgColor,
    paddingLeft: 20
  },
  halfInput : {
    height: 40,
    flex: 1,
    marginRight: 10,
    backgroundColor: General.inputBgColor,
    paddingLeft: 20
  },
  countrySelect : {
    flex: 2,
    height: 40,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  countryText : {
    color: "#cdcdcd",
    padding: 10
  },
  citySelect : {
    flex: 2,
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  stateRegionText : {
    color: "#cdcdcd",
    padding: 10
  },
  createProfileBtn : {
    position: 'absolute',
    top: 40,
    right: 30,
    fontSize: 16,
    color: General.secColor
  },
  optionText : {
    flex : 8,
    alignItems : 'flex-start',
    color : '#000',
  },
  optionIcon : {
    flex : 1,
    alignItems : 'flex-end',
    color : '#000'
  },
  modalButtonsWrapper : {
    position : 'absolute',
    top : 0,
    left : 0,
    right : 0,
    backgroundColor : 'transparent'
  },
  changePasswordWrapper : {
    flex: 1,
    height: 180,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 3
  },
  text : General.actionBtnText,
  signUpBtn : General.actionBtn
});

module.exports = styles;
