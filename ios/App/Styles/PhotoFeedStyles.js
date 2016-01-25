let React = require('react-native');
let General = require('./General');
let { StyleSheet, Dimensions } = React;

var styles = StyleSheet.create({
  container : {
  },
  entryWrap : {
    flex : 1,
    flexDirection : "column",
    marginTop : 4,
    marginBottom : 2.5,
    marginLeft : 10,
    marginRight : 10,
    overflow : "hidden",
    backgroundColor : "transparent",
    position : "relative"
  },
  linearGradient : {
    flex : 1,
    flexDirection : "row",
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor : "transparent",
    position : "absolute",
    bottom : 0,
    left : 0,
    right : 0
  },
  entryTopSection : {
    flex : 2,
    fontSize: 12,
    fontFamily: General.font,
    textAlign: 'left',
    margin: 10,
    color: '#ffffff',
    backgroundColor : "transparent"
  },
  likeIcon : {
    fontSize : 32,
    marginRight : 10,
    marginBottom : 10,
    color : "#ffffff"

  },
  entryImageWrap : {
    flex : 1,
    height: Dimensions.get('window').height / 3
  },
  entryImage : {
    flex : 1,
    height: Dimensions.get('window').height / 3,
  },
  entryBottomSection : {
    flex : 2,
    fontSize: 12,
    fontFamily: General.font,
    fontWeight : 'bold',
    textAlign: 'left',
    margin: 10,
    color: '#ffffff',
    backgroundColor : "transparent"
  },
  photoInfo : {
    flex : 2,
    flexDirection : "row"
  },
  photoTotalLikes : {
    color : "#999",
    fontFamily : General.font,
    fontSize : 8
  },
  weather : {
    color : "#999",
    fontFamily : General.font,
    fontSize : 8,
    textAlign : "right"
  },
  photoAuthor : {
    color : "#999",
    fontFamily : General.font,
    fontSize : 8
  },
  photoLikeAmount : {
    color : "#999",
    fontFamily : General.font,
    fontSize : 8,
    marginLeft : 5
  },
  moreLoadWrap : {
    flex: 1,
    backgroundColor : 'transparent',
    flexDirection : 'column',
    justifyContent : 'center',
    position : "absolute",
    bottom : 100,
    left : 0,
    right : 0
  },
  moreFeedsLoader : {
    alignSelf: 'center',
    backgroundColor : "transparent"
  },
  feedLoader : {
    alignSelf: 'center',
    backgroundColor : "transparent",
  }
});

module.exports = styles;
