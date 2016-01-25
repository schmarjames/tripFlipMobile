let React = require('react-native');
let General = require('./General');
let { StyleSheet, Dimensions } = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  bg : {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center'
  },
  bgWrapper : {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  card: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height * (2/4),
    backgroundColor: 'red',
    borderRadius: 5,
    overflow: 'hidden'
  },
  explorerControls : {
    height : 50,
    paddingLeft : 20,
    paddingRight : 20,
    flexDirection : 'row',
    marginTop : 20,
    alignItems : 'center',
    backgroundColor : 'transparent'
  },
  backButton : {
    backgroundColor : 'transparent',
    borderWidth : 1,
    borderColor : General.primColor,
    borderRadius : 50,
    width: 40,
    height: 40,
    flexDirection : 'column',
    alignItems : 'center',
    paddingTop : 4,
    marginRight : 10
  },
  likeButton : {
    backgroundColor : 'transparent',
    borderWidth : 1,
    borderColor : General.secColor,
    borderRadius : 50,
    width: 50,
    height: 50,
    flexDirection : 'column',
    alignItems : 'center',
    padding: 6,
    marginLeft : 5
  },
  backIcon : {
    color : General.primColor,
    fontSize : 28
  },
  LikeIcon : {
    color: General.secColor,
    fontSize : 40
  },
  yup: {
    borderColor: 'green',
    borderWidth: 2,
    position: 'absolute',
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 20,
  },
  yupText: {
    fontSize: 16,
    color: 'green',
  },
  nope: {
    borderColor: 'red',
    borderWidth: 2,
    position: 'absolute',
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 20,
  },
  nopeText: {
    fontSize: 16,
    color: 'red',
  },
  loader : {
    alignSelf: 'center',
    marginTop: 20
  }
});

module.exports = styles;
