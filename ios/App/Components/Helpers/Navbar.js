let React = require('react-native');
let NavItem = require('./NavItems');
let Icon = require('react-native-vector-icons/Ionicons');
let screen = require('Dimensions').get('window');

let {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} = React;

class NavbarContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayBack : false,
      displaySearch : false,
      displayGalleryMenu : false,
      displayPopoverLink : true
    };
  }

  componentDidMount() {
    window.EventBus.on('navigationChanged', (data) => {

      if (data.current > 0) {
        this.setState({displayBack : true});
      }

      else if (data.current == 0) {
        this.setState({displayBack : false});
      }

      if (data.current == 2) {
        this.setState({displayPopoverLink : false});
      } else {
        this.setState({displayPopoverLink : true});
      }
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.displaySearch !== this.state.displaySearch) {
      this.setState({ displaySearch : newProps.displaySearch });
    }

    if (newProps.displayGalleryMenu != this.state.displayGalleryMenu) {
      this.setState({displayGalleryMenu : newProps.displayGalleryMenu});
    }
  }

  render() {
    var searchButton = <View></View>;
    var backButton = <View></View>;
    var popoverLink = <View></View>;

    if (this.state.displaySearch) {
      searchButton =
          <View style={[styles.corner, styles.midRightCorner]}>
            <TouchableHighlight onPress={this.props.showSearch} underlayColor="transparent">
              <View style={styles.backView}>
                <Icon name="ios-search" style={styles.btnIcon}></Icon>
              </View>
            </TouchableHighlight>
          </View>;
    }

    if (this.state.displayBack) {
      backButton = <View style={[styles.corner, styles.leftCorner]}>
        <TouchableHighlight onPress={this.props.goBack} underlayColor="transparent">
          <View style={styles.backView}>
            <Icon name="ios-arrow-back" style={styles.btnIcon}></Icon>
          </View>
        </TouchableHighlight>
      </View>
    }

    if (this.state.displayPopoverLink) {
      popoverLink = <View style={[styles.corner, styles.rightCorner]}>
        <TouchableHighlight
          ref='button'
          onPress={
            () => {

              this.setState({
                displayGalleryMenu : (this.state.displayGalleryMenu) ? false : true
              }, () => {
                if (this.state.displayGalleryMenu) {
                  this.refs.button.measure((ox, oy, width, height, px, py) => {
                    this.props.showMenu({x: px, y: py, width: width, height: height});
                  });
                } else {
                  this.props.showMenu(false);
                }

              });

            }
          }
          underlayColor="transparent">
          <View style={styles.backView}>
            <Icon name="more" style={styles.btnIcon}></Icon>
          </View>
        </TouchableHighlight>
      </View>
    }

    return (
      <View style={styles.container}>
        {backButton}

        <View style={styles.navTitle}>
          <Text style={styles.titleText}>ALBUM</Text>
        </View>

        {popoverLink}
        {searchButton}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    width: screen.width,
    height: 64,
    justifyContent: 'center',
    backgroundColor : 'transparent'
  },

  navTitle : {
    position : 'absolute',
    left : 26,
    width: screen.width - 52,
    alignItems: 'center',
    backgroundColor : 'transparent'
  },

  titleText: {
    fontSize: 14,
    fontFamily : 'Comfortaa-Bold',
    letterSpacing : 2,
    color: '#333',
  },

  corner: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
  },

  leftCorner: {
    width: 26,
    height: 26,
    backgroundColor: "transparent",
    left : 0
  },

  midRightCorner: {
    width: 26,
    height: 26,
    backgroundColor : "transparent",
    right: 34
  },

  rightCorner: {
    width: 26,
    height: 26,
    backgroundColor: "transparent",
    right: 0
  },

  btnIcon: {
    alignSelf: 'center',
    color : '#333',
    fontSize : 18
  },

  backView: {
    flex : 1,
    height : 20,
    justifyContent: 'center',
    backgroundColor : 'transparent'
  }
});

module.exports = NavbarContent;
