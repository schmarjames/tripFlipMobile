let React = require('react-native');
let General = require('./General');
let { StyleSheet, Dimensions } = React;

var styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor : "#ffffff"
  },
  categorySec : {
    flex : 1,
    flexDirection : "row",
    height: Dimensions.get('window').height / 4,
    marginTop : 0,
    marginBottom : 0,
    marginLeft : 0,
    marginRight : 0,
    overflow : "hidden",
    backgroundColor : "transparent",
    position : "relative"
  },
  textContainer : {
    height: 50,
    marginTop: 50
  },
  categoryName : {
    textAlign: "center",
    color : "#ffffff",
    fontSize: 16,
    fontFamily: General.font,
    fontFamily : 'Comfortaa-Bold',
    letterSpacing : 2,
  }
});

module.exports = styles;
