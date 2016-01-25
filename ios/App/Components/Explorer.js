let React = require('react-native');
let Auth = require('../Utils/AuthService');
let styles = require('../Styles/Explorer');
let Photos = require('../Utils/Photos');
let AsyncStorage = require('react-native').AsyncStorage;
let reactMixin = require('react-mixin');
var Subscribable = require('Subscribable');
let clamp = require('clamp');
let BlurView = require('react-native-blur').BlurView;
let Icon = require('react-native-vector-icons/Ionicons');

let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  ActivityIndicatorIOS,
  PanResponder,
  LayoutAnimation,
  TouchableOpacity,
  processColor
} = React;

var SWIPE_THRESHOLD = 120;

var deck = [];

class Explorer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      deck: null,
      heartStatus : "ios-heart-outline",
      previousPhoto : false,
      previousLike : null,
      deckReady : false,
      showProgress : true,
      likeBounceValue: new Animated.Value(1),
      backBounceValue: new Animated.Value(1)
    }

    this.newIdx = 0;
    this.viewed = [];
    this.likeQueue = [];

    this.storeLikes = setInterval(() => {
      console.log(this.likeQueue);
      this.likePhoto();
    }, 5000);
  }

  _goToNextPerson() {
    let currentPersonIdx = deck.indexOf(this.state.deck);
    this.newIdx = currentPersonIdx + 1;

    // remove previous like if it isn't needed
    if (this.state.deck.id !== this.state.previousLike) {
      this.setState({previousLike : null});
    }

    this.setState({
      previousPhoto : false,
      heartStatus : "ios-heart-outline",
      deck: deck[this.newIdx > deck.length - 1 ? 0 : this.newIdx]
    }, () => setTimeout(() => {this._animateEntrance()}, 500));
  }

  componentWillMount() {
    var self = this,
        view = null;

    this.addListenerOn(this.props.events, 'explorerStatusEvent', this.explorerViewStatus);

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        var velocity;

        if (vx > 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }
    
        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          // Add photo id to viewed array
          this.viewed.push(this.state.deck.id);

          Animated.decay(this.state.pan.x, {
            velocity: velocity,
            deceleration: 0.98,
          }).start(this._resetState.bind(this))

          Animated.decay(this.state.pan.y, {
            velocity: vy,
            deceleration: 0.985,
          }).start();

          // Check the state of the deck
          this.checkDeck();
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    });

    this.addToDeck(null);

  }

  componentDidMount() {
    window.EventBus.on('updatePhotoData', (data) => {
      if (this.state.deck.id == data.id) {
        this._resetState();
      }
      for (var i=0; i <= deck.length; i++) {
          if(deck[i].id == data.id) {
            deck.splice(i, 1);
            this.checkDeck();
          }
      }

    });
    this._animateEntrance();
  }

  _animateEntrance() {
    Animated.spring(
      this.state.enter,
      { toValue: 1, friction: 8 }
    ).start();
  }

  explorerViewStatus(status) {
    console.log(status);
  }

  addToDeck() {
    var self = this;

    Photos.getRandomPhotos(/*this.viewed*/ null, (data) => {
      console.log(data);
      if(data.badCredentials || data.unknownError) {
        // change state of isLoggedIn to false
        AsyncStorage.multiRemove(['auth', 'user'], () => {
        clearInterval(this.storeLikes);
        window.EventBus.trigger('expiredLogin', true);
        self.setState({showProgress : false});
        });
      } else {

        // if not a fresh empty deck remove one before the current index of the deck
        if (deck.length > 0) {
          deck = deck.slice(deck.indexOf(this.state.deck)-1, deck.length);
          console.log(deck);
        }
        deck = deck.concat(data);
        console.log(deck);

        // check if new deck
        if (this.viewed.length == 0) {
          self.setState({deck : deck[0], showProgress : false}, () => {
            self.loadExplorer();
          });
        }
      }
    });
  }

  checkDeck() {
    console.log(deck.length - deck.indexOf(this.state.deck));
    if ((deck.length - deck.indexOf(this.state.deck)) <= 10 ) {
      this.addToDeck();
    }
  }

  addToLikeQueue(id) {
    if (this.state.previousLike == id) {
      this.setState({
        previousLike : null,
        heartStatus : "ios-heart-outline"
      });
      window.EventBus.trigger('updateLike', {id : id, add : false});
    } else {
      this.setState({
        previousLike : id,
        heartStatus : "ios-heart"
      });
      window.EventBus.trigger('updateLike', {id : id, add : true});
    }

    this.likeQueue.push(id);
    Animated.spring(                          // Base: spring, decay, timing
      this.state.likeBounceValue,                 // Animate `likeBounceValue`
      {
        toValue: 0.8,                         // Animate to smaller size
        friction: 4,                          // Bouncier spring
      }
    ).start(this._resetState.bind(this));
  }

  likePhoto() {
    if (this.likeQueue.length == 0) {return;}
    var self = this;

    Photos.likePhoto(this.likeQueue, (data) => {
      if (data.badCredentials || data.unknownError) {
        // change state of isLoggedIn to false
        AsyncStorage.multiRemove(['auth', 'user'], () => {
          clearInterval(this.storeLikes);
          self.setState({showProgress : false});
          window.EventBus.trigger('expiredLogin', true);
        });
      } else {
        if (!isNaN(data)) {
          this.likeQueue = [];
        }
      }
    });
  }

  backOnce() {
    var self = this;
    if (deck.indexOf(this.state.deck) > 0 && !this.state.previousPhoto) {
      this.setState({
        previousPhoto : true,
        deck: deck[deck.indexOf(this.state.deck)-1]
      }, () => {
        console.log(self.state.previousLike);
        console.log(self.state.deck.id);
        if (self.state.previousLike == self.state.deck.id) {
          self.setState({heartStatus : "ios-heart"});
        }
      });


    }
  }

  loadExplorer() {
    this.setState({deckReady : true});
  }

  _resetState() {
    this.state.likeBounceValue.setValue(1);
    this.state.pan.setValue({x: 0, y: 0});
    this.state.enter.setValue(0);
    this._goToNextPerson();
  }

  render() {
    var tempView = <ActivityIndicatorIOS
      style={styles.loader}
      animating={this.state.showProgress}
      size="large" />;
    var blurImage = <View></View>;

    if (this.state.deckReady) {
      tempView = <Image style={styles.bg} source={{uri : this.state.deck.url }} />;
      blurImage = <View style={styles.bgWrapper}>
        <Image style={styles.bg} source={{uri : this.state.deck.url }} />
        <View style={styles.bgOverlay}></View>
      </View>;
    }

    let { pan, enter, } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})
    let scale = enter;

    let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    let yupOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    let yupScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    let animatedYupStyles = {transform: [{scale: yupScale}], opacity: yupOpacity}

    let nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    let animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity}

    /*
      Yes / No views
      <Animated.View style={[styles.nope, animatedNopeStyles]}>
        <Text style={styles.nopeText}>Nope!</Text>
      </Animated.View>

      <Animated.View style={[styles.yup, animatedYupStyles]}>
        <Text style={styles.yupText}>Yup!</Text>
      </Animated.View>
    */
    return (
      <View style={styles.container}>
        {blurImage}
        <BlurView blurType="dark"
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: processColor('rgba(0,0,0,0.6)'),
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }}
        />

          <Animated.View style={[styles.card, animatedCardStyles, {backgroundColor: 'transparent'}]} {...this._panResponder.panHandlers}>
            {tempView}
            </Animated.View>

          <View style={styles.explorerControls}>
            <Animated.View style={[styles.backButton, { transform: [ {scale: this.state.backBounceValue} ] }]}>
              <TouchableOpacity onPress={this.backOnce.bind(this)}>
                <Icon name="ios-arrow-thin-left" style={styles.backIcon}></Icon>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.likeButton, { transform: [ {scale: this.state.likeBounceValue} ] }]}>
              <TouchableOpacity onPress={() => { this.addToLikeQueue(this.state.deck.id); }}>
                <Icon name={this.state.heartStatus} style={styles.LikeIcon}></Icon>
              </TouchableOpacity>
            </Animated.View>
          </View>
      </View>
    );
  }
}

reactMixin(Explorer.prototype, Subscribable.Mixin);

module.exports = Explorer;
