let React = require('react-native');
let General = require('./General');
let { StyleSheet, Dimensions } = React;

var forgotPassword = Object.assign({
  alignSelf : 'flex-start',
}, General.actionText);

var changePassMessage = Object.assign({
  alignSelf : 'flex-start',
  paddingBottom : 10
}, General.actionText);

var styles = StyleSheet.create({
   container : {
     flex: 1,
     flexDirection : 'column',
     backgroundColor: '#F5FCFF',
   },
   title : {
     position : 'absolute',
     top : (Dimensions.get('window').height / 4) - 10,
     left : 0,
     right : 0,
     textAlign : 'center',
     fontFamily : 'Comfortaa-Bold',
     fontSize : 32,
     color : '#ffffff',
     backgroundColor : 'transparent'
   },
  swipeWrapper : {
    flex : 1
  },
  slide1: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: 'transparent',
   },
   slide2: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'transparent',
   },
   slide3: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'transparent',
   },
   welcomeSlideText : {
     textAlign : 'center',
     color : '#ffffff',
     paddingLeft : 10,
     paddingRight : 10
   },
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
    opacity: 0.6
  },
  bg : {
    width : Dimensions.get('window').width,
    resizeMode: 'cover',
    alignItems: 'center'
  },
  welcome : {
    flex: 6,
    fontSize: 20,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 10
  },
  introButtons : {
    flex: 1,
    height : Dimensions.get('window').height - (Dimensions.get('window').height / 4),
    backgroundColor: '#ffffff',
  },
  loginModal : {
    flex: 1,
    flexDirection: 'column',
    height: 320,
    marginTop: 100,
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    opacity: 1
  },
  forgotPasswordModal : {
    flex: 1,
    flexDirection: 'column',
    height: 260,
    marginTop: 100,
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
  changePasswordModal : {
    flex: 1,
    flexDirection: 'column',
    height: 370,
    marginTop: 100,
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
    textAlign : 'center',
    alignSelf: 'center',
    color: 'red',
    fontSize: 16
  },
  changePassMessage : changePassMessage,
  forgotPasswordTopView : {
    flex : 1,
    height : 90,
    marginBottom : 10,
    flexDirection : 'column',
    justifyContent : 'center'
  },
  forgotPassword : forgotPassword,
  loginModalInputWrapper : {
    flex: 1,
    height: 180,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 3
  },
  bottomSection : {
    flex : 1,
    height: 60,
    marginTop: 10,
    backgroundColor : 'transparent',
    flexDirection : 'column',
    justifyContent : 'center'
  },
  closeLoginModal : {
    fontSize: 40,
    color: '#FF8100',
    position: 'absolute',
    top: 0,
    right: 30
  },
  loginModalInput : {
    height: 40,
    backgroundColor: 'transparent',
    paddingLeft: 20
  },
  loginModalBtn : {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#204F84',
    borderRadius: 3,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  signInBtn : General.actionOutlineBtn,
  signInBtnInnerWrap : General.buttonIconWrap,
  btnIcon : General.btnOutlineIcon,
  signInText : General.btnIconText,
  signUpBtn : General.actionBtn,
  loginBtn : General.actionBtn,
  text : General.actionBtnText
});

module.exports = styles;
