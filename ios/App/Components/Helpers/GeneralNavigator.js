let React = require('react-native');
let Popover = require('react-native-popover');
let Icon = require('react-native-vector-icons/Ionicons');
let screen = require('Dimensions').get('window');
let reactMixin = require('react-mixin');
let EventEmitter = require('EventEmitter');
let Subscribable = require('Subscribable');

let axisWidth = screen.width - 120;

let {
  Image,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  Animated
} = React;

class NavbarWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title : props.title,
      topPos : new Animated.Value(0)
    }
  }

  componentWillMount() {
    window.EventBus.on('animateNav', (status) => {
      if (!status) {
        Animated.spring(
          this.state.topPos,
          {
            toValue: 0,
            friction : 10
          }
        ).start();
      } else {
        Animated.spring(
          this.state.topPos,
          {
            toValue: -64,
            friction : 10
          }
        ).start();
      }
    });
  }

  componentWillReceiveProps(newProps) {}

  componentDidMount() {}

  render() {
    var title = <View></View>;

    if (this.state.title !== null) {
      title = <Text style={styles.titleText}>{this.state.title}</Text>;
    }

    return (
      <Animated.View style={[styles.container, {top : this.state.topPos}]}>
        <View style={[styles.corner, styles.leftCorner]}>
          <TouchableHighlight onPress={this.props.route.pop} underlayColor="transparent">
            <View style={styles.backView}>
              <Icon name="ios-arrow-back" style={styles.btnIcon}></Icon>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.navTitle}>
          <Text style={styles.titleText}>{this.props.title.toUpperCase()}</Text>
        </View>
      </Animated.View>
      );
  }
}

var styles = StyleSheet.create({
  container: {
    width: screen.width,
    height: 64,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#c8c8c8',
    justifyContent: 'center',
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

reactMixin(NavbarWrapper.prototype, Subscribable.Mixin);

module.exports = NavbarWrapper;
