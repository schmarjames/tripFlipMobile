let React = require('react-native');
let General = require('./General');

let { StyleSheet, Dimensions } = React;

var axisWidth = Dimensions.get('window').width - 120;
var styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

    navTitle : {
      position : 'absolute',
      left : 26,
      width: Dimensions.get('window').width - 152,
      alignItems: 'center',
      backgroundColor : 'red'
    },

    titleText: {
      fontSize: 18,
      color: '#333',
    },

  buttonView: {
    justifyContent: 'center',
    padding: 4,
    width: 180,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4
  },

  button: {
    marginBottom: 40
  },

  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0)'
  },

  image: {
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },

  activity: {
    position: 'absolute',
    height: 64,
    width: axisWidth,
    top: 0,
    left: (Dimensions.get('window').width - axisWidth) / 2
  },

  navbar: {
    width: Dimensions.get('window').width,
    height: 64,
    backgroundColor: '#5e5f67',
    justifyContent: 'center'
  },

  axisView: {
    marginTop: 40,
    width: axisWidth,
    height: 8,
    borderRadius: 4,
    backgroundColor : '#fff',
    alignSelf: 'center',
    justifyContent: 'center'
  },

  progress: {
    alignSelf: 'flex-start',
    height: 6,
    borderRadius: 3,
  },
  popoverWrapper : {
    width: Dimensions.get('window').width,
    padding : 20
  },
  popoverView : {
    marginTop : 10,
    marginBottom : 20
  }
});

module.exports = styles;
