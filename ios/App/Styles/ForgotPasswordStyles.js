let React = require('react-native');
let General = require('./General');
let { StyleSheet } = React;

var forgotPassword = Object.assign({
  alignSelf : 'flex-start',
  paddingLeft : 10,
  paddingBottom : 10
}, General.actionText);

var changePassMessage = Object.assign({
  alignSelf : 'flex-start',
  paddingBottom : 10
}, General.actionText);

var styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
    opacity: 0.8
  },
  bg : {
    flex: 1,
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
    paddingLeft : 10,
    paddingRight : 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  forgotPasswordModal : {
    flex: 1,
    flexDirection: 'column',
    height: 400,
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
    alignSelf: 'center',
    color: 'red',
    fontSize: 16
  },
  topSection : {
    flex : 1,
    height : 90,
    marginBottom : 10,
    flexDirection : 'column',
    justifyContent : 'center'
  },
  forgotPassword : forgotPassword,
  changePassMessage : changePassMessage,
  loginModalInputWrapper : {
    flex: 1,
    height: 180,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 3
  },
  closeLoginModal : {
    fontSize: 50,
    color: '#FF8100',
    position: 'absolute',
    top: 30,
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
