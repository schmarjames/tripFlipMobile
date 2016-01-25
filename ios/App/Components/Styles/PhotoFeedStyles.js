let React = require('react-native');
let General = require('./General');
let { StyleSheet } = React;

var styles = StyleSheet.create({
  container : {
    backgroundColor : "#ffffff"
  },
  entryWrap : {
    flex : 1,
    flexDirection : "column",
    marginTop : 0,
    marginBottom : 0,
    marginLeft : 0,
    marginRight : 0,
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
    top : 0,
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
    fontSize : 20,
    margin : 5,
    color : "#ffffff"

  },
  entryImageWrap : {
    flex : 1,
    height: 200
  },
  entryImage : {
    flex : 1,
    height: 200
  },
  entryBottomSection : {
    flex : 1,
    height: 40,
    padding: 5,
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
