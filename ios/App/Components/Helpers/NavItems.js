let React = require('react-native');
let Icon = require('react-native-vector-icons/Ionicons');
let {View, Text} = React;

class AuthBackButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Icon name="ios-arrow-back" style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 16,
            color: '#FF8100',
          }}></Icon>
    )
  }
}

class BackButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex : 1, justifyContent : 'center', width: 44}}>
        <View style={{backgroundColor : 'transparent', justifyContent : 'center'}}>
          <Icon name="ios-arrow-back" style={{
              alignSelf: 'center',
              fontSize: 18,
              color: '#cdcdcd'
            }}></Icon>
        </View>

      </View>
    )
  }
}

module.exports = {
  BackButton : BackButton,
  AuthBack : AuthBackButton
}
