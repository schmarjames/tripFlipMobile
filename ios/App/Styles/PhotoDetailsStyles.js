let React = require('react-native');
let General = require('./General');
let { StyleSheet } = React;

var styles = StyleSheet.create({
  container : {
    backgroundColor : "#ffffff"
  },
  headerWrap : {
    flex : 1,
    flexDirection : 'row',
    height : 40,
    backgroundColor : 'transparent'
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
  space : {
    marginTop : 5,
    marginBottom : 5
  },
  locationText : {
    flex : 1,
    fontSize : 16,
    fontFamily : 'Comfortaa-Bold',
    letterSpacing : 1,
    color : '#000',
  },
  authorInfo : {
    fontSize : 10,
    color : '#000'
  },
  photoDetails : {
    flex : 1,
    flexDirection : 'column',
    fontSize: 12,
    fontFamily: General.font,
    alignItems : 'center',
    textAlign: 'center',
    margin: 10,
    color: '#000',
    backgroundColor : "transparent"
  },
  photoStateInfo : {
    flex : 1,
    flexDirection : 'row',
    color : '#000'
  },
  photoText : {
    color : '#000',
    marginLeft : 5,
    marginRight : 5,
    fontSize : 12
  },
  weatherWrapper : {
    flex : 1,
    flexDirection : 'row',
    marginTop : 10,
    marginBottom : 10
  },
  weatherDetailWrapper : {
    flex : 3,
    flexDirection : 'row'
  },
  weatherIconWrapper : {
    flex : 2,
  },
  weatherDesc : {
    flex : 1
  },
  weatherText : {
    color : '#000',
    fontSize : 34,
    paddingTop : 12
  },
  weatherIcon : {
    fontSize : 80,
    color : '#000'
  },
  weatherDegreeIcon : {
    fontSize : 20,
    color : '#000',
    paddingTop : 12
  },
  detailButtons : {
    flex : 1,
    flexDirection : 'row',
    backgroundColor : 'transparent',
    justifyContent : 'center',
    padding : 5,
    marginTop : 40
  },
  detailIcon : {
    fontSize : 34,
    marginLeft : 30,
    marginRight : 30,
    color : '#000'
  },
  modalButtonsWrapper : {
    flex : 1,
    flexDirection : 'row',
    paddingTop : 20,
    height : 64,
    position : 'absolute',
    top : 0,
    left : 0,
    right : 0,
    backgroundColor : 'transparent'
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
