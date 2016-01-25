var blue = '#204F84';
var orange = '#FF8100';
var error = 'red';
var font = 'Comfortaa-Bold';

var actionBtnBg = blue;
var actionTextColor = '#ffffff';
var actionOutlineTextColor = orange;

var general = {
  primColor : blue,
  secColor : orange,
  error : error,
  inputBgColor : 'transparent',
  font : font,
  actionBtn : {
    height : 55,
    borderRadius : 3,
    marginTop : 10,
    marginBottom : 10,
    backgroundColor : actionBtnBg,
    alignSelf : 'stretch',
    justifyContent : 'center'
  },
  actionOutlineBtn : {
    height : 55,
    borderRadius : 3,
    marginTop : 10,
    marginBottom : 10,
    backgroundColor: orange,
    justifyContent : 'center',
    alignSelf : 'stretch'
  },
  actionBtnText : {
    marginTop: 10,
    marginBottom: 10,
    fontFamily: font,
    fontSize: 16,
    color: actionTextColor,
    textAlign: 'center',
    alignItems: 'center'
  },
  actionOutlineText : {
    marginTop: 10,
    marginBottom: 10,
    fontFamily: font,
    fontSize: 16,
    color: actionOutlineTextColor,
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttonIconWrap : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnOutlineIcon : {
    fontSize: 20,
    color: "#ffffff",
    paddingVertical: 24,
    marginLeft: 20,
    position: 'absolute',
    left: 10
  },
  btnIconText : {
    fontFamily: font,
    fontSize: 16,
    color: "#ffffff",
    textAlign: 'center',
    alignItems: 'center'
  },
  actionText : {
    color : orange,
    fontSize : 16,
    paddingLeft : 10,
    paddingBottom : 10
  }
};

module.exports = general;
